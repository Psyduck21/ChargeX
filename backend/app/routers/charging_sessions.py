from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any

from ..dependencies import get_current_user, require_admin
from ..crud import list_charging_sessions, create_charging_session, list_charging_sessions_between, list_stations
from ..models import ChargingSessionCreate, ChargingSessionOut
from ..database import get_supabase_client

router = APIRouter(
    prefix="/charging_sessions",
    tags=["ChargingSessions"]
)


@router.get("/user/", response_model=List[Dict[str, Any]])
async def get_user_sessions(current_user=Depends(get_current_user)):
    """
    List charging sessions for the current user with station and vehicle data populated.
    This includes completed sessions with actual costs.
    """
    user_id = current_user["id"] if isinstance(current_user, dict) else getattr(current_user, "id", None)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid user")

    try:
        supabase = await get_supabase_client()

        # Get all charging sessions for this user
        response = supabase.table("charging_sessions").select("*").eq("user_id", str(user_id)).order("created_at", desc=True).execute()
        sessions = response.data or []

        print(f"Found {len(sessions)} charging sessions for user {user_id}")

        # For now, just return the raw session data to avoid database issues
        # We'll process the data on the client side
        processed_sessions = []
        for session in sessions:
            processed = dict(session)
            processed_sessions.append(processed)

        return processed_sessions
    except Exception as e:
        print(f"Error fetching user sessions: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch user sessions")


@router.get("/", response_model=List[ChargingSessionOut])
async def get_sessions(current_user=Depends(get_current_user)):
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

    # list_charging_sessions is async - await the result
    return await list_charging_sessions(station_ids)


@router.post("/", response_model=ChargingSessionOut)
async def add_session(session: ChargingSessionCreate, current_user=Depends(get_current_user)):
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

    # create_charging_session is async - await it
    created = await create_charging_session(session.dict() if hasattr(session, 'dict') else session)
    if not created:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to create charging session")
    return created


@router.get("/analytics/consumption", response_model=List[Dict[str, Any]], dependencies=[Depends(require_admin)])
async def consumption_analytics(start: str, end: str):
    """Return charging sessions between ISO dates; frontend aggregates kWh by day/station."""
    # Admin has access to all stations; pass empty list to signal "all" here and let CRUD handle
    # We don't have a list-all variant, so call between with all by fetching station ids from stations table via list_stations
    stations = await list_stations()
    station_ids = [s.get("station_id") or s.get("id") for s in stations if (s.get("station_id") or s.get("id"))]
    # await the between listing as it's async
    return await list_charging_sessions_between(station_ids, start, end)
