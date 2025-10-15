from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any
from uuid import UUID
from ..dependencies import require_admin
from ..crud import (
    list_station_managers, 
    create_station_manager, 
    update_station_manager,
    get_station_manager,
    get_all_station_managers
)

router = APIRouter(prefix="/station_managers", tags=["StationManagers"])


@router.get("/", dependencies=[Depends(require_admin)])
def read_all_managers() -> List[Dict[str, Any]]:
    """
    List all station managers.
    Only accessible by admins.
    """
    return list_station_managers()


@router.post("/", dependencies=[Depends(require_admin)])
def add_station_manager(manager: Dict[str, Any]) -> Dict[str, Any]:
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
    if not manager.get("name") or not manager.get("email"):
        raise HTTPException(status_code=400, detail="Missing required fields: name or email")
    
    return create_station_manager(manager)


@router.get("/{manager_id}", dependencies=[Depends(require_admin)])
def get_manager(manager_id: UUID) -> Dict[str, Any]:
    """Get a specific station manager by ID"""
    manager = get_station_manager(manager_id)
    if not manager:
        raise HTTPException(status_code=404, detail="Station manager not found")
    return manager


@router.put("/{manager_id}", dependencies=[Depends(require_admin)])
def update_manager(manager_id: UUID, update_data: Dict[str, Any]) -> Dict[str, Any]:
    """Update a station manager"""
    updated = update_station_manager(manager_id, update_data)
    if not updated:
        raise HTTPException(status_code=404, detail="Station manager not found")
    return updated


@router.get("/admin/all-with-stations", dependencies=[Depends(require_admin)])
def get_all_managers_with_stations() -> List[Dict[str, Any]]:
    """Get all station managers with their station assignments"""
    return get_all_station_managers()
