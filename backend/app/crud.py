from typing import List, Optional, Dict, Any
from uuid import UUID
from supabase import Client

from .dependencies import get_supabase_client

supabase: Client = get_supabase_client()

# -----------------------
# USER PROFILES
# -----------------------
def get_user_profile(user_id: UUID) -> Optional[Dict[str, Any]]:
    response = supabase.table("profiles").select("*").eq("id", str(user_id)).single().execute()
    return response.data

def create_user_profile(profile_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    response = supabase.table("profiles").insert(profile_data).execute()
    return response.data

def update_user_profile(user_id: UUID, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    response = supabase.table("profiles").update(update_data).eq("id", str(user_id)).execute()
    return response.data

def list_profiles() -> List[Dict[str, Any]]:
    response = supabase.table("profiles").select("*").execute()
    return response.data or []


# -----------------------
# ADMINS
# -----------------------
def get_admin(admin_id: UUID) -> Optional[Dict[str, Any]]:
    response = supabase.table("admins").select("*").eq("id", str(admin_id)).single().execute()
    return response.data

def create_admin(admin_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    response = supabase.table("admins").insert(admin_data).execute()
    return response.data

def update_admin(admin_id: UUID, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    response = supabase.table("admins").update(update_data).eq("id", str(admin_id)).execute()
    return response.data

def list_admins() -> List[Dict[str, Any]]:
    response = supabase.table("admins").select("*").execute()
    return response.data or []


# -----------------------
# STATION MANAGERS
# -----------------------
def get_station_manager(manager_id: UUID) -> Optional[Dict[str, Any]]:
    response = supabase.table("station_managers").select("*").eq("id", str(manager_id)).single().execute()
    return response.data

def create_station_manager(manager_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    response = supabase.table("station_managers").insert(manager_data).execute()
    return response.data

def update_station_manager(manager_id: UUID, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    response = supabase.table("station_managers").update(update_data).eq("id", str(manager_id)).execute()
    return response.data

def list_station_managers() -> List[Dict[str, Any]]:
    response = supabase.table("station_managers").select("*").execute()
    return response.data or []


# -----------------------
# VEHICLES
# -----------------------
def get_vehicle(vehicle_id: UUID) -> Optional[Dict[str, Any]]:
    response = supabase.table("vehicles").select("*").eq("id", str(vehicle_id)).single().execute()
    return response.data

def create_vehicle(vehicle_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    response = supabase.table("vehicles").insert(vehicle_data).execute()
    return response.data

def update_vehicle(vehicle_id: UUID, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    response = supabase.table("vehicles").update(update_data).eq("id", str(vehicle_id)).execute()
    return response.data

def list_user_vehicles(owner_id: UUID) -> List[Dict[str, Any]]:
    response = supabase.table("vehicles").select("*").eq("owner_id", str(owner_id)).execute()
    return response.data or []


# -----------------------
# STATIONS
# -----------------------
def get_station(station_id: UUID) -> Optional[Dict[str, Any]]:
    response = supabase.table("stations").select("*").eq("station_id", str(station_id)).single().execute()
    return response.data

def create_station(station_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    response = supabase.table("stations").insert(station_data).execute()
    return response.data

def update_station(station_id: UUID, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    response = supabase.table("stations").update(update_data).eq("station_id", str(station_id)).execute()
    return response.data

def list_stations() -> List[Dict[str, Any]]:
    response = supabase.table("stations").select("*").execute()
    return response.data or []


# -----------------------
# SLOTS
# -----------------------
def list_station_slots(station_id: UUID) -> List[Dict[str, Any]]:
    response = supabase.table("slots").select("*").eq("station_id", str(station_id)).execute()
    return response.data or []

def create_slot(slot_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    response = supabase.table("slots").insert(slot_data).execute()
    return response.data

def update_slot(slot_id: UUID, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    response = supabase.table("slots").update(update_data).eq("id", str(slot_id)).execute()
    return response.data

def list_slots(station_ids: List[UUID]) -> List[Dict[str, Any]]:
    if not station_ids:
        return []
    response = supabase.table("slots").select("*").in_("station_id", [str(s) for s in station_ids]).execute()
    return response.data or []


# -----------------------
# BOOKINGS
# -----------------------
def get_booking(booking_id: UUID) -> Optional[Dict[str, Any]]:
    response = supabase.table("bookings").select("*").eq("id", str(booking_id)).single().execute()
    return response.data

def create_booking(booking_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    response = supabase.table("bookings").insert(booking_data).execute()
    return response.data

def update_booking(booking_id: UUID, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    response = supabase.table("bookings").update(update_data).eq("id", str(booking_id)).execute()
    return response.data

def list_bookings(owner_id: UUID) -> List[Dict[str, Any]]:
    response = supabase.table("bookings").select("*").eq("user_id", str(owner_id)).execute()
    return response.data or []


# -----------------------
# CHARGING SESSIONS
# -----------------------
def get_charging_session(session_id: UUID) -> Optional[Dict[str, Any]]:
    response = supabase.table("charging_sessions").select("*").eq("id", str(session_id)).single().execute()
    return response.data

def create_charging_session(session_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    response = supabase.table("charging_sessions").insert(session_data).execute()
    return response.data

def update_charging_session(session_id: UUID, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    response = supabase.table("charging_sessions").update(update_data).eq("id", str(session_id)).execute()
    return response.data

def list_charging_sessions(station_ids: List[UUID]) -> List[Dict[str, Any]]:
    if not station_ids:
        return []
    response = supabase.table("charging_sessions").select("*").in_("station_id", [str(s) for s in station_ids]).execute()
    return response.data or []


# -----------------------
# FEEDBACK
# -----------------------
def get_feedback(feedback_id: UUID) -> Optional[Dict[str, Any]]:
    response = supabase.table("feedback").select("*").eq("id", str(feedback_id)).single().execute()
    return response.data

def create_feedback(feedback_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    response = supabase.table("feedback").insert(feedback_data).execute()
    return response.data

def update_feedback(feedback_id: UUID, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    response = supabase.table("feedback").update(update_data).eq("id", str(feedback_id)).execute()
    return response.data

def list_station_feedback(station_id: UUID) -> List[Dict[str, Any]]:
    response = supabase.table("feedback").select("*").eq("station_id", str(station_id)).execute()
    return response.data or []

def list_feedback(station_ids: List[UUID]) -> List[Dict[str, Any]]:
    if not station_ids:
        return []
    response = supabase.table("feedback").select("*").in_("station_id", [str(s) for s in station_ids]).execute()
    return response.data or []
