from fastapi import APIRouter, Depends, HTTPException
from typing import List
from uuid import UUID
from ..dependencies import get_current_user, require_admin
from ..models import Station, StationCreate
from ..crud import list_stations, create_station, update_station, get_station

router = APIRouter(prefix="/stations", tags=["Stations"])

@router.get("/", response_model=List[Station])
def get_all_stations(_: dict = Depends(get_current_user)):
    return list_stations()

@router.post("/", response_model=Station, dependencies=[Depends(require_admin)])
def add_station(station: StationCreate):
    return create_station(station)

@router.put("/{station_id}", response_model=Station)
def modify_station(station_id: UUID, update_data: dict, current_user = Depends(get_current_user)):
    _ = get_station(station_id)
    role = current_user.get("role") if isinstance(current_user, dict) else getattr(current_user, "role", None)
    station_ids = current_user.get("station_ids", []) if isinstance(current_user, dict) else getattr(current_user, "station_ids", [])
    if role == "station_manager" and station_id not in station_ids:
        raise HTTPException(status_code=403, detail="Not authorized")
    return update_station(station_id, update_data)
