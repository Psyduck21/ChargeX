from typing import List, Optional, Dict, Any
from uuid import UUID
from supabase import Client
import httpx

from .dependencies import get_supabase_client, supabase_service_role

supabase: Client = get_supabase_client()


# -----------------------
# USER PROFILES
# -----------------------
def get_user_profile(user_id: UUID) -> Optional[Dict[str, Any]]:
    try:
        response = supabase.table("profiles").select("*").eq("id", str(user_id)).single().execute()
        return response.data
    except httpx.HTTPError as e:
        print(f"Error fetching user profile {user_id}: {e}")
        return None

def create_user_profile(profile_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    try:
        response = supabase.table("profiles").insert(profile_data).execute()
        return response.data
    except httpx.HTTPError as e:
        print(f"Error creating user profile: {e}")
        return None

def update_user_profile(user_id: UUID, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    try:
        response = supabase.table("profiles").update(update_data).eq("id", str(user_id)).execute()
        return response.data
    except httpx.HTTPError as e:
        print(f"Error updating user profile {user_id}: {e}")
        return None

def list_profiles() -> List[Dict[str, Any]]:
    try:
        response = supabase.table("profiles").select("*").execute()
        return response.data or []
    except httpx.HTTPError as e:
        print(f"Error listing profiles: {e}")
        return []


# -----------------------
# ADMINS
# -----------------------
def get_admin(admin_id: UUID) -> Optional[Dict[str, Any]]:
    try:
        response = supabase.table("admins").select("*").eq("id", str(admin_id)).single().execute()
        return response.data
    except httpx.HTTPError as e:
        print(f"Error fetching admin {admin_id}: {e}")
        return None

def create_admin(admin_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    try:
        response = supabase.table("admins").insert(admin_data).execute()
        return response.data
    except httpx.HTTPError as e:
        print(f"Error creating admin: {e}")
        return None

def update_admin(admin_id: UUID, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    try:
        response = supabase.table("admins").update(update_data).eq("id", str(admin_id)).execute()
        return response.data
    except httpx.HTTPError as e:
        print(f"Error updating admin {admin_id}: {e}")
        return None

def list_admins() -> List[Dict[str, Any]]:
    try:
        response = supabase.table("admins").select("*").execute()
        return response.data or []
    except httpx.HTTPError as e:
        print(f"Error listing admins: {e}")
        return []


# -----------------------
# STATION MANAGERS
# -----------------------
def get_station_manager(manager_id: UUID) -> Optional[Dict[str, Any]]:
    try:
        response = supabase.table("station_managers").select("*").eq("id", str(manager_id)).single().execute()
        return response.data
    except httpx.HTTPError as e:
        print(f"Error fetching manager {manager_id}: {e}")
        return None

def create_station_manager(manager_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    try:
        response = supabase.table("station_managers").insert(manager_data).execute()
        return response.data
    except httpx.HTTPError as e:
        print(f"Error creating manager: {e}")
        return None

def update_station_manager(manager_id: UUID, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    try:
        response = supabase.table("station_managers").update(update_data).eq("id", str(manager_id)).execute()
        return response.data
    except httpx.HTTPError as e:
        print(f"Error updating manager {manager_id}: {e}")
        return None

def list_station_managers() -> List[Dict[str, Any]]:
    try:
        response = supabase.table("station_managers").select("*").execute()
        return response.data or []
    except httpx.HTTPError as e:
        print(f"Error listing station managers: {e}")
        return []

def list_managers_for_station(station_id: UUID) -> List[Dict[str, Any]]:
    try:
        # FIX: Previously eq("id", station_id) — should filter by station_id column, not id
        response = supabase.table("station_managers").select("*").eq("station_id", str(station_id)).execute()
        return response.data or []
    except httpx.HTTPError as e:
        print(f"Error listing managers for station {station_id}: {e}")
        return []

def assign_manager_to_station(manager_user_id: UUID, station_id: UUID) -> Optional[Dict[str, Any]]:
    """Create an assignment row linking a manager user to a station."""
    try:
        response = supabase.table("station_managers").insert({
            "id": str(manager_user_id),
            "station_id": str(station_id)
        }).execute()
        return response.data
    except httpx.HTTPError as e:
        print(f"Error assigning manager {manager_user_id} to station {station_id}: {e}")
        return None


# -----------------------
# STATIONS
# -----------------------
def get_station(station_id: UUID) -> Optional[Dict[str, Any]]:
    try:
        response = supabase.table("stations").select("*").eq("id", str(station_id)).single().execute()
        return response.data
    except httpx.HTTPError as e:
        print(f"Error fetching station {station_id}: {e}")
        return None

def update_station(station_id: UUID, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    # FIX: was using eq("station_id", ...) instead of eq("id", ...)
    try:
        response = supabase.table("stations").update(update_data).eq("id", str(station_id)).execute()
        return response.data
    except httpx.HTTPError as e:
        print(f"Error updating station {station_id}: {e}")
        return None

def delete_station(station_id: UUID) -> bool:
    try:
        supabase.table("stations").delete().eq("id", str(station_id)).execute()
        return True
    except httpx.HTTPError as e:
        print(f"Error deleting station {station_id}: {e}")
        return False

# -----------------------
# MANAGER -> STATION FIX in get_all_station_managers
# -----------------------
def get_all_station_managers() -> List[Dict[str, Any]]:
    """Get all station managers with their station assignments"""
    managers = list_station_managers()
    
    for manager in managers:
        # FIX: previously used manager.get("id") to fetch station, should fetch station_id
        station_id = manager.get("station_id")
        if station_id:
            station = get_station(station_id)
            manager["station"] = station
        else:
            manager["station"] = None
    
    return managers

# -----------------------
# VEHICLES
# -----------------------
def get_vehicle(vehicle_id: UUID) -> Optional[Dict[str, Any]]:
    try:
        response = supabase.table("vehicles").select("*").eq("id", str(vehicle_id)).single().execute()
        return response.data
    except httpx.HTTPError as e:
        print(f"Error fetching vehicle {vehicle_id}: {e}")
        return None

def create_vehicle(vehicle_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    try:
        response = supabase.table("vehicles").insert(vehicle_data).execute()
        return response.data
    except httpx.HTTPError as e:
        print(f"Error creating vehicle: {e}")
        return None

def update_vehicle(vehicle_id: UUID, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    try:
        response = supabase.table("vehicles").update(update_data).eq("id", str(vehicle_id)).execute()
        return response.data
    except httpx.HTTPError as e:
        print(f"Error updating vehicle {vehicle_id}: {e}")
        return None

def list_user_vehicles(owner_id: UUID) -> List[Dict[str, Any]]:
    try:
        response = supabase.table("vehicles").select("*").eq("owner_id", str(owner_id)).execute()
        return response.data or []
    except httpx.HTTPError as e:
        print(f"Error listing vehicles for owner {owner_id}: {e}")
        return []


# -----------------------
# SLOTS
# -----------------------
def list_station_slots(station_id: UUID) -> List[Dict[str, Any]]:
    try:
        response = supabase.table("slots").select("*").eq("station_id", str(station_id)).execute()
        return response.data or []
    except httpx.HTTPError as e:
        print(f"Error listing slots for station {station_id}: {e}")
        return []

def create_slot(slot_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    try:
        response = supabase.table("slots").insert(slot_data).execute()
        return response.data
    except httpx.HTTPError as e:
        print(f"Error creating slot: {e}")
        return None

def update_slot(slot_id: UUID, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    try:
        response = supabase.table("slots").update(update_data).eq("id", str(slot_id)).execute()
        return response.data
    except httpx.HTTPError as e:
        print(f"Error updating slot {slot_id}: {e}")
        return None

def list_slots(station_ids: List[UUID]) -> List[Dict[str, Any]]:
    if not station_ids:
        return []
    try:
        response = supabase.table("slots").select("*").in_("station_id", [str(s) for s in station_ids]).execute()
        return response.data or []
    except httpx.HTTPError as e:
        print(f"Error listing slots for stations {station_ids}: {e}")
        return []


# -----------------------
# BOOKINGS
# -----------------------
def get_booking(booking_id: UUID) -> Optional[Dict[str, Any]]:
    try:
        response = supabase.table("bookings").select("*").eq("id", str(booking_id)).single().execute()
        return response.data
    except httpx.HTTPError as e:
        print(f"Error fetching booking {booking_id}: {e}")
        return None

def create_booking(booking_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    try:
        response = supabase.table("bookings").insert(booking_data).execute()
        return response.data
    except httpx.HTTPError as e:
        print(f"Error creating booking: {e}")
        return None

def update_booking(booking_id: UUID, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    try:
        response = supabase.table("bookings").update(update_data).eq("id", str(booking_id)).execute()
        return response.data
    except httpx.HTTPError as e:
        print(f"Error updating booking {booking_id}: {e}")
        return None

def list_bookings(owner_id: UUID) -> List[Dict[str, Any]]:
    try:
        response = supabase.table("bookings").select("*").eq("user_id", str(owner_id)).execute()
        return response.data or []
    except httpx.HTTPError as e:
        print(f"Error listing bookings for owner {owner_id}: {e}")
        return []


# -----------------------
# CHARGING SESSIONS
# -----------------------
def get_charging_session(session_id: UUID) -> Optional[Dict[str, Any]]:
    try:
        response = supabase.table("charging_sessions").select("*").eq("id", str(session_id)).single().execute()
        return response.data
    except httpx.HTTPError as e:
        print(f"Error fetching charging session {session_id}: {e}")
        return None

def create_charging_session(session_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    try:
        response = supabase.table("charging_sessions").insert(session_data).execute()
        return response.data
    except httpx.HTTPError as e:
        print(f"Error creating charging session: {e}")
        return None

def update_charging_session(session_id: UUID, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    try:
        response = supabase.table("charging_sessions").update(update_data).eq("id", str(session_id)).execute()
        return response.data
    except httpx.HTTPError as e:
        print(f"Error updating charging session {session_id}: {e}")
        return None

def list_charging_sessions(station_ids: List[UUID]) -> List[Dict[str, Any]]:
    if not station_ids:
        return []
    try:
        response = supabase.table("charging_sessions").select("*").in_("station_id", [str(s) for s in station_ids]).execute()
        return response.data or []
    except httpx.HTTPError as e:
        print(f"Error listing charging sessions for stations {station_ids}: {e}")
        return []

def list_charging_sessions_between(station_ids: List[UUID], start_iso: str, end_iso: str) -> List[Dict[str, Any]]:
    if not station_ids:
        return []
    try:
        response = (
            supabase.table("charging_sessions")
            .select("*")
            .in_("station_id", [str(s) for s in station_ids])
            .gte("started_at", start_iso)
            .lte("started_at", end_iso)
            .execute()
        )
        return response.data or []
    except httpx.HTTPError as e:
        print(f"Error listing charging sessions between {start_iso} and {end_iso}: {e}")
        return []


# -----------------------
# FEEDBACK
# -----------------------
def get_feedback(feedback_id: UUID) -> Optional[Dict[str, Any]]:
    try:
        response = supabase.table("feedback").select("*").eq("id", str(feedback_id)).single().execute()
        return response.data
    except httpx.HTTPError as e:
        print(f"Error fetching feedback {feedback_id}: {e}")
        return None

def create_feedback(feedback_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    try:
        response = supabase.table("feedback").insert(feedback_data).execute()
        return response.data
    except httpx.HTTPError as e:
        print(f"Error creating feedback: {e}")
        return None

def update_feedback(feedback_id: UUID, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    try:
        response = supabase.table("feedback").update(update_data).eq("id", str(feedback_id)).execute()
        return response.data
    except httpx.HTTPError as e:
        print(f"Error updating feedback {feedback_id}: {e}")
        return None

def list_station_feedback(station_id: UUID) -> List[Dict[str, Any]]:
    try:
        response = supabase.table("feedback").select("*").eq("station_id", str(station_id)).execute()
        return response.data or []
    except httpx.HTTPError as e:
        print(f"Error listing feedback for station {station_id}: {e}")
        return []

def list_feedback(station_ids: List[UUID]) -> List[Dict[str, Any]]:
    if not station_ids:
        return []
    try:
        response = supabase.table("feedback").select("*").in_("station_id", [str(s) for s in station_ids]).execute()
        return response.data or []
    except httpx.HTTPError as e:
        print(f"Error listing feedback for stations {station_ids}: {e}")
        return []


# -----------------------
# ADMIN STATISTICS
# -----------------------
def get_admin_statistics() -> Dict[str, Any]:
    """Get overall statistics for admin dashboard"""
    try:
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

def list_user_vehicles(owner_id: UUID) -> List[Dict[str, Any]]:
    response = supabase.table("vehicles").select("*").eq("owner_id", str(owner_id)).execute()
    return response.data or []

def list_stations() -> List[Dict[str, Any]]:
    response = supabase.table("stations").select("*").execute()
    return response.data or []

def create_station(station_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    response = supabase.table("stations").insert(station_data).execute()
    return response.data

def get_stations_with_managers() -> list[dict]:
    """Get all stations with their assigned managers"""
    stations = list_stations()  # Make sure list_stations() exists above

    for station in stations:
        station_id = station.get("id")
        if station_id:
            managers = list_managers_for_station(station_id)
            station["managers"] = managers
        else:
            station["managers"] = []

    return stations
# list_stations must exist
def list_stations() -> list[dict]:
    response = supabase.table("stations").select("*").execute()
    return response.data or []

# list_managers_for_station must exist
def list_managers_for_station(station_id: UUID) -> list[dict]:
    response = (
        supabase.table("station_managers")
        .select("*")
        .eq("station_id", str(station_id))
        .execute()
    )
    return response.data or []

# Now define get_stations_with_managers
def get_stations_with_managers() -> list[dict]:
    stations = list_stations()
    for station in stations:
        station_id = station.get("id")
        if station_id:
            managers = list_managers_for_station(station_id)
            station["managers"] = managers
        else:
            station["managers"] = []
    return stations
# First, ensure this exists
def list_profiles() -> list[dict]:
    response = supabase.table("profiles").select("*").execute()
    return response.data or []

# Now define get_all_users
def get_all_users() -> list[dict]:
    """Get all users (profiles)"""
    return list_profiles()

