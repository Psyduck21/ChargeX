from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any
from uuid import UUID

from ..dependencies import require_admin, get_current_user
from ..crud import (
    create_station,
    update_station,
    delete_station,
    assign_manager_to_station,
    get_admin_statistics,
    get_all_users,
    get_all_station_managers,
    get_stations_with_managers,
    list_stations,
    list_managers_for_station,
    get_user_growth_over_time,
    get_energy_consumption_trends,
    get_revenue_trends,
    get_bookings_trends,
    get_station_utilization,
    get_charging_type_distribution,
    get_peak_hours,
    get_active_sessions_count,
    get_average_session_duration,
    calculate_co2_saved,
    get_recent_activity,
    get_station,
    get_station_manager,
    get_manager_stations
)
from ..crud.profiles import get_user_profile
from ..utils.logger import log_activity

from ..models import StationCreate, StationUpdate, StationOut, ManagerOut

router = APIRouter(prefix="/stations", tags=["Stations"])

# ------------------------
# ✅ Station CRUD Endpoints
# ------------------------

@router.get("/", response_model=List[StationOut], dependencies=[Depends(get_current_user)])
async def read_stations(current_user: dict = Depends(get_current_user)):
    """List all stations. Admin sees all, managers see only their assigned stations, users can view all stations."""
    if current_user.get("role") == "admin":
        # Admin sees all stations
        return await list_stations()
    elif current_user.get("role") == "station_manager":
        # Manager sees only stations assigned to them
        return await get_manager_stations(current_user["id"])
    elif current_user.get("role") == "app_user":
        # Regular users can view all stations for booking purposes
        return await list_stations()
    else:
        raise HTTPException(status_code=403, detail="Insufficient permissions")


@router.post("/", response_model=StationOut, dependencies=[Depends(require_admin)])
async def add_station(station: StationCreate, current_user: dict = Depends(get_current_user)):
    """Create a new charging station"""
    if not station.name or not station.city:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Missing name or location")

    created = await create_station(station.dict())
    if not created:
        raise HTTPException(status_code=500, detail="Failed to create station")

    # Log activity
    user_profile = await get_user_profile(current_user["id"])
    await log_activity(
        user_id=current_user["id"],
        user_name=user_profile.email if user_profile else "Unknown",
        role=current_user["role"],
        action="Created Station",
        description=f"Added new station '{station.name}'",
        station_name=station.name
    )

    return created


@router.put("/{station_id}", response_model=StationOut, dependencies=[Depends(get_current_user)])
async def edit_station(station_id: UUID, update: StationUpdate, current_user: dict = Depends(get_current_user)):
    """Update an existing station. Admin can update any station, managers can only update their assigned stations."""
    # Check permissions
    if current_user.get("role") == "admin":
        # Admin can update any station
        pass
    elif current_user.get("role") == "station_manager":
        # Manager can only update stations assigned to them
        current_station = await get_station(station_id)
        if not current_station:
            raise HTTPException(status_code=404, detail="Station not found")
        if str(current_station.get("station_manager")) != current_user["id"]:
            raise HTTPException(status_code=403, detail="Can only update stations assigned to you")
    else:
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    update_dict = update.dict(exclude_unset=True)

    current_station = await get_station(station_id)
    if not current_station:
        raise HTTPException(status_code=404, detail="Station not found")

    updated = await update_station(station_id, update_dict)

    if not updated:
        raise HTTPException(status_code=404, detail="Station not found")

    # Log activity
    user_profile = await get_user_profile(current_user["id"])
    await log_activity(
        user_id=current_user["id"],
        user_name=user_profile.email if user_profile else "Unknown",
        role=current_user["role"],
        action="Updated Station",
        description=f"Modified station '{current_station['name']}'",
        station_name=current_station['name']
    )

    # Supabase returns a list, so return the first item
    return updated[0]


@router.delete("/{station_id}", dependencies=[Depends(require_admin)])
async def remove_station(station_id: UUID, current_user: dict = Depends(get_current_user)):
    """Delete a station"""
    print(f"Deleting station {station_id}...")

    station_to_delete = await get_station(station_id)
    if not station_to_delete:
        raise HTTPException(status_code=404, detail="Station not found")

    result = await delete_station(station_id)

    # Log activity after successful deletion
    user_profile = await get_user_profile(current_user["id"])
    await log_activity(
        user_id=current_user["id"],
        user_name=user_profile.email if user_profile else "Unknown",
        role=current_user["role"],
        action="Deleted Station",
        description=f"Removed station '{station_to_delete['name']}'",
        station_name=station_to_delete['name']
    )

    return result


# ------------------------
# ✅ Nearby Stations
# ------------------------

@router.get("/{station_id}/nearby", response_model=List[StationOut], dependencies=[Depends(get_current_user)])
async def get_nearby_stations(station_id: UUID, limit: int = 5, sort_by: str = "distance"):
    """Get nearby stations with available slots, sorted by distance or power (for low battery)"""
    from ..crud.station import find_nearby_stations
    
    try:
        nearby = await find_nearby_stations(str(station_id), limit=limit, sort_by=sort_by)
        return nearby
    except Exception as e:
        print(f"Error fetching nearby stations: {e}")
        raise HTTPException(status_code=400, detail="Failed to fetch nearby stations")


# ------------------------
# ✅ Station Manager Handling
# ------------------------

@router.get("/{station_id}/managers", response_model=List[ManagerOut], dependencies=[Depends(require_admin)])
async def get_station_managers(station_id: UUID):
    """List all managers for a specific station"""
    return await list_managers_for_station(station_id)


@router.post("/{station_id}/assign_manager", response_model=StationOut, dependencies=[Depends(require_admin)])
async def assign_manager(station_id: UUID, body: Dict[str, Any], current_user: dict = Depends(get_current_user)):
    """Assign or unassign a manager to/from a station"""
    manager_user_id = body.get("user_id")

    # Allow empty/null user_id for unassignment
    if manager_user_id:
        # Assign manager
        result = await assign_manager_to_station(UUID(str(manager_user_id)), station_id)
        manager = await get_station_manager(UUID(str(manager_user_id)))
        station = await get_station(station_id)
        station_name = station['name'] if station else "Unknown"
        print(f"station: {station} #################################################################################")
        manager_name = manager['name'] if manager else "Unknown"
        # Log activity
        user_profile = await get_user_profile(current_user["id"])
        await log_activity(
            user_id=current_user["id"],
            user_name=user_profile.email if user_profile else "Unknown",
            role=current_user["role"],
            action="Assigned Manager to Station",
            description=f"Assigned manager {manager_name} to station {station_name}",
            station_name=station_name
        )

        return result
    else:
        # Unassign manager (set station_manager to None)
        from ..database import get_supabase_client
        supabase = await get_supabase_client()
        response = supabase.table("stations").update({"station_manager": None}).eq("id", str(station_id)).execute()

        if response.data:
            # Log activity
            user_profile = await get_user_profile(current_user["id"])
            station = await get_station(station_id)
            station_name = station['name'] if station else "Unknown"
            await log_activity(
                user_id=current_user["id"],
                user_name=user_profile.email if user_profile else "Unknown",
                role=current_user["role"],
                action="Unassigned Manager from Station",
                description=f"Unassigned manager from station {station_name}",
                station_name=station_name
            )

            return response.data[0]
        else:
            raise HTTPException(status_code=404, detail="Station not found")


# ------------------------
# ✅ Admin Dashboard Endpoints
# ------------------------

@router.get("/admin/statistics", response_model=Dict[str, Any], dependencies=[Depends(require_admin)])
async def get_dashboard_statistics():
    """Get statistics for admin dashboard"""
    return await get_admin_statistics()


@router.get("/admin/stations-with-managers", response_model=List[Dict[str, Any]], dependencies=[Depends(require_admin)])
async def get_stations_with_managers_info():
    """Get all stations with their assigned managers"""
    return await get_stations_with_managers()


@router.get("/admin/users", response_model=List[Dict[str, Any]], dependencies=[Depends(require_admin)])
async def get_all_users_admin():
    """Get all users for admin dashboard"""
    return await get_all_users()


@router.get("/admin/managers", response_model=List[Dict[str, Any]], dependencies=[Depends(require_admin)])
async def get_all_managers_admin():
    """Get all station managers for admin dashboard"""
    return await get_all_station_managers()



