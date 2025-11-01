import asyncio
from fastapi import APIRouter, Depends
from typing import List, Dict, Any
from ..dependencies import require_admin, get_current_user
from ..crud import (
    get_admin_statistics,
    get_all_users,
    get_all_station_managers,
    get_stations_with_managers,
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
)
from ..crud.profiles import get_user_profile
from ..utils.logger import log_activity

router = APIRouter(prefix="/admin", tags=["Admin Dashboard"])

# ------------------------
# ✅ Admin Dashboard Endpoints
# ------------------------

@router.get("/statistics", response_model=Dict[str, Any], dependencies=[Depends(require_admin)])
async def get_dashboard_statistics(current_user: dict = Depends(get_current_user)):
    """Get statistics for admin dashboard"""
    stats = await get_admin_statistics()

    # Log activity
    user_profile = await get_user_profile(current_user["id"])
    await log_activity(
        user_id=current_user["id"],
        user_name=user_profile.email if user_profile else "Unknown",
        role=current_user["role"],
        action="Viewed Admin Statistics",
        description="Retrieved statistics for admin dashboard"
    )

    return stats


@router.get("/stations-with-managers", response_model=List[Dict[str, Any]], dependencies=[Depends(require_admin)])
async def get_stations_with_managers_info(current_user: dict = Depends(get_current_user)):
    """Get all stations with their assigned managers"""
    stations = await get_stations_with_managers()

    # Log activity
    user_profile = await get_user_profile(current_user["id"])
    await log_activity(
        user_id=current_user["id"],
        user_name=user_profile.email if user_profile else "Unknown",
        role=current_user["role"],
        action="Viewed Stations with Managers",
        description=f"Retrieved all stations with manager assignments ({len(stations)} found)"
    )

    return stations


@router.get("/users", response_model=List[Dict[str, Any]], dependencies=[Depends(require_admin)])
async def get_all_users_admin(current_user: dict = Depends(get_current_user)):
    """Get all users for admin dashboard"""
    users = await get_all_users()

    # Log activity
    user_profile = await get_user_profile(current_user["id"])
    await log_activity(
        user_id=current_user["id"],
        user_name=user_profile.email if user_profile else "Unknown",
        role=current_user["role"],
        action="Viewed All Users",
        description=f"Retrieved all users for admin dashboard ({len(users)} found)"
    )

    return users


@router.get("/managers", response_model=List[Dict[str, Any]], dependencies=[Depends(require_admin)])
async def get_all_managers_admin(current_user: dict = Depends(get_current_user)):
    """Get all station managers for admin dashboard"""
    managers = await get_all_station_managers()

    # Log activity
    user_profile = await get_user_profile(current_user["id"])
    await log_activity(
        user_id=current_user["id"],
        user_name=user_profile.email if user_profile else "Unknown",
        role=current_user["role"],
        action="Viewed All Managers",
        description=f"Retrieved all station managers for admin dashboard ({len(managers)} found)"
    )

    return managers


# ------------------------
# ✅ Composite Dashboard Endpoint
# ------------------------

@router.get("/dashboard-data", dependencies=[Depends(require_admin)])
async def get_composite_dashboard_data(current_user: dict = Depends(get_current_user)):
    """Get all dashboard data in a single optimized call"""
    try:
        # Fetch all data simultaneously using asyncio.gather for performance
        [
            stations_managers,
            managers_stations,
            users,
            admin_stats,
            user_growth,
            energy_consumption,
            revenue_trends,
            bookings_trends,
            charging_types,
            peak_hours,
            station_util,
            active_sessions,
            avg_duration,
            co2_saved,
            recent_activity
        ] = await asyncio.gather(
            get_stations_with_managers(),
            get_all_station_managers(),
            get_all_users(),
            get_admin_statistics(),
            get_user_growth_over_time(7),  # Last 7 days for faster initial load
            get_energy_consumption_trends(7),
            get_revenue_trends(30),  # Last 30 days instead of 180 for performance
            get_bookings_trends(7),
            get_charging_type_distribution(30),
            get_peak_hours(24),
            get_station_utilization(),
            get_active_sessions_count(),
            get_average_session_duration(),
            calculate_co2_saved(),
            get_recent_activity(10)
        )

        # Return all data in a single response
        return {
            "stations": stations_managers or [],
            "managers": managers_stations or [],
            "users": users or [],
            "stats": admin_stats or {},
            "analytics": {
                "user_growth": user_growth or [],
                "energy_consumption": energy_consumption or [],
                "revenue_trends": revenue_trends or [],
                "bookings_trends": bookings_trends or [],
                "charging_types": charging_types or [],
                "peak_hours": peak_hours or [],
                "station_utilization": station_util or [],
                "active_sessions": active_sessions or {},
                "avg_session_duration": avg_duration or {},
                "co2_saved": co2_saved or {},
                "recent_activity": recent_activity or []
            }
        }
    except Exception as e:
        # Log error but return base stats to prevent dashboard failure
        print(f"Error loading dashboard data: {e}")
        return {
            "stations": [],
            "managers": [],
            "users": [],
            "stats": {"error": "Failed to load dashboard data"},
            "analytics": {
                "user_growth": [],
                "energy_consumption": [],
                "revenue_trends": [],
                "bookings_trends": [],
                "charging_types": [],
                "peak_hours": [],
                "station_utilization": [],
                "active_sessions": {"active_sessions": 0},
                "avg_session_duration": {"average_session_duration": "N/A"},
                "co2_saved": {"co2_saved": "0 kg"},
                "recent_activity": []
            }
        }
