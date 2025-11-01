from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict, Any
from ..dependencies import require_admin, get_current_user
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
)
from ..crud.profiles import get_user_profile
from ..utils.logger import log_activity

router = APIRouter(prefix="/analytics", tags=["Analytics"])

# ------------------------
# ✅ Analytics Endpoints for Charts
# ------------------------

@router.get("/user-growth", response_model=List[Dict[str, Any]], dependencies=[Depends(require_admin)])
async def get_user_growth_analytics(days: int = 30, current_user: dict = Depends(get_current_user)):
    """Get user registration growth data for charts"""
    if days < 1 or days > 365:
        raise HTTPException(status_code=400, detail="Days must be between 1 and 365")
    growth = await get_user_growth_over_time(days)

    # Log activity
    user_profile = await get_user_profile(current_user["id"])
    await log_activity(
        user_id=current_user["id"],
        user_name=user_profile.email if user_profile else "Unknown",
        role=current_user["role"],
        action="Viewed User Growth Analytics",
        description=f"Retrieved user growth analytics for last {days} days"
    )

    return growth


@router.get("/energy-consumption", response_model=List[Dict[str, Any]], dependencies=[Depends(require_admin)])
async def get_energy_consumption_analytics(days: int = 30, current_user: dict = Depends(get_current_user)):
    """Get energy consumption trends for charts"""
    if days < 1 or days > 365:
        raise HTTPException(status_code=400, detail="Days must be between 1 and 365")
    consumption = await get_energy_consumption_trends(days)

    # Log activity
    user_profile = await get_user_profile(current_user["id"])
    await log_activity(
        user_id=current_user["id"],
        user_name=user_profile.email if user_profile else "Unknown",
        role=current_user["role"],
        action="Viewed Energy Consumption Analytics",
        description=f"Retrieved energy consumption trends for last {days} days"
    )

    return consumption


@router.get("/revenue", response_model=List[Dict[str, Any]], dependencies=[Depends(require_admin)])
async def get_revenue_analytics(days: int = 30, current_user: dict = Depends(get_current_user)):
    """Get revenue trends for charts"""
    if days < 1 or days > 365:
        raise HTTPException(status_code=400, detail="Days must be between 1 and 365")
    revenue = await get_revenue_trends(days)

    # Log activity
    user_profile = await get_user_profile(current_user["id"])
    await log_activity(
        user_id=current_user["id"],
        user_name=user_profile.email if user_profile else "Unknown",
        role=current_user["role"],
        action="Viewed Revenue Analytics",
        description=f"Retrieved revenue trends for last {days} days"
    )

    return revenue


@router.get("/bookings", response_model=List[Dict[str, Any]], dependencies=[Depends(require_admin)])
async def get_bookings_analytics(days: int = 30, current_user: dict = Depends(get_current_user)):
    """Get bookings trends for charts"""
    if days < 1 or days > 365:
        raise HTTPException(status_code=400, detail="Days must be between 1 and 365")
    bookings = await get_bookings_trends(days)

    # Log activity
    user_profile = await get_user_profile(current_user["id"])
    await log_activity(
        user_id=current_user["id"],
        user_name=user_profile.email if user_profile else "Unknown",
        role=current_user["role"],
        action="Viewed Bookings Analytics",
        description=f"Retrieved booking trends for last {days} days"
    )

    return bookings


@router.get("/station-utilization", response_model=List[Dict[str, Any]], dependencies=[Depends(require_admin)])
async def get_station_utilization_analytics(current_user: dict = Depends(get_current_user)):
    """Get station utilization statistics"""
    utilization = await get_station_utilization()

    # Log activity
    user_profile = await get_user_profile(current_user["id"])
    await log_activity(
        user_id=current_user["id"],
        user_name=user_profile.email if user_profile else "Unknown",
        role=current_user["role"],
        action="Viewed Station Utilization Analytics",
        description="Retrieved station utilization statistics"
    )

    return utilization


@router.get("/charging-types", response_model=List[Dict[str, Any]], dependencies=[Depends(require_admin)])
async def get_charging_types_analytics(days: int = 30, current_user: dict = Depends(get_current_user)):
    """Get charging type distribution for charts"""
    if days < 1 or days > 365:
        raise HTTPException(status_code=400, detail="Days must be between 1 and 365")
    types = await get_charging_type_distribution(days)

    # Log activity
    user_profile = await get_user_profile(current_user["id"])
    await log_activity(
        user_id=current_user["id"],
        user_name=user_profile.email if user_profile else "Unknown",
        role=current_user["role"],
        action="Viewed Charging Types Analytics",
        description=f"Retrieved charging type distribution for last {days} days"
    )

    return types


@router.get("/peak-hours", response_model=List[Dict[str, Any]], dependencies=[Depends(require_admin)])
async def get_peak_hours_analytics(hours: int = 24, current_user: dict = Depends(get_current_user)):
    """Get hourly usage for last N hours"""
    if hours < 1 or hours > 168:
        raise HTTPException(status_code=400, detail="Hours must be between 1 and 168")
    peak_hours = await get_peak_hours(hours)

    # Log activity
    user_profile = await get_user_profile(current_user["id"])
    await log_activity(
        user_id=current_user["id"],
        user_name=user_profile.email if user_profile else "Unknown",
        role=current_user["role"],
        action="Viewed Peak Hours Analytics",
        description=f"Retrieved peak hours analytics for last {hours} hours"
    )

    return peak_hours


@router.get("/active-sessions", dependencies=[Depends(require_admin)])
async def get_active_sessions_count_api(current_user: dict = Depends(get_current_user)):
    """Get count of currently active charging sessions"""
    count = await get_active_sessions_count()

    # Log activity
    user_profile = await get_user_profile(current_user["id"])
    await log_activity(
        user_id=current_user["id"],
        user_name=user_profile.email if user_profile else "Unknown",
        role=current_user["role"],
        action="Viewed Active Sessions Count",
        description="Retrieved count of currently active charging sessions"
    )

    return {"active_sessions": count}


@router.get("/avg-session-duration", dependencies=[Depends(require_admin)])
async def get_avg_session_duration_api(current_user: dict = Depends(get_current_user)):
    """Get average session duration in minutes"""
    duration = await get_average_session_duration()

    # Log activity
    user_profile = await get_user_profile(current_user["id"])
    await log_activity(
        user_id=current_user["id"],
        user_name=user_profile.email if user_profile else "Unknown",
        role=current_user["role"],
        action="Viewed Average Session Duration",
        description="Retrieved average session duration"
    )

    return {"average_session_duration": duration}


@router.get("/co2-saved", dependencies=[Depends(require_admin)])
async def get_co2_saved_api(current_user: dict = Depends(get_current_user)):
    """Get CO2 saved from EV charging this month"""
    co2 = await calculate_co2_saved()

    # Log activity
    user_profile = await get_user_profile(current_user["id"])
    await log_activity(
        user_id=current_user["id"],
        user_name=user_profile.email if user_profile else "Unknown",
        role=current_user["role"],
        action="Viewed CO2 Saved Analytics",
        description="Retrieved CO2 saved from EV charging this month"
    )

    return {"co2_saved": co2}


@router.get("/recent-activity", response_model=List[Dict[str, Any]], dependencies=[Depends(require_admin)])
async def get_recent_activity_api(limit: int = 10, current_user: dict = Depends(get_current_user)):
    """Get recent user activity for dashboard feed"""
    if limit < 1 or limit > 50:
        limit = 10
    activity = await get_recent_activity(limit)

    # Log activity
    user_profile = await get_user_profile(current_user["id"])
    await log_activity(
        user_id=current_user["id"],
        user_name=user_profile.email if user_profile else "Unknown",
        role=current_user["role"],
        action="Viewed Recent Activity",
        description=f"Retrieved recent user activity ({len(activity)} items)"
    )

    return activity


@router.get("/co2-saved", dependencies=[Depends(require_admin)])
async def get_co2_saved_api(current_user: dict = Depends(get_current_user)):
    """Get CO2 saved from EV charging this month"""
    co2 = await calculate_co2_saved()

    # Log activity
    user_profile = await get_user_profile(current_user["id"])
    await log_activity(
        user_id=current_user["id"],
        user_name=user_profile.email if user_profile else "Unknown",
        role=current_user["role"],
        action="Viewed CO2 Saved Analytics",
        description="Retrieved CO2 saved from EV charging this month"
    )

    return {"co2_saved": co2}
