from fastapi import APIRouter, Depends, HTTPException
from typing import List
from ..dependencies import get_current_user
from ..models import ChargingSession, ChargingSessionCreate
from ..crud import list_charging_sessions, create_charging_session

router = APIRouter(prefix="/charging_sessions", tags=["ChargingSessions"])

@router.get("/", response_model=List[ChargingSession])
def get_sessions(current_user = Depends(get_current_user)):
    station_ids = current_user.get("station_ids", []) if isinstance(current_user, dict) else getattr(current_user, "station_ids", [])
    return list_charging_sessions(station_ids)

@router.post("/", response_model=ChargingSession)
def add_session(session: ChargingSessionCreate, current_user = Depends(get_current_user)):
    role = current_user.get("role") if isinstance(current_user, dict) else getattr(current_user, "role", None)
    if role not in ["station_manager", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    return create_charging_session(session)
