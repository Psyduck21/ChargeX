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
    get_station_manager
)
from ..crud.profiles import get_user_profile
from ..utils.logger import log_activity

from ..models import StationCreate, StationUpdate, StationOut, ManagerOut

router = APIRouter(prefix="/stations", tags=["Stations"])

# ------------------------
# ✅ Station CRUD Endpoints
# ------------------------

@router.get("/", response_model=List[StationOut], dependencies=[Depends(get_current_user)])
async def read_stations():
    """List all stations. Admin/Managers will filter on client as needed."""
    return await list_stations()


@router.post("/", response_model=StationOut, dependencies=[Depends(require_admin)])
async def add_station(station: StationCreate, current_user: dict = Depends(get_current_user)):
    """Create a new charging station"""
    if not station.name or not station.city:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Missing name or location")

    created = await create_station(station)
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


@router.put("/{station_id}", response_model=StationOut, dependencies=[Depends(require_admin)])
async def edit_station(station_id: UUID, update: StationUpdate, current_user: dict = Depends(get_current_user)):
    """Update an existing station"""
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
        description=f"Removed station '{station_to_delete.name}'",
        station_name=station_to_delete.name
    )

    return result


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
        station_name = station['name']
        # print(f"station: {station} #################################################################################")
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


# ------------------------
# ✅ Analytics Endpoints for Charts
# ------------------------

@router.get("/admin/analytics/user-growth", response_model=List[Dict[str, Any]], dependencies=[Depends(require_admin)])
async def get_user_growth_analytics(days: int = 30):
    """Get user registration growth data for charts"""
    if days < 1 or days > 365:
        raise HTTPException(status_code=400, detail="Days must be between 1 and 365")
    return await get_user_growth_over_time(days)


@router.get("/admin/analytics/energy-consumption", response_model=List[Dict[str, Any]], dependencies=[Depends(require_admin)])
async def get_energy_consumption_analytics(days: int = 30):
    """Get energy consumption trends for charts"""
    if days < 1 or days > 365:
        raise HTTPException(status_code=400, detail="Days must be between 1 and 365")
    return await get_energy_consumption_trends(days)


@router.get("/admin/analytics/revenue", response_model=List[Dict[str, Any]], dependencies=[Depends(require_admin)])
async def get_revenue_analytics(days: int = 30):
    """Get revenue trends for charts"""
    if days < 1 or days > 365:
        raise HTTPException(status_code=400, detail="Days must be between 1 and 365")
    return await get_revenue_trends(days)


@router.get("/admin/analytics/bookings", response_model=List[Dict[str, Any]], dependencies=[Depends(require_admin)])
async def get_bookings_analytics(days: int = 30):
    """Get bookings trends for charts"""
    if days < 1 or days > 365:
        raise HTTPException(status_code=400, detail="Days must be between 1 and 365")
    return await get_bookings_trends(days)


@router.get("/admin/analytics/station-utilization", response_model=List[Dict[str, Any]], dependencies=[Depends(require_admin)])
async def get_station_utilization_analytics():
    """Get station utilization statistics"""
    return await get_station_utilization()


@router.get("/admin/analytics/charging-types", response_model=List[Dict[str, Any]], dependencies=[Depends(require_admin)])
async def get_charging_types_analytics(days: int = 30):
    """Get charging type distribution for charts"""
    if days < 1 or days > 365:
        raise HTTPException(status_code=400, detail="Days must be between 1 and 365")
    return await get_charging_type_distribution(days)


@router.get("/admin/analytics/peak-hours", response_model=List[Dict[str, Any]], dependencies=[Depends(require_admin)])
async def get_peak_hours_analytics(hours: int = 24):
    """Get hourly usage for last N hours"""
    if hours < 1 or hours > 168:
        raise HTTPException(status_code=400, detail="Hours must be between 1 and 168")
    return await get_peak_hours(hours)


@router.get("/admin/analytics/active-sessions", dependencies=[Depends(require_admin)])
async def get_active_sessions_count_api():
    """Get count of currently active charging sessions"""
    count = await get_active_sessions_count()
    return {"active_sessions": count}


@router.get("/admin/analytics/avg-session-duration", dependencies=[Depends(require_admin)])
async def get_avg_session_duration_api():
    """Get average session duration in minutes"""
    duration = await get_average_session_duration()
    return {"average_session_duration": duration}


@router.get("/admin/analytics/co2-saved", dependencies=[Depends(require_admin)])
async def get_co2_saved_api():
    """Get CO2 saved from EV charging this month"""
    co2 = await calculate_co2_saved()
    return {"co2_saved": co2}


@router.get("/admin/analytics/recent-activity", response_model=List[Dict[str, Any]], dependencies=[Depends(require_admin)])
async def get_recent_activity_api(limit: int = 10):
    """Get recent user activity for dashboard feed"""
    if limit < 1 or limit > 50:
        limit = 10
    return await get_recent_activity(limit)
