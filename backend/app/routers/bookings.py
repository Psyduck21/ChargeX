from fastapi import APIRouter, Depends, HTTPException, Request
from typing import Any
from ..dependencies import get_current_user
from ..crud import list_bookings, create_booking

router = APIRouter(prefix="/bookings", tags=["Bookings"])


@router.get("/")
def get_bookings(current_user: Any = Depends(get_current_user)):
    """
    Return list of bookings for the current user.
    """
    user_id = current_user["id"] if isinstance(current_user, dict) else getattr(current_user, "id", None)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid user")

    # Call your existing CRUD layer
    return list_bookings(user_id)


@router.post("/")
async def add_booking(request: Request, current_user: Any = Depends(get_current_user)):
    """
    Create a new booking for the current user.
    """
    user_id = current_user["id"] if isinstance(current_user, dict) else getattr(current_user, "id", None)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid user")

    data = await request.json()

    # Attach user_id from current_user
    data["user_id"] = user_id

    try:
        new_booking = create_booking(data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to create booking: {e}")

    return new_booking
