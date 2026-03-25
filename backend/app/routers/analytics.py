from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict, Any
from ..dependencies import require_admin_or_manager, get_current_user
from ..crud import (
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
    get_user_statistics,
)


router = APIRouter(prefix="/analytics", tags=["Analytics"])

# ------------------------
# ✅ Analytics Endpoints for Charts
# ------------------------

@router.get("/user-growth", response_model=List[Dict[str, Any]], dependencies=[Depends(require_admin_or_manager)])
async def get_user_growth_analytics(days: int = 30, current_user: dict = Depends(get_current_user)):
    """Get user registration growth data for charts"""
    if days < 1 or days > 365:
        raise HTTPException(status_code=400, detail="Days must be between 1 and 365")
    growth = await get_user_growth_over_time(days)

    return growth


@router.get("/energy-consumption", response_model=List[Dict[str, Any]], dependencies=[Depends(require_admin_or_manager)])
async def get_energy_consumption_analytics(days: int = 30, station_id: str = None, current_user: dict = Depends(get_current_user)):
    """Get energy consumption trends for charts"""
    if days < 1 or days > 365:
        raise HTTPException(status_code=400, detail="Days must be between 1 and 365")

    # For station managers, validate access to requested station
    if current_user.get("role") == "station_manager":
        manager_station_ids = current_user.get("station_ids", [])
        if station_id:
            if station_id not in manager_station_ids:
                raise HTTPException(status_code=403, detail="Access denied to this station")
            station_ids = [station_id]
        else:
            station_ids = manager_station_ids
    else:
        # Admins can filter by specific station or see all
        station_ids = [station_id] if station_id else None

    consumption = await get_energy_consumption_trends(days, station_ids)

    return consumption


@router.get("/revenue", response_model=List[Dict[str, Any]], dependencies=[Depends(require_admin_or_manager)])
async def get_revenue_analytics(days: int = 30, station_id: str = None, current_user: dict = Depends(get_current_user)):
    """Get revenue trends for charts"""
    if days < 1 or days > 365:
        raise HTTPException(status_code=400, detail="Days must be between 1 and 365")

    # For station managers, validate access to requested station
    if current_user.get("role") == "station_manager":
        manager_station_ids = current_user.get("station_ids", [])
        if station_id:
            if station_id not in manager_station_ids:
                raise HTTPException(status_code=403, detail="Access denied to this station")
            station_ids = [station_id]
        else:
            station_ids = manager_station_ids
    else:
        # Admins can filter by specific station or see all
        station_ids = [station_id] if station_id else None

    revenue = await get_revenue_trends(days, station_ids)

    return revenue


@router.get("/bookings", response_model=List[Dict[str, Any]], dependencies=[Depends(require_admin_or_manager)])
async def get_bookings_analytics(days: int = 30, current_user: dict = Depends(get_current_user)):
    """Get bookings trends for charts"""
    if days < 1 or days > 365:
        raise HTTPException(status_code=400, detail="Days must be between 1 and 365")
    bookings = await get_bookings_trends(days)

    return bookings


@router.get("/station-utilization", response_model=List[Dict[str, Any]], dependencies=[Depends(require_admin_or_manager)])
async def get_station_utilization_analytics(current_user: dict = Depends(get_current_user)):
    """Get station utilization statistics"""
    utilization = await get_station_utilization()

    return utilization


@router.get("/charging-types", response_model=List[Dict[str, Any]], dependencies=[Depends(require_admin_or_manager)])
async def get_charging_types_analytics(days: int = 30, station_id: str = None, current_user: dict = Depends(get_current_user)):
    """Get charging type distribution for charts"""
    if days < 1 or days > 365:
        raise HTTPException(status_code=400, detail="Days must be between 1 and 365")

    # For station managers, validate access to requested station
    if current_user.get("role") == "station_manager":
        manager_station_ids = current_user.get("station_ids", [])
        if station_id:
            if station_id not in manager_station_ids:
                raise HTTPException(status_code=403, detail="Access denied to this station")
            station_ids = [station_id]
        else:
            station_ids = manager_station_ids
    else:
        # Admins can filter by specific station or see all
        station_ids = [station_id] if station_id else None

    types = await get_charging_type_distribution(days, station_ids)

    return types


@router.get("/peak-hours", response_model=List[Dict[str, Any]], dependencies=[Depends(require_admin_or_manager)])
async def get_peak_hours_analytics(hours: int = 24, current_user: dict = Depends(get_current_user)):
    """Get hourly usage for last N hours"""
    if hours < 1 or hours > 168:
        raise HTTPException(status_code=400, detail="Hours must be between 1 and 168")
    peak_hours = await get_peak_hours(hours)

    return peak_hours


@router.get("/active-sessions", dependencies=[Depends(require_admin_or_manager)])
async def get_active_sessions_count_api(current_user: dict = Depends(get_current_user)):
    """Get count of currently active charging sessions"""
    count = await get_active_sessions_count()

    return {"active_sessions": count}


@router.get("/avg-session-duration", dependencies=[Depends(require_admin_or_manager)])
async def get_avg_session_duration_api(current_user: dict = Depends(get_current_user)):
    """Get average session duration in minutes"""
    duration = await get_average_session_duration()

    return {"average_session_duration": duration}


@router.get("/co2-saved", dependencies=[Depends(require_admin_or_manager)])
async def get_co2_saved_api(current_user: dict = Depends(get_current_user)):
    """Get CO2 saved from EV charging this month"""
    co2 = await calculate_co2_saved()

    return {"co2_saved": co2}


@router.get("/user-statistics")
async def get_user_statistics_api(current_user: dict = Depends(get_current_user)):
    """Get statistics for the current user (total bookings, energy used, total spent, CO2 saved)"""
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(status_code=401, detail="User not authenticated")

    statistics = await get_user_statistics(user_id)
    return statistics


@router.get("/recent-activity", response_model=List[Dict[str, Any]], dependencies=[Depends(require_admin_or_manager)])
async def get_recent_activity_api(limit: int = 10, current_user: dict = Depends(get_current_user)):
    """Get recent user activity for dashboard feed"""
    if limit < 1 or limit > 50:
        limit = 10
    activity = await get_recent_activity(limit)

    return activity


@router.get("/co2-saved", dependencies=[Depends(require_admin_or_manager)])
async def get_co2_saved_api(current_user: dict = Depends(get_current_user)):
    """Get CO2 saved from EV charging this month"""
    co2 = await calculate_co2_saved()

    return {"co2_saved": co2}
