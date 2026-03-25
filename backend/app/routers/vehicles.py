from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any
from uuid import UUID
from ..dependencies import get_current_user
from ..crud.vehicles import list_user_vehicles, create_vehicle, update_vehicle, get_vehicle
from ..models.vehicle_model import VehicleCreate, VehicleOut, VehicleUpdate

router = APIRouter(prefix="/vehicles", tags=["Vehicles"])


@router.get("/", response_model=List[VehicleOut])
async def get_vehicles(current_user: Any = Depends(get_current_user)):
    """
    List all vehicles belonging to the current user.
    """
    user_id = current_user["id"] if isinstance(current_user, dict) else current_user.id
    return await list_user_vehicles(user_id)


@router.post("/", response_model=VehicleOut)
async def add_vehicle(vehicle: VehicleCreate, current_user: Any = Depends(get_current_user)):
    """
    Add a new vehicle for the current user.
    """
    user_id = current_user["id"] if isinstance(current_user, dict) else current_user.id
    payload = vehicle.dict()
    payload["owner_id"] = str(user_id)
    created = await create_vehicle(VehicleCreate(**payload))
    return created


@router.get("/{vehicle_id}", response_model=VehicleOut)
async def get_vehicle_by_id(vehicle_id: UUID, current_user: Any = Depends(get_current_user)):
    """
    Retrieve a vehicle by ID.
    Only the owner can access their vehicle.
    """
    vehicle = await get_vehicle(vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found")
    
    user_id = current_user["id"] if isinstance(current_user, dict) else current_user.id
    if vehicle.owner_id != str(user_id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    return vehicle


@router.put("/{vehicle_id}", response_model=VehicleOut)
async def modify_vehicle(vehicle_id: UUID, update_data: VehicleUpdate, current_user: Any = Depends(get_current_user)):
    """
    Update a vehicle's details.
    Only the owner can update their vehicle.
    """
    vehicle = await get_vehicle(vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found")
    
    user_id = current_user["id"] if isinstance(current_user, dict) else current_user.id
    if vehicle.owner_id != str(user_id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    return await update_vehicle(vehicle_id, update_data)
