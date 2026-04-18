from typing import Any, Dict, List, Optional
from uuid import UUID
from ..database import get_supabase_client, get_supabase_service_role_client
import httpx
from ..models import BookingCreate, BookingUpdate, BookingOut
from datetime import datetime
# from ...utils.datetime_utils import datetime_to_str  # add this if not exists

# User requests a booking slot (status: pending)
async def request_slot_booking(booking_data: BookingCreate) -> Optional[BookingOut]:
    """Create a booking with server-side overlap validation.

    This function will check for existing blocking bookings on the same slot
    (statuses: pending, confirmed, active) and reject the creation if a time overlap is found.
    It raises an exception on validation failure so callers (routers) can return
    appropriate HTTP errors.
    """
    supabase = await get_supabase_client()
    booking_dict = booking_data.dict()

    # helper to parse datetimes (accepts datetime or ISO strings)
    def _parse_dt(v):
        if v is None:
            return None
        if isinstance(v, datetime):
            return v
        if isinstance(v, str):
            try:
                # handle trailing Z as UTC
                if v.endswith('Z'):
                    v = v.replace('Z', '+00:00')
                return datetime.fromisoformat(v)
            except Exception:
                raise ValueError(f"Invalid datetime format: {v}")
        raise ValueError(f"Unsupported datetime value: {v}")

    # Normalize start/end
    start_time_val = booking_dict.get('start_time')
    end_time_val = booking_dict.get('end_time')

    # If they are already strings from Supabase, ensure they have Z or offset
    # If they are datetimes, Pydantic will handle them.
    # But for overlap validation, we need them as objects.
    start_dt = _parse_dt(start_time_val)
    end_dt = _parse_dt(end_time_val)
    if not start_dt or not end_dt:
        raise ValueError("start_time and end_time are required and must be valid datetimes")
    if end_dt <= start_dt:
        raise ValueError("end_time must be after start_time")

    slot_id = booking_dict.get('slot_id')
    # If slot specified, check if slot/station is under maintenance
    if slot_id:
        try:
            # Check slot status
            slot_resp = supabase.table("charging_slots").select("status, station_id").eq("id", str(slot_id)).single().execute()
            slot_data = slot_resp.data
            if slot_data:
                if slot_data.get("status") == "under_maintenance":
                    raise ValueError(f"Slot {slot_id} is currently under maintenance and unavailable for booking")

                # Check station status
                station_resp = supabase.table("stations").select("status").eq("id", str(slot_data.get("station_id"))).single().execute()
                station_data = station_resp.data
                if station_data and station_data.get("status") == "under_maintenance":
                    raise ValueError(f"Station is currently under maintenance and unavailable for booking")
        except httpx.HTTPError as e:
            print(f"Error checking slot/station status for slot {slot_id}: {e}")
            # re-raise to be handled by router
            raise

    # If slot specified, ensure no overlapping blocking bookings exist
    if slot_id:
        try:
            # We don't block pending because we are removing it, but keep it for legacy compat
            blocking_statuses = ["confirmed", "active", "pending"]
            resp = supabase.table("bookings").select("*").eq("slot_id", str(slot_id)).in_("status", blocking_statuses).execute()
            existing = resp.data or []
            overlaps = []
            for b in existing:
                b_start = _parse_dt(b.get('start_time'))
                b_end = _parse_dt(b.get('end_time'))
                if b_start and b_end:
                    if start_dt < b_end and b_start < end_dt:
                        overlaps.append(b)
            
            if overlaps:
                # Check for emergency override (battery < 15%)
                battery_level = booking_dict.get('current_battery_level')
                new_battery = float(battery_level) if battery_level is not None else 100.0
                
                can_override = new_battery < 15.0
                if can_override:
                    # check if any overlapping booking also has < 15 or is active
                    for b in overlaps:
                        if b.get("status") == "active":
                            raise ValueError(f"Cannot override: slot {slot_id} is currently actively charging another vehicle.")
                        
                        b_batt = b.get('current_battery_level')
                        b_batt = float(b_batt) if b_batt is not None else 100.0
                        if b_batt < 15.0:
                            raise ValueError(f"Slot {slot_id} unavailable: another critical emergency booking (<15%) already exists.")
                    
                    # If we reached here, the new booking OVERRIDES all overlapping ones.
                    # We cancel them and automatically book an alternate for them.
                    from .station import find_nearest_station
                    for b in overlaps:
                        # Cancel the displaced booking
                        upd = {"status": "cancelled"}
                        supabase.table("bookings").update(upd).eq("id", str(b.get("id"))).execute()
                        
                        # Find an alternate available station & slot
                        nearest = await find_nearest_station(str(b.get("station_id")))
                        if nearest:
                            nearest_station_id = nearest.get("id")
                            # Find an available slot there
                            slots_resp = supabase.table("charging_slots").select("id").eq("station_id", nearest_station_id).eq("is_available", True).execute()
                            if slots_resp.data and len(slots_resp.data) > 0:
                                alt_slot_id = slots_resp.data[0]["id"]
                                
                                # Auto book the alternative slot for the displaced user
                                alt_booking = dict(b)
                                alt_booking.pop("id", None)
                                alt_booking.pop("created_at", None)
                                alt_booking.pop("updated_at", None)
                                alt_booking["station_id"] = nearest_station_id
                                alt_booking["slot_id"] = alt_slot_id
                                alt_booking["status"] = "confirmed" 
                                
                                supabase.table("bookings").insert(alt_booking).execute()
                else:
                    raise ValueError(f"Slot {slot_id} unavailable between {start_dt.isoformat()} and {end_dt.isoformat()} due to existing booking.")
        except httpx.HTTPError as e:
            print(f"Error checking existing bookings for slot {slot_id}: {e}")
            raise

    # No conflicts or we successfully pre-empted others — insert as confirmed!
    try:
        if isinstance(start_dt, datetime):
            booking_dict['start_time'] = start_dt.isoformat()
        if isinstance(end_dt, datetime):
            booking_dict['end_time'] = end_dt.isoformat()

        # ALL bookings go straight to confirmed now (no manager needed)
        booking_dict['status'] = 'confirmed'
        
        response = supabase.table("bookings").insert(booking_dict).execute()
        created = (response.data or [None])[0]
        if not created:
            raise RuntimeError("Failed to insert booking")
        return BookingOut(**created)
    except httpx.HTTPError as e:
        print(f"❌ Error creating booking (http): {e}")
        raise
    except Exception as e:
        print(f"❌ Error creating booking: {e}")
        raise

# Added alias expected by other modules
async def create_booking(booking_data: BookingCreate) -> Optional[BookingOut]:
    """Compatibility wrapper — create a booking (keeps existing name used across codebase)."""
    return await request_slot_booking(booking_data)

# Manager fetches pending booking requests for a station
async def get_pending_bookings(station_id: UUID) -> List[BookingOut]:
    try:
        supabase = await get_supabase_client()
        response = supabase.table("bookings").select("*").eq("station_id", str(station_id)).eq("status", "pending").execute()
        items = response.data or []
        return [BookingOut(**item) for item in items]
    except httpx.HTTPError as e:
        print(f"Error fetching pending bookings for station {station_id}: {e}")
        return []

# Manager accepts or rejects a booking
async def manager_update_booking_status(booking_id: UUID, status: str) -> Optional[BookingOut]:
    assert status in ["confirmed", "rejected"], "Status must be 'confirmed' or 'rejected'"
    try:
        supabase = await get_supabase_client()
        response = supabase.table("bookings").update({"status": status}).eq("id", str(booking_id)).execute()
        updated = (response.data or [None])[0]
        return BookingOut(**updated) if updated else None
    except httpx.HTTPError as e:
        print(f"Error updating booking status for {booking_id}: {e}")
        return None


async def accept_booking_atomic(booking_id: UUID, manager_id: UUID) -> Optional[BookingOut]:
    """Attempt to confirm a booking atomically: ensure no overlapping confirmed booking exists for the same slot
    and that the manager actually manages the station for this booking. Uses service-role client to avoid
    permission issues when reading other rows.
    Returns the updated BookingOut on success, or None on failure (conflict / not authorized).
    """
    # Try RPC first for atomic accept
    try:
        supabase = await get_supabase_service_role_client()
        rpc_res = supabase.rpc('accept_booking', { 'booking_uuid': str(booking_id), 'manager_uuid': str(manager_id) }).execute()
        data = getattr(rpc_res, 'data', None)
        if not data:
            print(f"accept_booking_atomic: RPC returned no data for {booking_id}")
            return None
        payload = data[0] if isinstance(data, list) and len(data) > 0 else data
        return BookingOut(**payload)
    except Exception as e:
        # If RPC not available or errors, fall back to application-side checks
        print(f"accept_booking_atomic rpc error (falling back): {e}")
        try:
            supabase = await get_supabase_service_role_client()

            # fetch booking
            resp = supabase.table("bookings").select("*").eq("id", str(booking_id)).single().execute()
            booking = resp.data
            if not booking:
                print(f"accept_booking_atomic: booking {booking_id} not found")
                return None

            if booking.get("status") != "pending":
                print(f"accept_booking_atomic: booking {booking_id} not pending (status={booking.get('status')})")
                return None

            slot_id = booking.get("slot_id")
            station_id = booking.get("station_id")
            start_time = booking.get("start_time")
            end_time = booking.get("end_time")

            # Verify manager manages the station
            station_check = supabase.table("stations").select("id").eq("id", station_id).eq("station_manager", str(manager_id)).single().execute()
            if not station_check.data:
                print(f"accept_booking_atomic: manager {manager_id} does not manage station {station_id}")
                return None

            # Get confirmed bookings for same slot and check for overlap
            confirmed_resp = supabase.table("bookings").select("*").eq("slot_id", slot_id).eq("status", "confirmed").execute()
            confirmed = confirmed_resp.data or []

            for a in confirmed:
                a_start = a.get("start_time")
                a_end = a.get("end_time")
                if not (a_end <= start_time or a_start >= end_time):
                    print(f"accept_booking_atomic: overlapping confirmed booking {a.get('id')} found for slot {slot_id}")
                    return None

            # No overlap and manager authorized — confirm booking
            upd = supabase.table("bookings").update({"status": "confirmed"}).eq("id", str(booking_id)).execute()
            updated = (upd.data or [None])[0]
            return BookingOut(**updated) if updated else None
        except Exception as e2:
            print(f"accept_booking_atomic fallback error: {e2}")
            return None

# Added: update a booking by id
async def update_booking(booking_id: UUID, update_data: BookingUpdate) -> Optional[BookingOut]:
    """Update booking fields (partial update supported)."""
    try:
        supabase = await get_supabase_client()
        # If a Pydantic model is passed, only include set fields
        upd = update_data.dict(exclude_unset=True) if hasattr(update_data, "dict") else dict(update_data)
        resp = supabase.table("bookings").update(upd).eq("id", str(booking_id)).execute()
        updated = (resp.data or [None])[0]
        return BookingOut(**updated) if updated else None
    except Exception as e:
        print(f"❌ Error updating booking {booking_id}: {e}")
        return None

# Added: fetch a single booking by id
async def get_booking(booking_id: UUID) -> Optional[BookingOut]:
    """Fetch a booking by its ID."""
    try:
        supabase = await get_supabase_client()
        resp = supabase.table("bookings").select("*").eq("id", str(booking_id)).single().execute()
        data = resp.data
        return BookingOut(**data) if data else None
    except Exception as e:
        print(f"❌ Error fetching booking {booking_id}: {e}")
        return None

# Added: list bookings, optionally filtered by user_id
async def list_bookings(user_id: Optional[UUID] = None) -> List[BookingOut]:
    """Return bookings. If user_id is provided, return bookings for that user only.

    Args:
        user_id: Optional UUID of the user whose bookings should be returned.
    """
    try:
        supabase = await get_supabase_client()
        # First get the basic booking data
        query = supabase.table("bookings").select("*")
        if user_id is not None:
            query = query.eq("user_id", str(user_id))
        resp = query.execute()
        items = resp.data or []

        # For each booking, fetch related data separately to avoid join issues
        transformed_items = []
        for item in items:
            transformed = dict(item)

            # Get vehicle info
            try:
                if item.get('vehicle_id'):
                    vehicle_resp = supabase.table("vehicles").select("brand, model").eq("id", str(item['vehicle_id'])).single().execute()
                    if vehicle_resp.data:
                        vehicle = vehicle_resp.data
                        transformed['vehicle_name'] = f"{vehicle.get('brand', '')} {vehicle.get('model', '')}".strip() or vehicle.get('name', 'Unknown Vehicle')
                    else:
                        transformed['vehicle_name'] = 'Unknown Vehicle'
                else:
                    transformed['vehicle_name'] = 'Unknown Vehicle'
            except Exception as e:
                print(f"Error fetching vehicle for booking {item.get('id')}: {e}")
                transformed['vehicle_name'] = 'Unknown Vehicle'

            # Get station info
            try:
                if item.get('station_id'):
                    station_resp = supabase.table("stations").select("name, address").eq("id", str(item['station_id'])).single().execute()
                    if station_resp.data:
                        station = station_resp.data
                        transformed['station_name'] = station.get('name', 'Unknown Station')
                        transformed['station_address'] = station.get('address', 'Address not available')
                    else:
                        transformed['station_name'] = 'Unknown Station'
                        transformed['station_address'] = 'Address not available'
                else:
                    transformed['station_name'] = 'Unknown Station'
                    transformed['station_address'] = 'Address not available'
            except Exception as e:
                print(f"Error fetching station for booking {item.get('id')}: {e}")
                transformed['station_name'] = 'Unknown Station'
                transformed['station_address'] = 'Address not available'

            # Get slot info
            try:
                if item.get('slot_id'):
                    slot_resp = supabase.table("charging_slots").select("connector_type").eq("id", str(item['slot_id'])).single().execute()
                    if slot_resp.data:
                        slot = slot_resp.data
                        transformed['connector_type'] = slot.get('connector_type', 'Unknown')
                    else:
                        transformed['connector_type'] = 'Unknown'
                else:
                    transformed['connector_type'] = 'Unknown'
            except Exception as e:
                print(f"Error fetching slot for booking {item.get('id')}: {e}")
                transformed['connector_type'] = 'Unknown'

            transformed_items.append(transformed)

        return [BookingOut(**item) for item in transformed_items]
    except Exception as e:
        print(f"❌ Error listing bookings: {e}")
        return []


async def activate_started_bookings() -> Dict[str, Any]:
    """Activate all confirmed bookings that have reached their start_time.

    Returns:
        Dict containing the number of bookings activated.
    """
    try:
        supabase = await get_supabase_service_role_client()

        # Call the RPC function to activate started bookings
        rpc_result = supabase.rpc('activate_started_bookings').execute()

        # Improved response parsing with multiple fallback strategies
        updated_count = 0
        message = ''

        try:
            # Strategy 1: Check if rpc_result.data is a list with items
            if hasattr(rpc_result, 'data') and rpc_result.data:
                if isinstance(rpc_result.data, list) and len(rpc_result.data) > 0:
                    result = rpc_result.data[0]
                    if isinstance(result, dict):
                        updated_count = result.get('updated_count', 0)
                        message = result.get('message', '')
                elif isinstance(rpc_result.data, dict):
                    # Handle case where data is directly a dict
                    updated_count = rpc_result.data.get('updated_count', 0)
                    message = rpc_result.data.get('message', '')

            # Strategy 2: Check for direct attributes on rpc_result
            elif hasattr(rpc_result, 'updated_count'):
                updated_count = getattr(rpc_result, 'updated_count', 0)
                message = getattr(rpc_result, 'message', '')

        except Exception as parse_error:
            print(f"⚠️  Response parsing failed: {parse_error}")
            # Strategy 3: Try to extract from error details if available
            try:
                if hasattr(rpc_result, 'data') and rpc_result.data:
                    # Look for JSON in string format
                    data_str = str(rpc_result.data)
                    if 'updated_count' in data_str:
                        import json
                        # Try to parse as JSON string
                        if data_str.startswith('b\'') and data_str.endswith('\''):
                            data_str = data_str[2:-1]  # Remove b'...' wrapper
                        parsed = json.loads(data_str)
                        updated_count = parsed.get('updated_count', 0)
                        message = parsed.get('message', '')
            except Exception as fallback_error:
                print(f"⚠️  Fallback parsing also failed: {fallback_error}")

        if updated_count > 0:
            print(f"✅ Activated {updated_count} started bookings")
            if message:
                print(f"   📝 {message}")
        else:
            print("ℹ️  No bookings to activate")

        return {"success": True, "updated_count": updated_count, "message": message}

    except Exception as e:
        print(f"❌ Error activating started bookings: {e}")
        # Don't return error details that might contain sensitive info
        return {"success": False, "error": "Failed to activate bookings", "updated_count": 0}


async def complete_expired_bookings() -> Dict[str, Any]:
    """Complete all active bookings that have passed their end_time.

    Returns:
        Dict containing the number of bookings completed.
    """
    try:
        supabase = await get_supabase_service_role_client()

        # Call the RPC function to complete expired bookings
        rpc_result = supabase.rpc('complete_expired_bookings').execute()

        # Improved response parsing with multiple fallback strategies
        updated_count = 0
        message = ''

        try:
            # Strategy 1: Check if rpc_result.data is a list with items
            if hasattr(rpc_result, 'data') and rpc_result.data:
                if isinstance(rpc_result.data, list) and len(rpc_result.data) > 0:
                    result = rpc_result.data[0]
                    if isinstance(result, dict):
                        updated_count = result.get('updated_count', 0)
                        message = result.get('message', '')
                elif isinstance(rpc_result.data, dict):
                    # Handle case where data is directly a dict
                    updated_count = rpc_result.data.get('updated_count', 0)
                    message = rpc_result.data.get('message', '')

            # Strategy 2: Check for direct attributes on rpc_result
            elif hasattr(rpc_result, 'updated_count'):
                updated_count = getattr(rpc_result, 'updated_count', 0)
                message = getattr(rpc_result, 'message', '')

        except Exception as parse_error:
            print(f"⚠️  Response parsing failed: {parse_error}")
            # Strategy 3: Try to extract from error details if available
            try:
                if hasattr(rpc_result, 'data') and rpc_result.data:
                    # Look for JSON in string format
                    data_str = str(rpc_result.data)
                    if 'updated_count' in data_str:
                        import json
                        # Try to parse as JSON string
                        if data_str.startswith('b\'') and data_str.endswith('\''):
                            data_str = data_str[2:-1]  # Remove b'...' wrapper
                        parsed = json.loads(data_str)
                        updated_count = parsed.get('updated_count', 0)
                        message = parsed.get('message', '')
            except Exception as fallback_error:
                print(f"⚠️  Fallback parsing also failed: {fallback_error}")

        if updated_count > 0:
            print(f"✅ Completed {updated_count} expired bookings")
            if message:
                print(f"   📝 {message}")
        else:
            print("ℹ️  No expired bookings to complete")

        return {"success": True, "updated_count": updated_count, "message": message}

    except Exception as e:
        print(f"❌ Error completing expired bookings: {e}")
        # Don't return error details that might contain sensitive info
        return {"success": False, "error": "Failed to complete bookings", "updated_count": 0}
