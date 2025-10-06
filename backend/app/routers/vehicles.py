from fastapi import APIRouter, Depends, HTTPException
from typing import List
from uuid import UUID
from ..dependencies import get_current_user
from ..models import Vehicle, VehicleCreate
from ..crud import list_user_vehicles, create_vehicle, update_vehicle, get_vehicle

router = APIRouter(prefix="/vehicles", tags=["Vehicles"])

@router.get("/", response_model=List[Vehicle])
def get_vehicles(current_user = Depends(get_current_user)):
    user_id = current_user["id"] if isinstance(current_user, dict) else current_user.id
    return list_user_vehicles(user_id)

@router.post("/", response_model=Vehicle)
def add_vehicle(vehicle: VehicleCreate, current_user = Depends(get_current_user)):
    setattr(vehicle, "owner_id", current_user["id"] if isinstance(current_user, dict) else current_user.id)
    return create_vehicle(vehicle)

@router.get("/{vehicle_id}", response_model=Vehicle)
def get_vehicle_by_id(vehicle_id: UUID, current_user = Depends(get_current_user)):
    vehicle = get_vehicle(vehicle_id)
    user_id = current_user["id"] if isinstance(current_user, dict) else current_user.id
    if vehicle and vehicle.get("owner_id") != str(user_id):
        raise HTTPException(status_code=403, detail="Not authorized")
    return vehicle

@router.put("/{vehicle_id}", response_model=Vehicle)
def modify_vehicle(vehicle_id: UUID, update_data: dict, current_user = Depends(get_current_user)):
    vehicle = get_vehicle(vehicle_id)
    user_id = current_user["id"] if isinstance(current_user, dict) else current_user.id
    if vehicle and vehicle.get("owner_id") != str(user_id):
        raise HTTPException(status_code=403, detail="Not authorized")
    return update_vehicle(vehicle_id, update_data)
