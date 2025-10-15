from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any

from ..dependencies import get_current_user, require_admin
from ..crud import list_charging_sessions, create_charging_session, list_charging_sessions_between

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


@router.get("/analytics/consumption", response_model=List[Dict[str, Any]], dependencies=[Depends(require_admin)])
def consumption_analytics(start: str, end: str):
    """Return charging sessions between ISO dates; frontend aggregates kWh by day/station."""
    # Admin has access to all stations; pass empty list to signal "all" here and let CRUD handle
    # We don't have a list-all variant, so call between with all by fetching station ids from stations table via list_stations
    from ..crud import list_stations
    stations = list_stations()
    station_ids = [s.get("station_id") or s.get("id") for s in stations if s.get("station_id") or s.get("id")]
    return list_charging_sessions_between(station_ids, start, end)
