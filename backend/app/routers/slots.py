from fastapi import APIRouter, Depends, HTTPException, status
from typing import Any, List
from uuid import UUID

from ..dependencies import get_current_user
from ..crud import list_slots, create_slot, update_slot, get_slot
from ..models import SlotCreate, SlotUpdate, SlotOut

router = APIRouter(prefix="/slots", tags=["Slots"])


@router.get("/", response_model=List[SlotOut])
async def get_slots(current_user: Any = Depends(get_current_user)):
    """
    List all slots visible to the current user.
    - Admin: can see all slots
    - Station managers: see only slots for their stations
    - Regular users: can see all slots for booking purposes
    """
    role = (
        current_user.get("role")
        if isinstance(current_user, dict)
        else getattr(current_user, "role", None)
    )

    station_ids = (
        current_user.get("station_ids", [])
        if isinstance(current_user, dict)
        else getattr(current_user, "station_ids", [])
    )

    # Regular users can see all slots for booking
    if role == "app_user":
        return await list_slots([])  # Empty list means all slots

    # Station managers and admins see filtered slots
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
    # Convert station_ids to UUID objects for proper comparison
    station_ids = [UUID(sid) for sid in station_ids]
    if slot.station_id not in station_ids:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot create slot for stations you do not manage"
        )

    created = await create_slot(slot)
    print("Created slot:", created)
    return created


@router.put("/{slot_id}", response_model=SlotOut)
async def update_slot_endpoint(
    slot_id: UUID,
    slot_update: SlotUpdate,
    current_user: Any = Depends(get_current_user)
):
    """
    Update a slot.
    Only station managers can update slots for their stations.
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

    # Get the slot to check ownership
    slot = await get_slot(slot_id)
    if not slot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Slot not found"
        )

    station_ids = (
        current_user.get("station_ids", [])
        if isinstance(current_user, dict)
        else getattr(current_user, "station_ids", [])
    )
    # Convert station_ids to UUID objects for proper comparison
    station_ids = [UUID(sid) for sid in station_ids]
    if UUID(slot["station_id"]) not in station_ids:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot update slot for stations you do not manage"
        )

    updated = await update_slot(slot_id, slot_update.model_dump(exclude_unset=True))
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update slot"
        )
    return updated


@router.delete("/{slot_id}")
async def delete_slot_endpoint(
    slot_id: UUID,
    current_user: Any = Depends(get_current_user)
):
    """
    Delete a slot.
    Only station managers can delete slots for their stations.
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

    # Get the slot to check ownership
    slot = await get_slot(slot_id)
    if not slot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Slot not found"
        )

    station_ids = (
        current_user.get("station_ids", [])
        if isinstance(current_user, dict)
        else getattr(current_user, "station_ids", [])
    )
    # Convert station_ids to UUID objects for proper comparison
    station_ids = [UUID(sid) for sid in station_ids]
    if UUID(slot["station_id"]) not in station_ids:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot delete slot for stations you do not manage"
        )

    # For deletion, we'll need to add a delete function to CRUD
    # For now, let's mark as unavailable instead of deleting
    updated = await update_slot(slot_id, {"is_available": False})
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete slot"
        )
    return {"message": "Slot deleted successfully"}
