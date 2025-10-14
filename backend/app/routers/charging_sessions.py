from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any

from ..dependencies import get_current_user
from ..crud import list_charging_sessions, create_charging_session

router = APIRouter(
    prefix="/charging_sessions",
    tags=["ChargingSessions"]
)


@router.get("/", response_model=List[Dict[str, Any]])
def get_sessions(current_user=Depends(get_current_user)):
    """
    List charging sessions accessible to the current user.
    Station managers/admins can view their stations' sessions.
    """
    # Extract station_ids for the current user
    station_ids = (
        current_user.get("station_ids", [])
        if isinstance(current_user, dict)
        else getattr(current_user, "station_ids", [])
    )

    return list_charging_sessions(station_ids)


@router.post("/", response_model=Dict[str, Any])
def add_session(session: Dict[str, Any], current_user=Depends(get_current_user)):
    """
    Add a new charging session.
    Only station managers and admins can create sessions.
    """
    # Check user role
    role = (
        current_user.get("role")
        if isinstance(current_user, dict)
        else getattr(current_user, "role", None)
    )

    if role not in ["station_manager", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to create a charging session."
        )

    return create_charging_session(session)
