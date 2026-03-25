from fastapi import APIRouter, Depends, HTTPException, Request, status
from typing import Any, List, Dict
from uuid import UUID
from ..dependencies import get_current_user
from ..crud.bookings import list_bookings, create_booking, get_booking, update_booking, accept_booking_atomic, complete_expired_bookings
from ..crud.profiles import get_user_profile
from ..utils.logger import log_activity
from ..models.booking_model import BookingCreate, BookingOut, BookingUpdate
from ..database import get_supabase_client

router = APIRouter(prefix="/bookings", tags=["Bookings"])


@router.get("/", response_model=List[BookingOut])
async def get_bookings(current_user: Any = Depends(get_current_user)):
    """
    Return list of bookings for the current user.
    """
    user_id = current_user["id"] if isinstance(current_user, dict) else getattr(current_user, "id", None)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid user")

    # Call your existing CRUD layer
    return await list_bookings(user_id)


@router.post("/", response_model=BookingOut)
async def add_booking(request: Request, current_user: Any = Depends(get_current_user)):
    """
    Create a new booking for the current user.
    """
    user_id = current_user["id"] if isinstance(current_user, dict) else getattr(current_user, "id", None)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid user")

    body = await request.json()
    booking = BookingCreate(**body)
    data = booking.dict()
    data["user_id"] = str(user_id)

    try:
        new_booking = await create_booking(BookingCreate(**data))
    except ValueError as e:
        # Handle booking validation errors with user-friendly messages
        error_msg = str(e)
        if "unavailable between" in error_msg or "due to booking" in error_msg:
            raise HTTPException(status_code=409, detail="This charging slot is not available during your selected time. Please choose a different time or slot.")
        elif "start_time and end_time are required" in error_msg:
            raise HTTPException(status_code=400, detail="Please select valid start and end times for your booking.")
        elif "end_time must be after start_time" in error_msg:
            raise HTTPException(status_code=400, detail="End time must be after start time.")
        else:
            raise HTTPException(status_code=400, detail="Invalid booking details. Please check your inputs and try again.")
    except Exception as e:
        # Catch any other unexpected errors
        raise HTTPException(status_code=500, detail="Unable to create booking at this time. Please try again later.")

    # Log activity if user is a manager
    user_role = current_user.get("role") if isinstance(current_user, dict) else getattr(current_user, "role", None)
    if user_role == "station_manager":
        user_profile = await get_user_profile(user_id)
        await log_activity(
            user_id=user_id,
            user_name=user_profile.email if user_profile else "Unknown",
            role=user_role,
            action="Created Booking",
            description=f"Created booking for slot {new_booking.slot_id}",
            station_name=None  # Could be added if we join with slot->station
        )

    return new_booking


@router.put("/{booking_id}", response_model=BookingOut)
async def update_booking_item(booking_id: UUID, update: BookingUpdate, current_user: Any = Depends(get_current_user)):
    """Update a booking (owner or station_manager)."""
    user_id = current_user["id"] if isinstance(current_user, dict) else getattr(current_user, "id", None)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid user")

    # Fetch existing booking to check ownership/permissions
    existing = await get_booking(booking_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Booking not found")

    user_role = current_user.get("role") if isinstance(current_user, dict) else getattr(current_user, "role", None)

    # allow only the booking owner or station managers to update
    if str(existing.user_id) != str(user_id) and user_role != "station_manager":
        raise HTTPException(status_code=403, detail="Not authorized to modify this booking")

    # If manager attempts to accept a booking, perform an atomic accept that checks for overlaps
    if user_role == "station_manager" and update.status == "accepted":
        accepted = await accept_booking_atomic(booking_id, user_id)
        if not accepted:
            raise HTTPException(status_code=409, detail="Could not accept booking: a conflicting accepted booking exists or you are not authorized")
        return accepted

    # For all other updates, ensure if user is station_manager they actually manage the station
    if user_role == "station_manager":
        supabase = await get_supabase_client()
        # verify station ownership
        station_check = supabase.table("stations").select("id").eq("id", str(existing.station_id)).eq("station_manager", str(user_id)).maybe_single().execute()
        if not getattr(station_check, 'data', None):
            raise HTTPException(status_code=403, detail="Not authorized to modify bookings for this station")

    # Booking Rejection Logic with Safety Checks and Alternative Stations
    if user_role == "station_manager" and update.status == "rejected":
        # Check current battery if provided, or fetch it from existing DB record
        btry = update.current_battery_level if update.current_battery_level is not None else getattr(existing, "current_battery_level", None)
        if hasattr(existing, "dict"):
            btry = existing.dict().get("current_battery_level", btry)
            
        if btry is not None and float(btry) < 15.0:
            raise HTTPException(status_code=400, detail="Cannot reject booking: User vehicle battery is dangerously low (<15%). Recommend acceptance for safety.")

    updated = await update_booking(booking_id, update)
    if not updated:
        raise HTTPException(status_code=400, detail="Failed to update booking")

    # If rejected, append the nearest available station to the response
    if update.status == "rejected" and user_role == "station_manager":
        try:
            from ..crud.station import find_nearest_station
            nearest = await find_nearest_station(str(existing.station_id))
            if nearest:
                # since updated is an instance of BookingOut, we set the property
                updated.nearest_station = nearest
        except Exception as e:
            print(f"Error finding nearest station: {e}")

    return updated


@router.post("/{booking_id}/cancel", response_model=BookingOut)
async def cancel_booking(booking_id: UUID, current_user: Any = Depends(get_current_user)):
    """Cancel a booking (owner or station_manager)."""
    user_id = current_user["id"] if isinstance(current_user, dict) else getattr(current_user, "id", None)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid user")

    existing = await get_booking(booking_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Booking not found")

    user_role = current_user.get("role") if isinstance(current_user, dict) else getattr(current_user, "role", None)
    if str(existing.user_id) != str(user_id) and user_role != "station_manager":
        raise HTTPException(status_code=403, detail="Not authorized to cancel this booking")

    # If manager, ensure they manage the station
    if user_role == "station_manager":
        supabase = await get_supabase_client()
        station_check = supabase.table("stations").select("id").eq("id", str(existing.station_id)).eq("station_manager", str(user_id)).maybe_single().execute()
        if not getattr(station_check, 'data', None):
            raise HTTPException(status_code=403, detail="Not authorized to cancel bookings for this station")

    # mark as cancelled
    cancelled = await update_booking(booking_id, BookingUpdate(status="cancelled"))
    if not cancelled:
        raise HTTPException(status_code=400, detail="Failed to cancel booking")
    return cancelled


@router.post("/complete-expired", response_model=Dict[str, Any])
async def complete_expired_bookings_endpoint(current_user: Any = Depends(get_current_user)):
    """Complete all accepted bookings that have passed their end_time (admin/station_manager only)."""
    user_role = current_user.get("role") if isinstance(current_user, dict) else getattr(current_user, "role", None)

    # Only allow admins and station managers to trigger this
    if user_role not in ["admin", "station_manager"]:
        raise HTTPException(status_code=403, detail="Not authorized to complete expired bookings")

    result = await complete_expired_bookings()

    if not result.get("success", False):
        error_msg = result.get("error", "Unknown error occurred")
        raise HTTPException(status_code=500, detail=f"Failed to complete expired bookings: {error_msg}")

    return result
