from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any
from uuid import UUID
from ..dependencies import require_admin, require_station_manager, get_current_user
from ..crud.station_manager import (
    get_station_manager,
    create_station_manager,
    update_station_manager,
    assign_manager_to_station,
    delete_station_manager
)
from ..crud.profiles import get_user_profile
from ..utils.logger import log_activity
from ..crud import (
    get_manager_stations,
    get_manager_bookings,
    get_manager_sessions
)

from ..crud.statistics import (
    list_station_managers,
    get_all_station_managers
)

router = APIRouter(prefix="/station_managers", tags=["StationManagers"])

@router.get("/", dependencies=[Depends(require_admin)])
async def read_all_managers() -> List[Dict[str, Any]]:
    """
    List all station managers.
    Only accessible by admins.
    """
    return await list_station_managers()


@router.post("/", dependencies=[Depends(require_admin)])
async def add_station_manager(manager: Dict[str, Any], current_user: dict = Depends(get_current_user)) -> Dict[str, Any]:
    """
    Create a new station manager.
    Expects a JSON object with fields like:
    {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "station_ids": ["uuid1", "uuid2"]
    }
    """

    insert_response = await create_station_manager(manager)
    print("Created station manager:", insert_response)

    # Log activity
    user_profile = await get_user_profile(current_user["id"])
    manager_name = manager.get("name", "Unknown")
    await log_activity(
        user_id=current_user["id"],
        user_name=user_profile.email if user_profile else "Unknown",
        role=current_user["role"],
        action="Created Station Manager",
        description=f"Added new station manager '{manager_name}'"
    )

    return insert_response


@router.get("/{manager_id}", dependencies=[Depends(require_admin)])
async def get_manager(manager_id: UUID) -> Dict[str, Any]:
    """Get a specific station manager by ID"""
    manager = await get_station_manager(manager_id)
    if not manager:
        raise HTTPException(status_code=404, detail="Station manager not found")
    return manager


@router.put("/{manager_id}", dependencies=[Depends(require_admin)])
async def update_manager(manager_id: UUID, update_data: Dict[str, Any], current_user: dict = Depends(get_current_user)) -> Dict[str, Any]:
    """Update a station manager"""
    # Get current manager info for logging
    current_manager = await get_station_manager(manager_id)
    if not current_manager:
        raise HTTPException(status_code=404, detail="Station manager not found")

    updated = await update_station_manager(manager_id, update_data)
    if not updated:
        raise HTTPException(status_code=404, detail="Station manager not found")

    # Log activity
    user_profile = await get_user_profile(current_user["id"])
    manager_name = current_manager.get("name", "Unknown")
    await log_activity(
        user_id=current_user["id"],
        user_name=user_profile.email if user_profile else "Unknown",
        role=current_user["role"],
        action="Updated Station Manager",
        description=f"Modified station manager '{manager_name}'"
    )

    return updated


@router.get("/admin/all-with-stations", dependencies=[Depends(require_admin)])
async def get_all_managers_with_stations() -> List[Dict[str, Any]]:
    """Get all station managers with their station assignments"""
    return await get_all_station_managers()


@router.delete("/{manager_id}", dependencies=[Depends(require_admin)])
async def delete_manager(manager_id: UUID, current_user: dict = Depends(get_current_user)) -> Dict[str, str]:
    """Delete a station manager by ID. Unassigns stations and updates role."""
    # Get manager info before deletion for logging
    manager_to_delete = await get_station_manager(manager_id)
    if not manager_to_delete:
        raise HTTPException(status_code=404, detail="Station manager not found")

    success = await delete_station_manager(manager_id)
    if not success:
        raise HTTPException(status_code=404, detail="Station manager not found")

    # Log activity
    user_profile = await get_user_profile(current_user["id"])
    manager_name = manager_to_delete.get("name", "Unknown")
    await log_activity(
        user_id=current_user["id"],
        user_name=user_profile.email if user_profile else "Unknown",
        role=current_user["role"],
        action="Deleted Station Manager",
        description=f"Removed station manager '{manager_name}'"
    )

    return {"message": "Station manager deleted successfully"}


# ------------------------
# ✅ Station Manager Dashboard Endpoints
# ------------------------

@router.get("/my-stations", dependencies=[Depends(require_station_manager)])
async def get_my_stations(current_user: dict = Depends(get_current_user)) -> List[Dict[str, Any]]:
    """Get all stations managed by the current station manager"""
    return await get_manager_stations(current_user["id"])


@router.get("/my-bookings", dependencies=[Depends(require_station_manager)])
async def get_my_bookings(current_user: dict = Depends(get_current_user)) -> List[Dict[str, Any]]:
    """Get all bookings for stations managed by the current station manager"""
    return await get_manager_bookings(current_user["id"])


@router.get("/my-sessions", dependencies=[Depends(require_station_manager)])
async def get_my_sessions(current_user: dict = Depends(get_current_user)) -> List[Dict[str, Any]]:
    """Get all charging sessions for stations managed by the current station manager"""
    return await get_manager_sessions(current_user["id"])
