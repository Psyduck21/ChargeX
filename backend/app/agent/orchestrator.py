from typing import List, Dict, Any, Optional
import logging
import json
import re
import difflib
from datetime import date, timedelta

from .tools.location import tool_geocode_location
from .tools.charging import (
    tool_find_stations_nearby,
    tool_create_booking_request,
    tool_search_station_by_name,
    current_user_id,
)

from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage, ToolMessage

logger = logging.getLogger(__name__)

# We use the qwen2.5:3b model running locally on Ollama
llm = ChatOllama(model="qwen2.5:3b", temperature=0)

tools = [
    tool_geocode_location,
    tool_search_station_by_name,
    tool_find_stations_nearby,
    tool_create_booking_request,
]

llm_with_tools = llm.bind_tools(tools)
tool_map = {tool.name: tool for tool in tools}

# ─────────────────────────────────────────────────────────────────────────────
# Helpers: extract booking intent from the very first user message natively
# so we don't rely on the LLM to parse dates/times correctly.
# ─────────────────────────────────────────────────────────────────────────────

def _resolve_relative_date(text: str) -> Optional[str]:
    """
    Detects relative date words in text and returns YYYY-MM-DD.
    Checks for: today, tomorrow, day after tomorrow.
    Returns None if no pattern matched.
    """
    text_lower = text.lower()
    today = date.today()

    if "day after tomorrow" in text_lower:
        return (today + timedelta(days=2)).isoformat()
    if "tomorrow" in text_lower:
        return (today + timedelta(days=1)).isoformat()
    if "today" in text_lower:
        return today.isoformat()

    # Check explicit date patterns: DD/MM/YYYY or YYYY-MM-DD or DD-MM-YYYY
    # YYYY-MM-DD
    m = re.search(r'\b(\d{4})-(\d{2})-(\d{2})\b', text)
    if m:
        return f"{m.group(1)}-{m.group(2)}-{m.group(3)}"
    # DD/MM/YYYY
    m = re.search(r'\b(\d{1,2})[/-](\d{1,2})[/-](\d{4})\b', text)
    if m:
        d_, mo, yr = m.group(1), m.group(2), m.group(3)
        return f"{yr}-{mo.zfill(2)}-{d_.zfill(2)}"

    return None


def _convert_time_to_24h(text: str) -> Optional[str]:
    """
    Extracts a time from text and converts it to HH:MM (24-hour).
    Handles: 2pm, 2:30pm, 14:00, 2 PM, 2:30 AM, etc.
    Also handles "at 2" by assuming PM if it's currently morning/afternoon.
    Returns None if no time found.
    """
    # Pattern: H[:MM][am|pm]
    pattern = re.compile(
        r'\b(\d{1,2})(?::(\d{2}))?\s*(am|pm|AM|PM)\b',
        re.IGNORECASE
    )
    m = pattern.search(text)
    if m:
        hour = int(m.group(1))
        minute = int(m.group(2)) if m.group(2) else 0
        meridiem = m.group(3).lower()
        if meridiem == 'pm' and hour != 12:
            hour += 12
        if meridiem == 'am' and hour == 12:
            hour = 0
        return f"{hour:02d}:{minute:02d}"

    # Already 24h pattern HH:MM (no am/pm)
    m24 = re.search(r'\b(\d{1,2}):(\d{2})\b', text)
    if m24:
        h, mn = int(m24.group(1)), int(m24.group(2))
        if 0 <= h <= 23 and 0 <= mn <= 59:
            return f"{h:02d}:{mn:02d}"

    # Pattern: "at 2" or "at 14" (implicit)
    m_at = re.search(r'\b(?:at|@)\s+(\d{1,2})\b', text, re.IGNORECASE)
    if m_at:
        h = int(m_at.group(1))
        if 0 <= h <= 23:
            # Heuristic: if h < 7, it's probably PM (e.g. "at 2" -> 14:00)
            if h < 12 and h > 0:
                # If they say "at 2", they likely mean 2pm unless specified.
                # However, to be safe, we could check current time, 
                # but let's stick to a simple 12h->24h bias if h is small.
                if h <= 7: h += 12 
            return f"{h:02d}:00"

    return None


def _extract_booking_intent(text: str) -> Dict[str, Optional[str]]:
    """
    Tries to extract station name, time (24h), and date from a free-form booking message.
    Returns a dict with keys: station, time_24h, date_iso (all may be None).
    """
    result = {"station": None, "time_24h": None, "date_iso": None}

    # Date & Time are easier to pick out first
    result["date_iso"] = _resolve_relative_date(text)
    result["time_24h"] = _convert_time_to_24h(text)

    # Station extraction logic:
    # 1. Look for specific pattern: book [Station] [Time] [Date]
    # We use a lazy match for station and ensure it doesn't swallow 'at', 'on', etc.
    specific_pattern = re.search(r'book\s+(.+?)(?:\s+(?:at|on|for|@))?\s+(today|tomorrow|day after tomorrow|\d{1,2}(?::\d{2})?\s*(?:am|pm)?|\d{4}-\d{2}-\d{2})', text, re.IGNORECASE)
    if specific_pattern:
        candidate = specific_pattern.group(1).strip()
        # Strip trailing "at", "on", "for" etc.
        candidate = re.sub(r'\s+(?:at|on|for|@|in)$', '', candidate, flags=re.IGNORECASE)
        if candidate.lower() not in ("a slot", "slot", "at") and not _looks_like_time(candidate):
            result["station"] = candidate

    # 2. Try implicit booking pattern: station_name + time (without "book" keyword)
    if not result["station"]:
        implicit_pattern = re.search(r'(\w[\w\s]*?)\s+(?:at|@)\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)', text, re.IGNORECASE)
        if implicit_pattern:
            candidate = implicit_pattern.group(1).strip()
            if len(candidate) > 2 and candidate.lower() not in ("a slot", "slot") and not _looks_like_time(candidate):
                result["station"] = candidate

    # 3. Fallback to general patterns if not yet found
    if not result["station"]:
        station_patterns = [
            r'book\s+(.+?)\s+(?:at|on|for|@)\s+\d',       # "book Central EV at 2pm"
            r'book\s+(?:a\s+slot\s+at\s+|slot\s+at\s+)?(.+?)\s+(?:for|at|on|by|tomorrow|today|day after)',
            r'(?:charge|charging)\s+(?:at|on|for|@)\s+(.+?)(?:\s+at|\s+on|\s+for|\s*$)',
            r'book\s+(?:a\s+slot\s+at\s+|slot\s+at\s+)?(.+?)$',  # "Book Central Station" (as last resort)
        ]
        for pat in station_patterns:
            m = re.search(pat, text, re.IGNORECASE)
            if m:
                candidate = m.group(1).strip().rstrip(',')
                # Strip trailing filler words
                candidate = re.sub(r'\s+(?:at|on|for|@|in|instead|now|please)$', '', candidate, flags=re.IGNORECASE)
                if len(candidate) > 2 and candidate.lower() not in ("a slot", "slot") and not _looks_like_time(candidate):
                    result["station"] = candidate
                    break

    # 4. Extract battery % if mentioned
    bat = re.search(r'(\d{1,3})\s*%', text)
    if bat:
        result["battery"] = float(bat.group(1))

    return result


def _build_booking_context_from_history(messages: list) -> Dict[str, Optional[str]]:
    """
    Scans the full message history to extract stored booking context:
    station, time_24h, date_iso, vehicle_id, connector_type, battery.
    Uses special sentinel comments that the orchestrator injects into history.
    """
    ctx = {
        "station": None,
        "time_24h": None,
        "date_iso": None,
        "vehicle_id": None,
        "connector_type": None,
        "battery": None,
    }

    for msg in messages:
        content = msg.content if hasattr(msg, 'content') else ""

        # Extract vehicle selection
        vs = re.search(
            r'\[VEHICLE_SELECTED:\s*vehicle_id=([^,]+),\s*connector_type=([^\]]+)\]',
            content
        )
        if vs:
            ctx["vehicle_id"] = vs.group(1).strip()
            ctx["connector_type"] = vs.group(2).strip()

        # Extract stored booking context marker
        bk = re.search(
            r'\[BOOKING_CONTEXT:\s*station=([^|]*)\|time=([^|]*)\|date=([^|]*)\|battery=([^\]]*)]',
            content
        )
        if bk:
            ctx["station"] = bk.group(1).strip() or None
            ctx["time_24h"] = bk.group(2).strip() or None
            ctx["date_iso"] = bk.group(3).strip() or None
            batt_val = bk.group(4).strip()
            if batt_val and batt_val != 'None':
                ctx["battery"] = float(batt_val)

        # Legacy battery extraction (fallback)
        bat = re.search(r'\[BATTERY:\s*([\d.]+)\]', content)
        if bat and ctx["battery"] is None:
            ctx["battery"] = float(bat.group(1))

    return ctx


def _is_uuid(val: str) -> bool:
    try:
        from uuid import UUID
        UUID(str(val))
        return True
    except:
        return False


def _looks_like_time(text: str) -> bool:
    """
    Check if a candidate station name is actually a time expression.
    Helps prevent "book at 7pm" from extracting "7pm" as the station name.
    """
    if not text:
        return False
    text_lower = text.lower().strip()
    # Check for common time patterns
    time_patterns = [
        r'^\d{1,2}(?::\d{2})?\s*(?:am|pm)?$',  # "2", "2pm", "14:00", "2:30pm"
        r'^(?:am|pm)$',  # "am", "pm"
        r'^\d{1,2}$',  # just a number
    ]
    for pat in time_patterns:
        if re.match(pat, text_lower):
            return True
    # Also check if text contains only time keywords
    if re.match(r'^(?:today|tomorrow|day after tomorrow|morning|afternoon|evening|night)$', text_lower):
        return True
    return False


async def _detect_implicit_booking_intent(user_message: str, chat_history: List[Dict[str, str]]) -> bool:
    """
    Detect if user is implicitly trying to book based on:
    - Message contains '+ time' pattern even without 'book' keyword
    - User previously saw stations and now mentions one with a time
    """
    lower_msg = user_message.lower()
    
    # Pattern: "station_name at time" (even without 'book')
    # e.g., "central station at 7pm", "green ev 2pm", etc.
    # Look for: word/phrase + "at" + time
    implicit_booking_patterns = [
        r'(\w[\w\s]*)\s+(?:at|@)\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)(?:\s|$)',  # "central station at 7pm"
        r'^([^@][\w\s]+?)\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm))',  # "central 7pm"
    ]
    
    for pat in implicit_booking_patterns:
        m = re.search(pat, lower_msg, re.IGNORECASE)
        if m:
            potential_station = m.group(1).strip()
            # Check if this looks like a station name (at least 2 chars, not just time)
            if len(potential_station) > 2 and not _looks_like_time(potential_station):
                print(f"[AGENT] 🎯 Implicit booking detected: '{potential_station}' + time")
                return True
    
    return False

async def _fuzzy_resolve_station(name: str) -> Optional[str]:
    """Helper to resolve a station name/typo to a canonical name or ID."""
    from .tools.charging import list_stations
    try:
        all_stations = await list_stations()
        names = [s.get("name") or "" for s in all_stations]
        if not names: return None
        
        # Try direct fuzzy match
        matches = difflib.get_close_matches(name.lower(), [n.lower() for n in names], n=1, cutoff=0.6)
        if matches:
            # Re-map back to original case name
            best_match_lower = matches[0]
            canonical = next((n for n in names if n.lower() == best_match_lower), None)
            return canonical
    except Exception as e:
        print(f"[ORCHESTRATOR] Fuzzy resolve error: {e}")
    return None


# ─────────────────────────────────────────────────────────────────────────────

async def process_agent_message(
    user_message: str,
    chat_history: List[Dict[str, str]],
    user_context: dict,
    user_vehicles: List[dict] = None,
    context_stations: List[dict] = None,
    timezone_offset: int = 0
) -> Dict[str, Any]:
    """
    Main entry point for AI Agent orchestration using Langchain + Ollama.
    
    Smart booking flow (minimal questions):
      T1. User: "Book [station] at [time] [date]"
          → Extract station/time/date natively
          → Immediately show vehicle selection card (no LLM questions)
      T2. User selects vehicle card
          → Ask ONLY for battery %
      T3. User: "[battery]%"
          → Book and confirm
    """
    if user_vehicles is None:
        user_vehicles = []
    if context_stations is None:
        context_stations = []

    # Inject the authenticated user's ID into the tool context
    uid = user_context.get("id", "") if isinstance(user_context, dict) else getattr(user_context, "id", "")
    current_user_id.set(str(uid) if uid else "")

    today_iso = date.today().isoformat()

    # ── NATIVE PARSING: detect booking intent without LLM ────────────────────
    # First check for VEHICLE_SELECTION_REQUIRED patterns to avoid re-showing
    lower_msg = user_message.lower()
    is_vehicle_selected = bool(re.search(r'\[VEHICLE_SELECTED:', user_message))
    is_battery_msg = bool(re.search(r'\b\d{1,3}\s*%', user_message) or re.search(r'\bbattery\b.{0,20}\d', lower_msg))
    
    # Check for explicit booking keywords OR implicit booking (station + time without "book")
    has_explicit_booking_keyword = any(w in lower_msg for w in ["book", "charge", "charging", "slot", "reserve"])
    has_implicit_booking_intent = await _detect_implicit_booking_intent(user_message, chat_history)
    is_booking_intent = has_explicit_booking_keyword or has_implicit_booking_intent

    # Scan history for existing booking context
    # Rebuild messages list for context scanning
    history_msgs = []
    
    # ── RESET/CANCEL LOGIC: Check for explicit reset/cancel intent ────────────
    reset_keywords = ["cancel", "reset", "start over", "clear chat", "clear context", "stop booking","no"]
    if lower_msg.strip() in reset_keywords:
        print(f"[AGENT] 🔄 User requested context RESET")
        return {
            "text": "Context cleared. How can I help you start a new booking?",
            "ui_component": None,
            "_ctx_cookie": "\n[BOOKING_CONTEXT: station=|time=|date=|battery=None]"
        }

    for m in chat_history:
        if m["role"] == "user":
            history_msgs.append(HumanMessage(content=m.get("hiddenContent") or m["content"]))
        else:
            history_msgs.append(AIMessage(content=m.get("hiddenContent") or m["content"]))

    booked_ctx = _build_booking_context_from_history(history_msgs)

    # Try to build new booking context from current user message
    # Extract if explicitly booking OR implicitly booking (station + time)
    new_intent = _extract_booking_intent(user_message) if is_booking_intent else {}
    
    # If implicit booking detected but no extract yet, try extracting anyway
    if not new_intent and has_implicit_booking_intent:
        new_intent = _extract_booking_intent(user_message)
        print(f"[AGENT] 🎯 Extracting implicit booking intent: {new_intent}")
    
    # Also extract vehicle selection from current message if present
    current_vs = re.search(
        r'\[VEHICLE_SELECTED:\s*vehicle_id=([^,]+),\s*connector_type=([^\]]+)\]',
        user_message
    )
    
    # Check if user is responding with a date after being asked to confirm
    # Look for: "today", "tomorrow", "day after tomorrow", or a specific date
    is_date_response = bool(re.search(r'\b(?:today|tomorrow|day after tomorrow)\b', lower_msg, re.IGNORECASE)) or _resolve_relative_date(user_message)
    
    # If user is confirming a date, extract it
    if is_date_response and station and time_24h and not date_was_mentioned:
        confirmed_date = _resolve_relative_date(user_message)
        if confirmed_date:
            date_iso = confirmed_date
            date_was_mentioned = True
            print(f"[AGENT] ✅ User confirmed date: {date_iso}")
    
    # Merge: latest intent wins for station/time/date to allow overrides
    station_raw = new_intent.get("station") or booked_ctx["station"]
    
    # ── FUZZY RESOLUTION: Handle typos like "cxentral" ──────────────────────
    station = station_raw
    if station_raw and not _is_uuid(station_raw):
        resolved = await _fuzzy_resolve_station(station_raw)
        if resolved:
            station = resolved
            print(f"[AGENT] 🔍 Fuzzy resolved {station_raw!r} → {station!r}")

    time_24h = new_intent.get("time_24h") or booked_ctx["time_24h"]
    date_iso = new_intent.get("date_iso") or booked_ctx["date_iso"]
    
    # Track if date was NOT explicitly mentioned by user
    date_was_mentioned = new_intent.get("date_iso") is not None or booked_ctx["date_iso"] is not None
    
    # Only use today as default if we proceed past the date confirmation check
    if not date_iso:
        date_iso = today_iso
    
    vehicle_id = booked_ctx["vehicle_id"] or (current_vs.group(1).strip() if current_vs else None)
    connector_type = booked_ctx["connector_type"] or (current_vs.group(2).strip() if current_vs else None)
    battery = new_intent.get("battery") or booked_ctx["battery"]

    # Special logic for "Yes" / confirmation turns
    is_confirmation = user_message.lower().strip() in ("yes", "y", "ok", "okay", "sure", "proceed", "book it", "confirm")
    if is_confirmation and chat_history:
        prev_assistant = chat_history[-1]["content"] if chat_history[-1]["role"] == "assistant" else ""
        # Check if we previously asked about a different connector
        m_connector = re.search(r'but a \*\*([^*]+)\*\* connector is available', prev_assistant)
        if m_connector:
            print(f"[AGENT] ✅ User confirmed connector fallback to {m_connector.group(1)}")
            connector_type = m_connector.group(1).strip()

    print(f"\n{'='*60}")
    print(f"[AGENT] 📨 User message: {user_message!r}")
    print(f"[AGENT] 🔍 Extracted — station={station!r} time={time_24h!r} date={date_iso!r}")
    print(f"[AGENT] 🚗 vehicle_id={vehicle_id!r} connector={connector_type!r} battery={battery!r}")

    ui_component = None

    # ── DATE CONFIRMATION: If booking intent with station+time but NO date mentioned ────
    # Skip check if: user already responded with date, or is confirming ("yes"), or selecting vehicle
    should_ask_for_date = (
        is_booking_intent and 
        station and 
        time_24h and 
        not date_was_mentioned and 
        not is_vehicle_selected and
        not is_date_response  # Skip if they already provided a date
    )
    
    if should_ask_for_date:
        print(f"[AGENT] 📅 Date not mentioned - asking user to confirm")
        
        tomorrow_iso = (date.today() + timedelta(days=1)).isoformat()
        
        reply = (
            f"I'd like to book **{station}** at **{time_24h}**. "
            f"Is this for **today** ({today_iso}) or would you like a different day?"
        )
        
        # Store the booking context so far
        ctx_cookie = (
            f"\n[BOOKING_CONTEXT: station={station}|"
            f"time={time_24h}|"
            f"date=|"  # Empty - waiting for user confirmation
            f"battery={battery if battery is not None else 'None'}]"
        )
        
        print(f"{'='*60}\n")
        return {"text": reply, "ui_component": None, "_ctx_cookie": ctx_cookie}

    # ── FAST PATH: Show vehicle card immediately on booking intent ────────────
    if is_booking_intent and not is_vehicle_selected and not vehicle_id and user_vehicles:
        # Resolve station/time/date with priority
        station = station or "the station"
        time_display = time_24h if time_24h else "[time]"
        date_display = date_iso if date_iso else "[date]"

        # Format the first line as requested: book [station name] [time] [date] [battery %]
        first_line = "Book"
        if station: first_line += f" **{station}**"
        if time_display: first_line += f" {time_display}"
        if date_display: first_line += f" {date_display}"
        if battery is not None: first_line += f" at **{battery}%** battery"
        
        missing = []
        if not time_24h:
            missing.append("charge time (e.g., 2pm)")
        
        if missing:
            reply = (
                f"{first_line}\n\n"
                f"Got it! I've locked in the station. Please tell me **{' and '.join(missing)}**.\n"
                f"Also, select the vehicle you'll be using:"
            )
        else:
            reply = (
                f"{first_line}\n\n"
                f"Which vehicle would you like to use for this session?"
            )

        # Build a context cookie to lock in the context early
        ctx_cookie = (
            f"\n[BOOKING_CONTEXT: station={station if station != 'the station' else ''}|"
            f"time={time_24h or ''}|"
            f"date={date_iso or today_iso}|"
            f"battery={battery if battery is not None else 'None'}]"
        )

        ui_component = {
            "type": "vehicle_selection",
            "data": [
                {
                    "id": v.get("id"),
                    "brand": v.get("brand", "Unknown"),
                    "model": v.get("model", "Unknown"),
                    "connector_type": v.get("connectorType") or v.get("charging_connector") or v.get("connector_type") or v.get("connector") or "Unknown",
                    "license_plate": v.get("license_plate", ""),
                    "year": v.get("year", ""),
                }
                for v in user_vehicles
            ],
            "booking_context": {
                "station": station if station != "the station" else None,
                "time_24h": time_24h,
                "date_iso": date_iso,
                "ctx_cookie": ctx_cookie,
            }
        }
        print(f"[AGENT] 🚗 FAST PATH — showing vehicle card ({len(user_vehicles)} vehicle(s))")
        print(f"{'='*60}\n")
        return {"text": reply, "ui_component": ui_component, "_ctx_cookie": ctx_cookie}

    # ── FAST PATH: Vehicle was just selected — if we have all context, ask only for battery ─
    if is_vehicle_selected and vehicle_id and station and time_24h and not battery:
        reply = f"What's your current battery percentage?"
        print(f"[AGENT] 🔋 Vehicle selected — asking for battery %")
        print(f"{'='*60}\n")
        return {"text": reply, "ui_component": None}

    # ── FAST PATH: All info available — trigger booking directly ─────────────
    if vehicle_id and station and time_24h and battery is not None:
        print(f"[AGENT] ⚡ FAST BOOKING — all fields ready, calling tool directly")
        try:
            result = await tool_create_booking_request.ainvoke({
                "station_name_or_id": station,
                "vehicle_id": vehicle_id,
                "connector_type": connector_type or "Unknown",
                "date": date_iso,
                "time_slot": time_24h,
                "duration": 60,
                "current_battery": float(battery),
                "timezone_offset": timezone_offset
            })
            if isinstance(result, dict) and "error" not in result:
                ui_component = {"type": "booking_confirmation", "data": result}
                reply = "Booking confirmed!"
            else:
                err = result.get("error", "Unknown error") if isinstance(result, dict) else str(result)
                ui_component = result.get("ui_component")
                
                if err == "connector_mismatch":
                    reply = (
                        f"I couldn't find a **{result['requested_connector']}** connector at **{result['station_name']}** for this time, "
                        f"but a **{result['found_connector']}** connector is available. Would you like to use that instead?"
                    )
                elif "not available" in err.lower() or "unavailable" in err.lower():
                    reply = f"The requested slot is not available for this duration. Here are some suggested alternatives:"
                else:
                    reply = f"Booking failed: {err}"
        except Exception as e:
            reply = f"Booking failed: {e}"
        print(f"[AGENT] 💬 Fast booking result: {reply[:150]!r}")
        print(f"{'='*60}\n")
        return {"text": reply, "ui_component": ui_component}

    # ── FALLBACK: LLM handles everything else ────────────────────────────────
    # (station search, clarification questions, etc.)

    # Format vehicle string for informational display
    vehicles_str = "No vehicles registered. Tell the user to add a vehicle in their profile first."
    if user_vehicles:
        v_lines = []
        for v in user_vehicles:
            brand = v.get("brand", "Unknown")
            model_name = v.get("model", "Unknown")
            conn_type = v.get("charging_connector") or v.get("connector_type", "Unknown")
            vid = v.get("id", "Unknown")
            v_lines.append(f"- {brand} {model_name} | connector={conn_type} | id={vid}")
        vehicles_str = "\n".join(v_lines)

    # Format stations string
    stations_str = "No stations are currently active in context."
    if context_stations:
        s_lines = []
        for s in context_stations:
            name = s.get("name", "Unknown Station")
            address = s.get("address", "Unknown Address")
            sid = s.get("id", "Unknown")
            s_lines.append(f"- {name} at {address}\n  Station ID: {sid}")
        stations_str = "\n\n".join(s_lines)

    system_prompt = f"""You are the ChargeX EV Charging Assistant. Help users with ANYTHING related to EV charging stations, bookings, vehicles, and slots. Be conversational and helpful.

CONVERSATION MODES:
1. **Station Queries**: User asks about stations (e.g., "stations near me", "show me available stations", "what stations are near central park")
   - Use tool_geocode_location if needed to find coordinates
   - Use tool_find_stations_nearby to find stations
   - Show results naturally

2. **Station Search**: User mentions a specific station (e.g., "tell me about Central Station", "info on Green EV")
   - Use tool_search_station_by_name to find details
   - Present information conversationally

3. **Booking**: User requests a booking (explicit: "book", "charge", "reserve") OR implicit (e.g., "Central Station at 7pm")
   - If date is NOT mentioned, the system will ask: "Is this for today or another day?"
   - Once user confirms date, proceed to vehicle selection
   - Handle vehicle selection via [VEHICLE_SELECTION_REQUIRED] sentinel
   - Ask for battery % if missing
   - Call tool_create_booking_request when ready

4. **General Info**: User asks about charging, EVs, availability, etc.
   - Answer conversationally using your knowledge
   - Offer to help with bookings or finding stations

TOOLS REFERENCE:
- tool_search_station_by_name(name): Search stations by name
- tool_geocode_location(location): Convert location/city to coordinates
- tool_find_stations_nearby(lat, lon, limit): Find nearby stations
- tool_create_booking_request(...): Book a charging slot

BOOKING FLOW RULES:
1. Only extract station/time/date from explicit or IMPLICIT booking intents
2. If user provides station + time but NO date → System automatically asks which date (today/tomorrow/other)
3. No vehicle selected → Output [VEHICLE_SELECTION_REQUIRED] sentinel
4. Vehicle selected but no battery → Ask for current battery %
5. All info available → Call booking tool directly
6. Do NOT ask for confirmations about station already shown
7. When user responds with a date (today/tomorrow/specific date), the system will extract it and proceed

IMPORTANT BEHAVIOR CHANGES:
- Be conversational and natural, don't follow rigid templates
- For queries like "stations near me" or "show stations", use tools to provide data-driven results
- When user says "station_name at time" after seeing stations, recognize as booking attempt immediately
- IMPORTANT: If user says "book at 7pm" or "Central at 2pm" WITHOUT mentioning a date, ask which date (today/tomorrow/other)
- Accept natural date responses: "today", "tomorrow", "day after tomorrow", or specific dates
- Present alternatives naturally when slots conflict
- NEVER expose internal IDs to users

CONTEXT:
- Today: {today_iso}
- Station: {station or "Not set"}
- Vehicle: {vehicle_id or "Not selected"}
- Time: {time_24h or "Not specified"}
- Date: {date_iso or "Not specified"}
- Battery: {battery if battery is not None else "Not specified"}

User Vehicles: {len(user_vehicles)} registered
"""

    messages = [SystemMessage(content=system_prompt)]

    for msg in chat_history:
        if msg["role"] == "user":
            messages.append(HumanMessage(content=msg.get("hiddenContent") or msg["content"]))
        else:
            messages.append(AIMessage(content=msg.get("hiddenContent") or msg["content"]))

    messages.append(HumanMessage(content=user_message))

    print(f"[AGENT] 🤖 LLM Mode: General conversation with tools...")

    max_iterations = 6

    for iteration in range(max_iterations):
        print(f"[AGENT] 🤖 Iteration {iteration+1} — invoking model...")
        response = await llm_with_tools.ainvoke(messages)
        messages.append(response)

        if not response.tool_calls:
            print(f"[AGENT] ✅ No more tool calls, model produced text.")
            break

        print(f"[AGENT] 🔧 Tool calls: {[tc['name'] for tc in response.tool_calls]}")

        for tool_call in response.tool_calls:
            tool_name = tool_call["name"]
            tool_args = tool_call["args"]
            print(f"[AGENT] ⚙️  Executing {tool_name} with args {tool_args}")

            tool_fn = tool_map.get(tool_name)
            if not tool_fn:
                result = f"Error: Unknown tool {tool_name}"
            else:
                # ── Tool Argument Auto-Injection ──────────────────────────────
                # Small models (like Qwen 3B) sometimes forget to pass IDs 
                # that are already in the context. We helper them here.
                if tool_name == "tool_create_booking_request":
                    if not tool_args.get("vehicle_id") and vehicle_id:
                        print(f"[AGENT] 🛠️ Auto-injecting vehicle_id: {vehicle_id}")
                        tool_args["vehicle_id"] = vehicle_id
                    if not tool_args.get("station_name_or_id") and station:
                        print(f"[AGENT] 🛠️ Auto-injecting station: {station}")
                        tool_args["station_name_or_id"] = station
                    if not tool_args.get("current_battery") and battery:
                        print(f"[AGENT] 🛠️ Auto-injecting battery: {battery}")
                        tool_args["current_battery"] = battery

                try:
                    raw_result = await tool_fn.ainvoke(tool_args)
                    result = json.dumps(raw_result, default=str)

                    if tool_name in ("tool_find_stations_nearby", "tool_search_station_by_name"):
                        ui_component = {"type": "station_list", "data": raw_result or []}
                    elif tool_name == "tool_create_booking_request":
                        if isinstance(raw_result, dict):
                            if "error" not in raw_result:
                                # Pass the full enriched result to the frontend
                                ui_component = {"type": "booking_confirmation", "data": raw_result}
                            elif "ui_component" in raw_result:
                                # Capture alternative slots or other UI from error response
                                ui_component = raw_result["ui_component"]

                except Exception as e:
                    print(f"[AGENT] ❌ Error executing {tool_name}: {e}")
                    result = f"Error: {e}"

            messages.append(ToolMessage(content=str(result), tool_call_id=tool_call["id"]))

    final_text = response.content if isinstance(response, AIMessage) and response.content else "I've processed your request."

    # ── High Priority UI Component Check ─────────────────────────────────────
    # If we found a booking confirmation or alternative slots earlier in the loop,
    # and the model DIDN'T produce a new specialized UI (like vehicle selection),
    # then keep the previous one.
    
    # ── Vehicle selection sentinel interception ──────────────────────────────
    SENTINEL = "[VEHICLE_SELECTION_REQUIRED]"
    if SENTINEL in final_text and user_vehicles:
        clean_text = final_text.replace(SENTINEL, "").strip()
        final_text = clean_text if clean_text else "Please select which vehicle you'd like to charge with:"
        ui_component = {
            "type": "vehicle_selection",
            "data": [
                {
                    "id": v.get("id"),
                    "brand": v.get("brand", "Unknown"),
                    "model": v.get("model", "Unknown"),
                    "connector_type": v.get("connectorType") or v.get("charging_connector") or v.get("connector_type") or v.get("connector") or "Unknown",
                    "license_plate": v.get("license_plate", ""),
                    "year": v.get("year", ""),
                }
                for v in user_vehicles
            ]
        }
        print(f"[AGENT] 🚗 Vehicle selection sentinel — injecting UI card with {len(user_vehicles)} vehicle(s)")
    elif SENTINEL in final_text and not user_vehicles:
        final_text = "You don't have any vehicles registered. Please add a vehicle in your profile before making a booking."
        print(f"[AGENT] ⚠️  Vehicle selection required but user has no vehicles")

    print(f"[AGENT] 💬 Final text: {final_text[:200]!r}")
    print(f"{'='*60}\n")

    return {
        "text": final_text,
        "ui_component": ui_component
    }
