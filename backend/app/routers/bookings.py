from fastapi import APIRouter, Depends, HTTPException, Request, status
from typing import Any, List
from uuid import UUID
from ..dependencies import get_current_user
from ..crud.bookings import list_bookings, create_booking, get_booking, update_booking
from ..crud.profiles import get_user_profile
from ..utils.logger import log_activity
from ..models.booking_model import BookingCreate, BookingOut, BookingUpdate

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
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to create booking: {e}")

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
