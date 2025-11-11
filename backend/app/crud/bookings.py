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
    (statuses: pending, accepted) and reject the creation if a time overlap is found.
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
    start_dt = _parse_dt(booking_dict.get('start_time'))
    end_dt = _parse_dt(booking_dict.get('end_time'))
    if not start_dt or not end_dt:
        raise ValueError("start_time and end_time are required and must be valid datetimes")
    if end_dt <= start_dt:
        raise ValueError("end_time must be after start_time")

    slot_id = booking_dict.get('slot_id')
    # If slot specified, ensure no overlapping blocking bookings exist
    if slot_id:
        try:
            blocking_statuses = ["accepted", "pending"]
            resp = supabase.table("bookings").select("*").eq("slot_id", str(slot_id)).in_("status", blocking_statuses).execute()
            existing = resp.data or []
            for b in existing:
                b_start = _parse_dt(b.get('start_time'))
                b_end = _parse_dt(b.get('end_time'))
                if b_start and b_end:
                    # overlap if requested_start < existing_end and existing_start < requested_end
                    if start_dt < b_end and b_start < end_dt:
                        raise ValueError(f"Slot {slot_id} unavailable between {b_start.isoformat()} and {b_end.isoformat()} due to booking {b.get('id')}")
        except httpx.HTTPError as e:
            print(f"Error checking existing bookings for slot {slot_id}: {e}")
            # re-raise to be handled by router
            raise

    # No conflicts — convert datetimes to ISO strings and insert as pending
    try:
        if isinstance(start_dt, datetime):
            booking_dict['start_time'] = start_dt.isoformat()
        if isinstance(end_dt, datetime):
            booking_dict['end_time'] = end_dt.isoformat()

        booking_dict['status'] = 'pending'
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
    assert status in ["accepted", "rejected"], "Status must be 'accepted' or 'rejected'"
    try:
        supabase = await get_supabase_client()
        response = supabase.table("bookings").update({"status": status}).eq("id", str(booking_id)).execute()
        updated = (response.data or [None])[0]
        return BookingOut(**updated) if updated else None
    except httpx.HTTPError as e:
        print(f"Error updating booking status for {booking_id}: {e}")
        return None


async def accept_booking_atomic(booking_id: UUID, manager_id: UUID) -> Optional[BookingOut]:
    """Attempt to accept a booking atomically: ensure no overlapping accepted booking exists for the same slot
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

            # Get accepted bookings for same slot and check for overlap
            accepted_resp = supabase.table("bookings").select("*").eq("slot_id", slot_id).eq("status", "accepted").execute()
            accepted = accepted_resp.data or []

            for a in accepted:
                a_start = a.get("start_time")
                a_end = a.get("end_time")
                if not (a_end <= start_time or a_start >= end_time):
                    print(f"accept_booking_atomic: overlapping accepted booking {a.get('id')} found for slot {slot_id}")
                    return None

            # No overlap and manager authorized — accept booking
            upd = supabase.table("bookings").update({"status": "accepted"}).eq("id", str(booking_id)).execute()
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
                    vehicle_resp = supabase.table("vehicles").select("name, brand, model").eq("id", str(item['vehicle_id'])).single().execute()
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
                    slot_resp = supabase.table("slots").select("connector_type").eq("id", str(item['slot_id'])).single().execute()
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
    """Activate all accepted bookings that have reached their start_time.

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
