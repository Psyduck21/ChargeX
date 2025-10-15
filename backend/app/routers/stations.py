from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any
from uuid import UUID
from ..dependencies import require_admin, get_current_user
from ..crud import (
    list_stations,
    create_station,
    update_station,
    list_managers_for_station,
    assign_manager_to_station,
    delete_station,
    get_admin_statistics,
    get_stations_with_managers,
    get_all_users,
    get_all_station_managers,
)

router = APIRouter(prefix="/stations", tags=["Stations"])


@router.get("/", response_model=List[Dict[str, Any]], dependencies=[Depends(get_current_user)])
def read_stations():
    """List all stations. Admin/Managers will filter on client as needed."""
    return list_stations()


@router.post("/", response_model=Dict[str, Any], dependencies=[Depends(require_admin)])
def add_station(station: Dict[str, Any]):
    if not station.get("name") or not station.get("city"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Missing name or location")
    return create_station(station)


@router.put("/{station_id}", response_model=Dict[str, Any], dependencies=[Depends(require_admin)])
def edit_station(station_id: UUID, update: Dict[str, Any]):
    updated = update_station(station_id, update)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Station not found")
    return updated


@router.get("/{station_id}/managers", response_model=List[Dict[str, Any]], dependencies=[Depends(require_admin)])
def get_station_managers(station_id: UUID):
    return list_managers_for_station(station_id)


@router.post("/{station_id}/assign_manager", response_model=Dict[str, Any], dependencies=[Depends(require_admin)])
def assign_manager(station_id: UUID, body: Dict[str, Any]):
    manager_user_id = body.get("id")
    if not manager_user_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="user_id required")
    return assign_manager_to_station(UUID(str(manager_user_id)), station_id)


@router.delete("/{station_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_admin)])
def remove_station(station_id: UUID):
    delete_station(station_id)
    return None


# Admin Dashboard Endpoints
@router.get("/admin/statistics", response_model=Dict[str, Any], dependencies=[Depends(require_admin)])
def get_dashboard_statistics():
    """Get statistics for admin dashboard"""
    return get_admin_statistics()


@router.get("/admin/stations-with-managers", response_model=List[Dict[str, Any]], dependencies=[Depends(require_admin)])
def get_stations_with_managers_info():
    """Get all stations with their assigned managers"""
    return get_stations_with_managers()


@router.get("/admin/users", response_model=List[Dict[str, Any]], dependencies=[Depends(require_admin)])
def get_all_users_admin():
    """Get all users for admin dashboard"""
    return get_all_users()


@router.get("/admin/managers", response_model=List[Dict[str, Any]], dependencies=[Depends(require_admin)])
def get_all_managers_admin():
    """Get all station managers for admin dashboard"""
    return get_all_station_managers()
