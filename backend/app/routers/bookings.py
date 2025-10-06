from fastapi import APIRouter, Depends
from typing import List
from ..dependencies import get_current_user
from ..models import Booking, BookingCreate
from ..crud import list_bookings, create_booking

router = APIRouter(prefix="/bookings", tags=["Bookings"])

@router.get("/", response_model=List[Booking])
def get_bookings(current_user = Depends(get_current_user)):
    return list_bookings(current_user["id"]) if isinstance(current_user, dict) else list_bookings(current_user.id)

@router.post("/", response_model=Booking)
def add_booking(booking: BookingCreate, current_user = Depends(get_current_user)):
    # Assuming BookingCreate has user_id in schema; if not, adapt CRUD/create accordingly
    setattr(booking, "user_id", current_user["id"] if isinstance(current_user, dict) else current_user.id)
    return create_booking(booking)
