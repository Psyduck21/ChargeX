from fastapi import APIRouter, Depends
from typing import List
from ..dependencies import require_admin
from ..models import StationManager
from ..crud import list_station_managers, create_station_manager

router = APIRouter(prefix="/station_managers", tags=["StationManagers"])

@router.get("/", response_model=List[StationManager], dependencies=[Depends(require_admin)])
def read_all_managers():
    return list_station_managers()

@router.post("/", response_model=StationManager, dependencies=[Depends(require_admin)])
def add_station_manager(manager: StationManager):
    return create_station_manager(manager)
