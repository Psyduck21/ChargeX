from fastapi import APIRouter, Depends, HTTPException
from typing import List
from ..dependencies import get_current_user
from ..models import Slot, SlotCreate
from ..crud import list_slots, create_slot

router = APIRouter(prefix="/slots", tags=["Slots"])

@router.get("/", response_model=List[Slot])
def get_slots(current_user = Depends(get_current_user)):
    station_ids = current_user.get("station_ids", []) if isinstance(current_user, dict) else getattr(current_user, "station_ids", [])
    return list_slots(station_ids)

@router.post("/", response_model=Slot)
def add_slot(slot: SlotCreate, current_user = Depends(get_current_user)):
    role = current_user.get("role") if isinstance(current_user, dict) else getattr(current_user, "role", None)
    if role != "station_manager":
        raise HTTPException(status_code=403, detail="Not authorized")
    return create_slot(slot)
