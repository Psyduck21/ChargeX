from fastapi import APIRouter, Depends, HTTPException, status
from typing import Any, List
from uuid import UUID

from ..dependencies import get_current_user
from ..crud import list_slots, create_slot
from ..models import SlotCreate, SlotOut

router = APIRouter(prefix="/slots", tags=["Slots"])


@router.get("/", response_model=List[SlotOut])
async def get_slots(current_user: Any = Depends(get_current_user)):
    """
    List all slots visible to the current user.
    - Admin: can see all slots
    - Station managers: see only slots for their stations
    - Other users: not authorized
    """
    role = (
        current_user.get("role")
        if isinstance(current_user, dict)
        else getattr(current_user, "role", None)
    )
    if role not in ["station_manager", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized"
        )

    station_ids = (
        current_user.get("station_ids", [])
        if isinstance(current_user, dict)
        else getattr(current_user, "station_ids", [])
    )
    return await list_slots(station_ids)


@router.post("/", response_model=SlotOut)
async def add_slot(slot: SlotCreate, current_user: Any = Depends(get_current_user)):
    """
    Create a new slot for a charging station.
    Only station managers can create slots.
    """
    role = (
        current_user.get("role")
        if isinstance(current_user, dict)
        else getattr(current_user, "role", None)
    )
    if role != "station_manager":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized"
        )

    station_ids = (
        current_user.get("station_ids", [])
        if isinstance(current_user, dict)
        else getattr(current_user, "station_ids", [])
    )
    if slot.station_id not in station_ids:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot create slot for stations you do not manage"
        )

    created = await create_slot(slot)
    return created
