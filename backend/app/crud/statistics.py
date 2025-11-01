from typing import Any, Dict, List, Optional
from uuid import UUID
import httpx
from datetime import datetime, timedelta, timezone
from ..database import get_supabase_client, get_supabase_service_role_client


async def get_admin_statistics() -> Dict[str, Any]:

    """Get overall statistics for admin dashboard"""
    try:
        supabase_service_role = await get_supabase_service_role_client()
        total_users = supabase_service_role.table("profiles").select("id", count="exact").execute().count or 0
        total_stations = supabase_service_role.table("stations").select("id", count="exact").execute().count or 0
        total_managers = supabase_service_role.table("station_managers").select("id", count="exact").execute().count or 0
        total_bookings = supabase_service_role.table("bookings").select("id", count="exact").execute().count or 0
        total_sessions = supabase_service_role.table("charging_sessions").select("id", count="exact").execute().count or 0
        return {
            "total_users": total_users,
            "total_stations": total_stations,
            "total_managers": total_managers,
            "total_bookings": total_bookings,
            "total_sessions": total_sessions
        }
    except httpx.HTTPError as e:
        print(f"Error fetching admin statistics: {e}")
        return {
            "total_users": 0,
            "total_stations": 0,
            "total_managers": 0,
            "total_bookings": 0,
            "total_sessions": 0
        }

async def list_user_vehicles(owner_id: UUID) -> List[Dict[str, Any]]:
    supabase = await get_supabase_client()
    response =  supabase.table("vehicles").select("*").eq("owner_id", str(owner_id)).execute()
    return response.data or []

async def list_stations() -> List[Dict[str, Any]]:
    supabase = await get_supabase_client()
    response =  supabase.table("stations").select("*").execute()
    return response.data or []

# list_stations must exist
async def list_stations() -> list[dict]:
    supabase = await get_supabase_client()
    response =  supabase.table("stations").select("*").execute()
    return response.data or []

# list_managers_for_station must exist
async def list_managers_for_station(manager_id: UUID) -> list[dict]:
    supabase = await get_supabase_client()
    response = (
         supabase.table("station_managers")
        .select("*")
        .eq("id", str(manager_id))
        .execute()
    )
    return response.data or []

# Now define get_stations_with_managers
async def get_stations_with_managers() -> list[dict]:
    stations = await list_stations()
    result = []
    for station in stations:
        station_data = dict(station)  # Create a copy to modify
        station_id = station_data.get("id")
        manager_id = station_data.get("station_manager")
        if manager_id:
            managers = await list_managers_for_station(manager_id)
            print("Managers for station", station_id, ":", managers)
            station_data["managers"] = managers
        else:
            station_data["managers"] = []
        result.append(station_data)
    return result


async def get_user_growth_over_time(days: int = 30) -> List[Dict[str, Any]]:
    """Get user registration growth over the last N days"""
    try:
        supabase = await get_supabase_client()

        # Calculate date range
        end_date = datetime.now(timezone.utc)
        start_date = end_date - timedelta(days=days)

        response =  supabase.table("profiles").select("created_at").gte("created_at", start_date.isoformat()).execute()

        if not response.data:
            return []

        # Group by date
        date_counts = {}
        for profile in response.data:
            created_at = profile.get("created_at")
            if created_at:
                # Extract date part (YYYY-MM-DD)
                date_part = created_at.split("T")[0]
                date_counts[date_part] = date_counts.get(date_part, 0) + 1

        # Fill in missing dates with 0
        result = []
        current_date = start_date.date()
        end_date_only = end_date.date()

        while current_date <= end_date_only:
            date_str = current_date.isoformat()
            result.append({
                "date": date_str,
                "users": date_counts.get(date_str, 0)
            })
            current_date += timedelta(days=1)

        return result

    except Exception as e:
        print(f"Error getting user growth data: {e}")
        return []


async def get_energy_consumption_trends(days: int = 30) -> List[Dict[str, Any]]:
    """Get energy consumption trends over the last N days"""
    try:
        supabase = await get_supabase_client()

        # Calculate date range
        end_date = datetime.now(timezone.utc)
        start_date = end_date - timedelta(days=days)

        response =  supabase.table("charging_sessions").select("start_time, energy_consumed").gte("start_time", start_date.isoformat()).execute()

        if not response.data:
            return []

        # Group by date
        date_energy = {}
        for session in response.data:
            started_at = session.get("start_time")
            energy = session.get("energy_consumed", 0)
            if started_at and energy:
                # Extract date part (YYYY-MM-DD)
                date_part = started_at.split("T")[0]
                date_energy[date_part] = date_energy.get(date_part, 0) + float(energy)

        # Fill in missing dates with 0
        result = []
        current_date = start_date.date()
        end_date_only = end_date.date()

        while current_date <= end_date_only:
            date_str = current_date.isoformat()
            result.append({
                "date": date_str,
                "energy_kwh": round(date_energy.get(date_str, 0), 2)
            })
            current_date += timedelta(days=1)

        return result

    except Exception as e:
        print(f"Error getting energy consumption data: {e}")
        return []


async def get_revenue_trends(days: int = 30) -> List[Dict[str, Any]]:
    """Get revenue trends over the last N days"""
    try:
        supabase = await get_supabase_client()

        # Calculate date range
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=days)

        response =  supabase.table("charging_sessions").select("start_time, cost").gte("start_time", start_date.isoformat()).execute()

        if not response.data:
            return []

        # Group by date
        date_revenue = {}
        for session in response.data:
            started_at = session.get("start_time")
            cost = session.get("cost", 0)
            if started_at and cost:
                # Extract date part (YYYY-MM-DD)
                date_part = started_at.split("T")[0]
                date_revenue[date_part] = date_revenue.get(date_part, 0) + float(cost)

        # Fill in missing dates with 0
        result = []
        current_date = start_date.date()
        end_date_only = end_date.date()

        while current_date <= end_date_only:
            date_str = current_date.isoformat()
            result.append({
                "date": date_str,
                "revenue": round(date_revenue.get(date_str, 0), 2)
            })
            current_date += timedelta(days=1)

        return result

    except Exception as e:
        print(f"Error getting revenue data: {e}")
        return []


async def get_bookings_trends(days: int = 30) -> List[Dict[str, Any]]:
    """Get booking trends over the last N days"""
    try:
        supabase = await get_supabase_client()

        # Calculate date range
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=days)

        response =  supabase.table("bookings").select("created_at").gte("created_at", start_date.isoformat()).execute()

        if not response.data:
            return []

        # Group by date
        date_counts = {}
        for booking in response.data:
            created_at = booking.get("created_at")
            if created_at:
                # Extract date part (YYYY-MM-DD)
                date_part = created_at.split("T")[0]
                date_counts[date_part] = date_counts.get(date_part, 0) + 1

        # Fill in missing dates with 0
        result = []
        current_date = start_date.date()
        end_date_only = end_date.date()

        while current_date <= end_date_only:
            date_str = current_date.isoformat()
            result.append({
                "date": date_str,
                "bookings": date_counts.get(date_str, 0)
            })
            current_date += timedelta(days=1)

        return result

    except Exception as e:
        print(f"Error getting bookings data: {e}")
        return []


async def get_station_utilization() -> List[Dict[str, Any]]:
    """Get station utilization statistics"""
    try:
        supabase = await get_supabase_client()

        # Get all sessions per station
        sessions_response =  supabase.table("charging_sessions").select("station_id, energy_consumed, cost").execute()

        if not sessions_response.data:
            return []

        # Aggregate by station
        station_stats = {}
        for session in sessions_response.data:
            station_id = session.get("station_id")
            if station_id:
                if station_id not in station_stats:
                    station_stats[station_id] = {
                        "sessions": 0,
                        "total_energy": 0,
                        "total_revenue": 0
                    }
                station_stats[station_id]["sessions"] += 1
                station_stats[station_id]["total_energy"] += float(session.get("energy_consumed", 0))
                station_stats[station_id]["total_revenue"] += float(session.get("cost", 0))

        # Get station names
        stations_response =  supabase.table("stations").select("id, name").execute()
        station_names = {str(s["id"]): s["name"] for s in (stations_response.data or [])}

        # Format results
        result = []
        for station_id, stats in station_stats.items():
            result.append({
                "station_id": station_id,
                "station_name": station_names.get(station_id, "Unknown"),
                "total_sessions": stats["sessions"],
                "total_energy_kwh": round(stats["total_energy"], 2),
                "total_revenue": round(stats["total_revenue"], 2),
                "avg_energy_per_session": round(stats["total_energy"] / stats["sessions"], 2) if stats["sessions"] > 0 else 0
            })

        # Sort by total revenue (highest first)
        result.sort(key=lambda x: x["total_revenue"], reverse=True)
        return result

    except Exception as e:
        print(f"Error getting station utilization data: {e}")
        return []


async def get_charging_type_distribution(days: int = 30) -> List[Dict[str, Any]]:
    """Return distribution of charging types (fast/normal/slow) over the last N days."""
    try:
        supabase = await get_supabase_client()
        end_date = datetime.now(timezone.utc)
        start_date = end_date - timedelta(days=days)

        # Select slot (which is slot_id) from charging_sessions
        response = supabase.table("charging_sessions").select("slot").gte("start_time", start_date.isoformat()).execute()
        if not response.data:
            return []

        counts = {}
        for s in response.data:
            slot_id = s.get("slot")
            if slot_id:
                slot_response = supabase.table("slots").select("charger_type").eq("id", str(slot_id)).single().execute()
                if slot_response.data:
                    ctype = slot_response.data.get("charger_type") or "Unknown"
                    counts[ctype] = counts.get(ctype, 0) + 1

        result = []
        for name, value in counts.items():
            result.append({"name": name, "value": value})
        return result
    except Exception as e:
        print(f"Error getting charging type distribution: {e}")
        return []


async def get_peak_hours(hours: int = 24) -> List[Dict[str, Any]]:
    """Return usage count per hour for the last `hours` hours."""
    try:
        supabase = await get_supabase_client()
        end_dt = datetime.utcnow()
        start_dt = end_dt - timedelta(hours=hours)

        response = supabase.table("charging_sessions").select("start_time").gte("start_time", start_dt.isoformat()).execute()
        if not response.data:
            return []

        counts = {f"{h:02}": 0 for h in range(24)}
        for s in response.data:
            started = s.get("start_time")
            if not started:
                continue
            try:
                hour = int(started.split('T')[1].split(':')[0])
                counts[f"{hour:02}"] = counts.get(f"{hour:02}", 0) + 1
            except Exception:
                continue

        result = [{"hour": k, "usage": v} for k, v in counts.items()]
        return result
    except Exception as e:
        print(f"Error getting peak hours: {e}")
        return []


# First, ensure this exists
async def list_profiles() -> list[dict]:
    # Fetch all admin and manager IDs
    supabase = await get_supabase_client()
    admins =  supabase.table("admins").select("id").execute()
    managers =  supabase.table("station_managers").select("id").execute()

    admin_ids = [a.get("id") for a in admins.data or []]
    manager_ids = [m.get("id") for m in managers.data or []]

    # Combine all IDs to exclude
    exclude_ids = admin_ids + manager_ids

    # If there are no IDs to exclude, just return all profiles
    if not exclude_ids:
        response =  supabase.table("profiles").select("*").execute()
        return response.data or []

    # Otherwise, use 'not.in' filter to exclude them
    response = (
        supabase.table("profiles")
        .select("*")
        .not_.in_("id", exclude_ids)
        .execute()
    )

    return response.data or []


# Now define get_all_users
async def get_all_users() -> list[dict]:
    """Get all users (profiles)"""
    return await list_profiles()


async def list_station_managers() -> List[Dict[str, Any]]:
    try:
        supabase = await get_supabase_client()
        response =  supabase.table("station_managers").select("*").execute()
        return response.data or []
    except httpx.HTTPError as e:
        print(f"Error listing station managers: {e}")
        return []


async def list_managers_for_station(station_id: UUID) -> List[Dict[str, Any]]:
    try:
        # FIX: Previously eq("id", station_id) — should filter by station_id column, not id
        supabase = await get_supabase_client()
        response = supabase.table("stations").select("station_manager").eq("id", str(station_id)).maybe_single().execute()
        # response = supabase.table("station_managers").select("*").eq("station_id", str(station_id)).execute()
        if not response or not response.data:
            return []
        return response.data
    except httpx.HTTPError as e:
        print(f"Error listing managers for station {station_id}: {e}")
        return []


async def get_stations_with_managers() -> list[dict]:
    """Get all stations with their assigned managers."""
    supabase = await get_supabase_client()

    # Get all stations
    stations_response =  supabase.table("stations").select("*").execute()
    stations = stations_response.data or []

    # Get all managers  
    managers_response =  supabase.table("station_managers").select("*").execute()
    managers = {m["id"]: m for m in (managers_response.data or [])}

    # Add managers to each station
    result = []
    for station in stations:
        station_data = dict(station)
        # Rename 'id' field to 'station_id' for frontend consistency
        station_data["station_id"] = station_data.pop("id")
        manager_id = station_data.get("station_manager")
        if manager_id and manager_id in managers:
            station_data["managers"] = [managers[manager_id]]
        else:
            station_data["managers"] = []
        result.append(station_data)

    return result


async def get_all_station_managers() -> list[dict]:
    """Get all station managers with all their assigned stations (if any)."""
    supabase = await get_supabase_client()
    # Prefer the DB-side aggregated view/materialized view if present for performance
    try:
        # Try materialized view first
        mv_resp = supabase.table("managers_with_stations_v").select("*").execute()
        if getattr(mv_resp, "data", None):
            return mv_resp.data or []
    except Exception:
        # ignore and fall back
        pass

    try:
        view_resp = supabase.table("managers_with_stations").select("*").execute()
        if getattr(view_resp, "data", None):
            return view_resp.data or []
    except Exception:
        # ignore and fall back to manual aggregation
        pass

    # Fallback: fetch all managers and stations and build mapping in app
    managers_response = supabase.table("station_managers").select("*").execute()
    managers = managers_response.data or []

    stations_response = supabase.table("stations").select("*").execute()
    stations = stations_response.data or []

    # Build mapping: manager_id → list of stations
    manager_to_stations = {}
    for station in stations:
        manager_id = station.get("station_manager")
        if manager_id:
            manager_to_stations.setdefault(manager_id, []).append(station)

    # Attach station list to each manager
    result = []
    for manager in managers:
        manager_data = dict(manager)
        manager_id = manager_data.get("id")
        manager_data["stations"] = manager_to_stations.get(manager_id, [])
        result.append(manager_data)

    return result


async def get_active_sessions_count() -> int:
    """Get count of currently active charging sessions."""
    try:
        supabase = await get_supabase_client()
        response = supabase.table("charging_sessions").select("id").is_("end_time", None).execute()
        return len(response.data) if response.data else 0
    except Exception as e:
        print(f"Error getting active sessions count: {e}")
        return 0


async def get_average_session_duration() -> str:
    """Get average session duration in minutes (formatted string)."""
    try:
        supabase = await get_supabase_client()

        # Get completed sessions with start and end times
        response = supabase.table("charging_sessions").select("start_time, end_time").not_.is_("end_time", None).execute()

        if not response.data or len(response.data) == 0:
            return "N/A"

        total_duration_minutes = 0
        count = 0

        for session in response.data:
            start_time = session.get("start_time")
            end_time = session.get("end_time")

            if start_time and end_time:
                try:
                    start_dt = datetime.fromisoformat(start_time.replace('Z', '+00:00'))
                    end_dt = datetime.fromisoformat(end_time.replace('Z', '+00:00'))
                    duration = (end_dt - start_dt).total_seconds() / 60  # in minutes
                    total_duration_minutes += duration
                    count += 1
                except Exception:
                    continue

        if count == 0:
            return "N/A"

        avg_minutes = total_duration_minutes / count
        return f"{int(avg_minutes)} min"

    except Exception as e:
        print(f"Error calculating average session duration: {e}")
        return "N/A"


async def calculate_co2_saved() -> str:
    """Calculate CO2 saved based on energy consumed this month."""
    try:
        supabase = await get_supabase_client()

        # CO2 emissions factor: Average EV charging saves about 0.16-0.41 kg CO2 per kWh
        # Using 0.25 kg CO2 saved per kWh as a conservative estimate
        CO2_PER_KWH = 0.25

        # Get total energy consumed from completed sessions this month
        now = datetime.now(timezone.utc)
        start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

        response = supabase.table("charging_sessions").select("energy_consumed").gte("start_time", start_of_month.isoformat()).not_.is_("end_time", None).execute()

        if not response.data:
            return "0 kg"

        total_energy = sum(float(session.get("energy_consumed", 0)) for session in response.data if session.get("energy_consumed"))

        co2_saved_kg = total_energy * CO2_PER_KWH

        if co2_saved_kg >= 1000:  # Convert to tons if >= 1 ton
            return f"{(co2_saved_kg / 1000):.1f} t"
        elif co2_saved_kg >= 1:   # Show kg if >= 1 kg
            return f"{int(co2_saved_kg)} kg"
        else:  # Show grams for small amounts
            return f"{int(co2_saved_kg * 1000)} g"

    except Exception as e:
        print(f"Error calculating CO2 saved: {e}")
        return "0 kg"


async def log_user_activity(user_id: UUID, action: str, details: str = "", related_id: str = None, station_name: str = None) -> Optional[Dict[str, Any]]:
    """Log user activity for recent activity feed."""
    try:
        supabase = await get_supabase_client()

        # Get user name from profiles table
        profile_response = supabase.table("profiles").select("name").eq("id", str(user_id)).single().execute()
        user_name = profile_response.data.get("name", "Unknown User") if profile_response.data else "Unknown User"

        activity_data = {
            "user_id": str(user_id),
            "user_name": user_name,
            "action": action,
            "details": details,
            "related_id": related_id,
            "station_name": station_name,
            "created_at": datetime.now(timezone.utc).isoformat()
        }

        response = supabase.table("user_activity_log").insert(activity_data).execute()

        if response.data:
            return response.data[0]

    except Exception as e:
        print(f"Error logging user activity: {e}")

    return None


async def get_recent_activity(limit: int = 10) -> List[Dict[str, Any]]:
    """Get recent user activities for dashboard feed."""
    try:
        supabase = await get_supabase_client()

        response = supabase.table("user_activity_log").select(
            "user_name, action, station_name, created_at"
        ).order("created_at", desc=True).limit(limit).execute()

        activities = []
        for activity in (response.data or []):
            # Format time ago
            created_at = datetime.fromisoformat(activity["created_at"].replace('Z', '+00:00'))
            now = datetime.now(timezone.utc)
            diff_minutes = (now - created_at).total_seconds() / 60

            if diff_minutes < 1:
                time_ago = "Just now"
            elif diff_minutes < 60:
                time_ago = f"{int(diff_minutes)} min ago"
            elif diff_minutes < 1440:  # 24 hours
                time_ago = f"{int(diff_minutes / 60)} hour{'s' if int(diff_minutes / 60) != 1 else ''} ago"
            else:
                time_ago = f"{int(diff_minutes / 1440)} day{'s' if int(diff_minutes / 1440) != 1 else ''} ago"

            activities.append({
                "user": activity.get("user_name", "Unknown User"),
                "action": activity.get("action", "Unknown action"),
                "station": activity.get("station_name", "Unknown station") if activity.get("station_name") else None,
                "time": time_ago
            })

        return activities

    except Exception as e:
        print(f"Error getting recent activity: {e}")
        return []
