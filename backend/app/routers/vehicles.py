from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any
from uuid import UUID
from ..dependencies import get_current_user
from ..crud import list_user_vehicles, create_vehicle, update_vehicle, get_vehicle

router = APIRouter(prefix="/vehicles", tags=["Vehicles"])


@router.get("/", response_model=List[Dict[str, Any]])
def get_vehicles(current_user: Any = Depends(get_current_user)):
    """
    List all vehicles belonging to the current user.
    """
    user_id = current_user["id"] if isinstance(current_user, dict) else current_user.id
    return list_user_vehicles(user_id)


@router.post("/", response_model=Dict[str, Any])
def add_vehicle(vehicle: Dict[str, Any], current_user: Any = Depends(get_current_user)):
    """
    Add a new vehicle for the current user.
    """
    user_id = current_user["id"] if isinstance(current_user, dict) else current_user.id
    vehicle["owner_id"] = str(user_id)
    return create_vehicle(vehicle)


@router.get("/{vehicle_id}", response_model=Dict[str, Any])
def get_vehicle_by_id(vehicle_id: UUID, current_user: Any = Depends(get_current_user)):
    """
    Retrieve a vehicle by ID.
    Only the owner can access their vehicle.
    """
    vehicle = get_vehicle(vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found")
    
    user_id = current_user["id"] if isinstance(current_user, dict) else current_user.id
    if vehicle.get("owner_id") != str(user_id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    return vehicle


@router.put("/{vehicle_id}", response_model=Dict[str, Any])
def modify_vehicle(vehicle_id: UUID, update_data: Dict[str, Any], current_user: Any = Depends(get_current_user)):
    """
    Update a vehicle's details.
    Only the owner can update their vehicle.
    """
    vehicle = get_vehicle(vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found")
    
    user_id = current_user["id"] if isinstance(current_user, dict) else current_user.id
    if vehicle.get("owner_id") != str(user_id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    return update_vehicle(vehicle_id, update_data)
