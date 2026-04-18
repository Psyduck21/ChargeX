from typing import List, Dict, Any, Optional
from contextvars import ContextVar
from langchain_core.tools import tool
from ...crud.station import find_stations_by_coordinates
from ...crud.bookings import request_slot_booking
from ...crud.statistics import list_stations
from ...models.booking_model import BookingCreate
from ...database import get_supabase_client
from datetime import datetime, timedelta
import uuid

# Injected by the orchestrator before each agent loop — allows the tool
# to write the authenticated user's ID into the booking without the LLM
# ever needing to know or pass it.
current_user_id: ContextVar[str] = ContextVar("current_user_id", default="")

@tool
async def tool_search_station_by_name(name: str) -> List[Dict[str, Any]]:
    """
    Searches the ChargeX database for EV charging stations by name (partial match).
    Use this when the user mentions a specific station name (e.g., 'Central EV', 'Green Charge Hub').
    Returns matching stations with availability info.
    """
    print(f"[TOOL:search_station_by_name] Searching DB for name: {name!r}")
    try:
        import difflib
        all_stations = await list_stations()
        name_lower = name.lower()
        
        # 1. Try exact/substring mapping first
        results = [s for s in all_stations if name_lower in (s.get("name") or "").lower()]
        
        # 2. If no direct matches, try fuzzy matching
        if not results:
            print(f"[TOOL:search_station_by_name] No direct match for {name!r}, trying fuzzy...")
            station_names = [s.get("name") or "" for s in all_stations]
            matches = difflib.get_close_matches(name, station_names, n=5, cutoff=0.5)
            
            if matches:
                # Map names back to station objects
                results = [s for s in all_stations if s.get("name") in matches]
                # Sort results by match similarity
                results.sort(key=lambda s: difflib.SequenceMatcher(None, name_lower, (s.get("name") or "").lower()).ratio(), reverse=True)

        print(f"[TOOL:search_station_by_name] Found {len(results)} stations matching {name!r}")
        for r in results:
            print(f"[TOOL:search_station_by_name]   → {r.get('name')} | available={r.get('available_slots')}")
        return results
    except Exception as e:
        print(f"[TOOL:search_station_by_name] ❌ Error: {e}")
        return []

@tool
async def tool_find_stations_nearby(
    lat: float,
    lon: float,
    limit: int = 3,
    sort_by: str = "distance"
) -> List[Dict[str, Any]]:
    """
    Finds EV charging stations near a specific latitude and longitude.
    """
    print(f"[TOOL:find_stations_nearby] lat={lat} lon={lon} limit={limit} sort_by={sort_by}")
    stations = await find_stations_by_coordinates(target_lat=lat, target_lon=lon, limit=limit, sort_by=sort_by)
    print(f"[TOOL:find_stations_nearby] returned {len(stations) if isinstance(stations, list) else stations}")
    return stations

async def find_available_slots(
    station_id: str,
    date: str,
    start_time: str,
    duration_minutes: int
) -> List[Dict[str, Any]]:
    """
    Queries the database to find explicitly available charging slots at a specific station for a given time.
    Use this BEFORE making a booking request to ensure you select a valid, non-overlapping slot_id.
    Parameters:
      - date: YYYY-MM-DD
      - start_time: HH:MM (24-hour format)
    Returns a list of available slots.
    """
    print(f"[TOOL:find_available_slots] Checking station {station_id} for {date} {start_time}")
    try:
        supabase = await get_supabase_client()
        
        # 1. Fetch all slots for the station
        slots_resp = supabase.table("charging_slots").select("*").eq("station_id", station_id).execute()
        all_slots = slots_resp.data or []
        if not all_slots:
            return []

        # 2. Parse times
        dt_str = f"{date} {start_time}"
        req_start = datetime.strptime(dt_str, "%Y-%m-%d %H:%M")
        req_end = req_start + timedelta(minutes=duration_minutes)

        # 3. Fetch overlapping bookings
        blocking_statuses = ["confirmed", "active", "pending"]
        bookings_resp = supabase.table("bookings") \
            .select("slot_id, start_time, end_time") \
            .eq("station_id", station_id) \
            .in_("status", blocking_statuses) \
            .execute()
            
        bookings = bookings_resp.data or []
        
        # 4. Filter slots
        available_slots = []
        for slot in all_slots:
            if slot.get("status") == "under_maintenance" or not slot.get("is_available", True):
                continue
                
            slot_id = slot["id"]
            is_overlap = False
            for b in bookings:
                if b.get("slot_id") != slot_id:
                    continue
                # Parse existing booking times
                try:
                    b_start_str = b.get("start_time", "").replace("Z", "+00:00")
                    b_end_str = b.get("end_time", "").replace("Z", "+00:00")
                    b_start = datetime.fromisoformat(b_start_str).replace(tzinfo=None)
                    b_end = datetime.fromisoformat(b_end_str).replace(tzinfo=None)
                    
                    if req_start < b_end and b_start < req_end:
                        is_overlap = True
                        break
                except Exception as e:
                    print(f"[TOOL:find_available_slots] Time parse error: {e}")
                    pass
            
            if not is_overlap:
                available_slots.append({
                    "slot_id": slot_id,
                    "connector_type": slot.get("connector_type"),
                    "max_power_kw": slot.get("max_power_kw"),
                    "charger_type": slot.get("charger_type")
                })
                
        return available_slots
    except Exception as e:
        print(f"[TOOL:find_available_slots] ❌ Error: {e}")
        return []

async def find_time_alternatives(station_id: str, req_date: str, req_time: str, duration: int) -> List[Dict[str, Any]]:
    """Helper to find future available slots at the SAME station in 30-min increments."""
    from datetime import timedelta
    alternatives = []
    try:
        base_time_str = f"{req_date}T{req_time}:00"
        base_time = datetime.fromisoformat(base_time_str)
        
        # Check next 4 slots (+30m, +1h, +1.5h, +2h)
        for i in range(1, 5):
            next_time = base_time + timedelta(minutes=30 * i)
            test_date = next_time.strftime("%Y-%m-%d")
            test_time = next_time.strftime("%H:%M")
            
            slots = await find_available_slots(station_id, test_date, test_time, duration)
            if slots:
                alternatives.append({
                    "id": f"{station_id}-time-{i}",
                    "station_id": station_id,
                    "is_time_suggestion": True,
                    "suggested_time": test_time,
                    "suggested_date": test_date,
                    "available_slots": len(slots),
                    "max_power_kw": max((s.get("max_power_kw", 0) for s in slots if s.get("max_power_kw")), default=0)
                })
    except Exception as e:
        print(f"[TOOL:find_time_alternatives] Error: {e}")
            
    # Sort by time ascending
    alternatives.sort(key=lambda x: x["suggested_time"])
    return alternatives

@tool
async def tool_create_booking_request(
    duration: int,
    date: str,
    vehicle_id: Optional[str] = None,
    connector_type: Optional[str] = "Unknown",
    station_name_or_id: Optional[str] = None,
    time_slot: Optional[str] = None,
    current_battery: Optional[float] = None,
    timezone_offset: Optional[int] = 0
) -> dict:
    """
    Books a charging slot in one call. Required fields:
      - station_name_or_id: station name or UUID (e.g. "New Ev Station")
      - vehicle_id: taken from [VEHICLE_SELECTED] message in chat history — DO NOT ask the user
      - connector_type: taken from [VEHICLE_SELECTED] message in chat history
      - date: YYYY-MM-DD (e.g. "2026-04-18")
      - time_slot: HH:MM 24h format (e.g. "14:00" for 2pm)
      - duration: integer minutes (default 60)
      - current_battery: float (e.g. 40.0 for "40%")
    The backend resolves station names, finds an available slot, and creates the booking.
    IMPORTANT: Only call this tool AFTER a [VEHICLE_SELECTED] message appears in chat history.
    """

    # 1. Guardrail: vehicle_id must come from a user selection, not be guessed
    if not vehicle_id or vehicle_id.strip().lower() in ("none", "unknown", ""):
        return {"error": "[VEHICLE_SELECTION_REQUIRED] No vehicle has been selected yet. The frontend will show a vehicle picker card — wait for the user to select one before calling this tool again."}

    # 2. Guardrail for missing station ID
    if not station_name_or_id or station_name_or_id.lower() == "none":
        return {"error": "You tried to book without a station. You MUST pass the string name of the station into station_name_or_id, then try booking again."}

    # 3. Guardrail for missing battery
    if current_battery is None or current_battery == 0.0:
        return {"error": "You tried to book without knowing the user's current battery percentage. Stop and ask the user for their battery percentage right now."}

    # 4. Guardrail for missing time slot
    if not time_slot or time_slot.lower() == "none":
        return {"error": "You are missing the time_slot (e.g. '14:00'). Please extract the time from the user's message or ask them what time they want to charge."}

    # Auto-resolve Station String into UUID
    station_id = station_name_or_id
    station_name_resolved = station_name_or_id
    try:
        uuid.UUID(station_id)
        # If it's a UUID, we won't easily know the name without another DB call, 
        # but in normal chat flows, LLM passes the string name here.
    except ValueError:
        # It's a string name, search the DB
        print(f"[TOOL:create_booking_request] Auto-resolving string {station_id!r} to UUID...")
        results = await tool_search_station_by_name.ainvoke({"name": station_id})
        if not results:
            return {"error": f"Could not find any station matching the name '{station_id}'. Ask the user to clarify the name."}
        # Check similarity to prevent wrong matches
        best_name = results[0].get("name", "")
        ratio = difflib.SequenceMatcher(None, station_id.lower(), best_name.lower()).ratio()
        if ratio < 0.6:
            return {"error": f"Station name '{station_id}' does not closely match '{best_name}'. Please confirm the correct station name."}
        station_id = results[0]["id"]
        station_name_resolved = results[0].get("name", station_name_resolved)
        print(f"[TOOL:create_booking_request] Resolved to UUID {station_id} (ratio: {ratio:.2f})")

    # Auto-find an available slot ID from Python natively
    print(f"[TOOL:create_booking_request] Auto-assigning slot for {connector_type}...")
    try:
        from ...crud.station import find_nearby_stations
        available_slots = await find_available_slots(station_id, date, time_slot, duration)
        
        if not available_slots:
            print(f"[TOOL:create_booking_request] ❌ No slots at {station_id}. Fetching alternatives...")
            time_alts = []
            if station_id:
                time_alts = await find_time_alternatives(station_id, date, time_slot, duration)
                if time_alts:
                    # Add station name to time suggestions
                    for t in time_alts:
                        t["name"] = f"Wait for {station_name_resolved}"
                        t["original_station_name"] = station_name_resolved
            
            alternatives = await find_nearby_stations(station_id, limit=3)
            
            # Combine them: put time suggestions first (already sorted by time), then nearby stations
            combined = time_alts + alternatives
            
            return {
                "error": "No slots available at the requested time.",
                "ui_component": {
                    "type": "alternative_slots",
                    "data": combined
                }
            }

        # 1st priority: exact connector match
        matching_slot = next(
            (s for s in available_slots if s.get("connector_type", "").lower() == connector_type.lower()),
            None
        )

        # 2nd priority: check for alternative connector if exact not found
        if matching_slot is None:
            matching_slot = available_slots[0]
            actual_type = matching_slot.get("connector_type", "Unknown")
            print(f"[TOOL:create_booking_request] ⚠️  No exact {connector_type!r} match — found {actual_type!r} instead")
            
            # Check if this fallback was already accepted/informed in chat (orchestrator will handle message)
            # For the tool purpose, we return the info and let orchestrator decide whether to prompt user.
            # But here we add a flag to the result.
            return {
                "error": "connector_mismatch",
                "requested_connector": connector_type,
                "found_connector": actual_type,
                "station_name": station_name_resolved,
                "matching_slot": matching_slot
            }

        slot_id = matching_slot["slot_id"]
        # Save actual connector matched to show in UI
        matched_connector_type = matching_slot.get("connector_type", connector_type)
        print(f"[TOOL:create_booking_request] Assigned slot_id: {slot_id} ({matched_connector_type})")
    except Exception as e:
        return {"error": f"Failed to calculate slot availability: {e}"}

    # Build proper start_time / end_time from the human-supplied date + time_slot + duration
    try:
        dt_str = f"{date} {time_slot}"
        # Parse as naive local time
        start_dt_local = datetime.strptime(dt_str, "%Y-%m-%d %H:%M")
        
        # Convert to UTC aware datetime based on providedoffset
        # JS getTimezoneOffset() is (UTC - Local) in minutes
        # UTC = Local + offset
        start_dt_utc = start_dt_local + timedelta(minutes=timezone_offset or 0)
        end_dt_utc = start_dt_utc + timedelta(minutes=duration)
        
        # Convert to aware UTC for database consistency
        from datetime import timezone
        start_dt = start_dt_utc.replace(tzinfo=timezone.utc)
        end_dt = end_dt_utc.replace(tzinfo=timezone.utc)
    except Exception as e:
        return {"error": f"Could not parse date/time '{date} {time_slot}': {e}"}

    # Inject the authenticated user's ID from the context set by the orchestrator
    user_id = current_user_id.get("")
    if not user_id:
        return {"error": "No authenticated user context available. Please log in and try again."}

    booking_data = {
        "station_id": station_id,
        "vehicle_id": vehicle_id,
        "slot_id": str(slot_id),
        "start_time": start_dt,
        "end_time": end_dt,
        "current_battery_level": current_battery,
        "user_id": user_id,
    }
    print(f"[TOOL:create_booking_request] ─── booking_data ───")
    for k, v in booking_data.items():
        print(f"[TOOL:create_booking_request]   {k}: {v!r}")
    print(f"[TOOL:create_booking_request] ────────────────────")

    try:
        # NOTE: Using BookingCreate ensures validation
        validated_data = BookingCreate(**booking_data)
        print(f"[TOOL:create_booking_request] ✅ Pydantic validation passed")
    except Exception as e:
        print(f"[TOOL:create_booking_request] ❌ Pydantic validation FAILED: {e}")
        return {"error": f"Validation failed: {e}"}

    try:
        booking = await request_slot_booking(validated_data)
        result = booking.dict() if hasattr(booking, 'dict') else booking
        
        # Enrich the result for frontend UI
        result["station_name"] = station_name_resolved
        result["connector_type"] = matched_connector_type
        
        print(f"[TOOL:create_booking_request] ✅ Booking created: {result}")
        return result
    except Exception as e:
        err_msg = str(e)
        print(f"[TOOL:create_booking_request] ❌ request_slot_booking FAILED: {err_msg}")
        
        # If it's a conflict error, try to provide alternatives
        if "unavailable" in err_msg or "existing booking" in err_msg:
            from ...crud.station import find_nearby_stations
            print(f"[TOOL:create_booking_request] 🔄 Conflict detected, fetching alternatives...")
            
            time_alts = await find_time_alternatives(station_id, date, time_slot, duration)
            if time_alts:
                for t in time_alts:
                    t["name"] = f"Wait for {station_name_resolved}"
                    t["original_station_name"] = station_name_resolved
                    
            alternatives = await find_nearby_stations(station_id, limit=3)
            combined = time_alts + alternatives
            
            return {
                "error": "The requested slot is not available in this duration.",
                "ui_component": {
                    "type": "alternative_slots",
                    "data": combined
                }
            }
            
        return {"error": f"Booking failed: {err_msg}"}
