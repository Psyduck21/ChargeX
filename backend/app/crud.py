# backend/app/crud.py

from typing import List, Optional
from uuid import UUID
from datetime import datetime

from supabase import Client

from .models import (
    UserProfile,
    Admin,
    StationManager,
    # StationManagerCreate,  # not defined in models yet
    Vehicle,
    VehicleCreate,
    Station,
    StationCreate,
    Slot,
    SlotCreate,
    Booking,
    BookingCreate,
    ChargingSession,
    ChargingSessionCreate,
    Feedback,
    FeedbackCreate
)
from .dependencies import get_supabase_client

supabase: Client = get_supabase_client()

# USER PROFILES operations
def get_user_profile(user_id: UUID) -> Optional[UserProfile]:
    response = supabase.table("profiles").select("*").eq("id", str(user_id)).single().execute()
    return response.data

def create_user_profile(profile: UserProfile) -> UserProfile:
    response = supabase.table("profiles").insert(profile.dict()).execute()
    return response.data

def update_user_profile(user_id: UUID, update_data: dict) -> UserProfile:
    response = supabase.table("profiles").update(update_data).eq("id", str(user_id)).execute()
    return response.data

def list_profiles() -> List[UserProfile]:
    response = supabase.table("profiles").select("*").execute()
    return response.data


# ADMINS operations
def get_admin(admin_id: UUID) -> Optional[Admin]:
    response = supabase.table("admins").select("*").eq("id", str(admin_id)).single().execute()
    return response.data

def create_admin(admin: Admin) -> Admin:
    response = supabase.table("admins").insert(admin.dict()).execute()
    return response.data

def update_admin(admin_id: UUID, update_data: dict) -> Admin:
    response = supabase.table("admins").update(update_data).eq("id", str(admin_id)).execute()
    return response.data

def list_admins() -> List[Admin]:
    response = supabase.table("admins").select("*").execute()
    return response.data


# STATION MANAGERS operations
def get_station_manager(manager_id: UUID) -> Optional[StationManager]:
    response = supabase.table("station_managers").select("*").eq("id", str(manager_id)).single().execute()
    return response.data

def create_station_manager(manager: StationManager) -> StationManager:
    response = supabase.table("station_managers").insert(manager.dict()).execute()
    return response.data

def update_station_manager(manager_id: UUID, update_data: dict) -> StationManager:
    response = supabase.table("station_managers").update(update_data).eq("id", str(manager_id)).execute()
    return response.data

def list_station_managers() -> List[StationManager]:
    response = supabase.table("station_managers").select("*").execute()
    return response.data


# VEHICLES operations
def get_vehicle(vehicle_id: UUID) -> Optional[Vehicle]:
    response = supabase.table("vehicles").select("*").eq("id", str(vehicle_id)).single().execute()
    return response.data

def create_vehicle(vehicle: VehicleCreate) -> Vehicle:
    response = supabase.table("vehicles").insert(vehicle.dict()).execute()
    return response.data

def update_vehicle(vehicle_id: UUID, update_data: dict) -> Vehicle:
    response = supabase.table("vehicles").update(update_data).eq("id", str(vehicle_id)).execute()
    return response.data

def list_user_vehicles(owner_id: UUID) -> List[Vehicle]:
    response = supabase.table("vehicles").select("*").eq("owner_id", str(owner_id)).execute()
    return response.data


# STATIONS operations
def get_station(station_id: UUID) -> Optional[Station]:
    response = supabase.table("stations").select("*").eq("station_id", str(station_id)).single().execute()
    return response.data

def create_station(station: StationCreate) -> Station:
    response = supabase.table("stations").insert(station.dict()).execute()
    return response.data

def update_station(station_id: UUID, update_data: dict) -> Station:
    response = supabase.table("stations").update(update_data).eq("station_id", str(station_id)).execute()
    return response.data

def list_stations() -> List[Station]:
    response = supabase.table("stations").select("*").execute()
    return response.data


# SLOTS operations
def list_station_slots(station_id: UUID) -> List[Slot]:
    response = supabase.table("slots").select("*").eq("station_id", str(station_id)).execute()
    return response.data

def create_slot(slot: SlotCreate) -> Slot:
    response = supabase.table("slots").insert(slot.dict()).execute()
    return response.data

def update_slot(slot_id: UUID, update_data: dict) -> Slot:
    response = supabase.table("slots").update(update_data).eq("id", str(slot_id)).execute()
    return response.data

def list_slots(station_ids: List[UUID]) -> List[Slot]:
    if not station_ids:
        return []
    response = supabase.table("slots").select("*").in_("station_id", [str(s) for s in station_ids]).execute()
    return response.data


# BOOKINGS operations
def get_booking(booking_id: UUID) -> Optional[Booking]:
    response = supabase.table("bookings").select("*").eq("id", str(booking_id)).single().execute()
    return response.data

def create_booking(booking: BookingCreate) -> Booking:
    response = supabase.table("bookings").insert(booking.dict()).execute()
    return response.data

def update_booking(booking_id: UUID, update_data: dict) -> Booking:
    response = supabase.table("bookings").update(update_data).eq("id", str(booking_id)).execute()
    return response.data

def list_bookings(owner_id: UUID) -> List[Booking]:
    # Assuming bookings are associated via vehicles owned by the user; adjust as needed
    response = supabase.table("bookings").select("*").eq("user_id", str(owner_id)).execute()
    return response.data


# CHARGING SESSIONS operations
def get_charging_session(session_id: UUID) -> Optional[ChargingSession]:
    response = supabase.table("charging_sessions").select("*").eq("id", str(session_id)).single().execute()
    return response.data

def create_charging_session(session: ChargingSessionCreate) -> ChargingSession:
    response = supabase.table("charging_sessions").insert(session.dict()).execute()
    return response.data

def update_charging_session(session_id: UUID, update_data: dict) -> ChargingSession:
    response = supabase.table("charging_sessions").update(update_data).eq("id", str(session_id)).execute()
    return response.data

def list_charging_sessions(station_ids: List[UUID]) -> List[ChargingSession]:
    if not station_ids:
        return []
    response = supabase.table("charging_sessions").select("*").in_("station_id", [str(s) for s in station_ids]).execute()
    return response.data


# FEEDBACK operations
def get_feedback(feedback_id: UUID) -> Optional[Feedback]:
    response = supabase.table("feedback").select("*").eq("id", str(feedback_id)).single().execute()
    return response.data

def create_feedback(feedback: FeedbackCreate) -> Feedback:
    response = supabase.table("feedback").insert(feedback.dict()).execute()
    return response.data

def update_feedback(feedback_id: UUID, update_data: dict) -> Feedback:
    response = supabase.table("feedback").update(update_data).eq("id", str(feedback_id)).execute()
    return response.data

def list_station_feedback(station_id: UUID) -> List[Feedback]:
    response = supabase.table("feedback").select("*").eq("station_id", str(station_id)).execute()
    return response.data

def list_feedback(station_ids: List[UUID]) -> List[Feedback]:
    if not station_ids:
        return []
    response = supabase.table("feedback").select("*").in_("station_id", [str(s) for s in station_ids]).execute()
    return response.data
