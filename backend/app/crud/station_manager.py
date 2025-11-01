from typing import Any, Dict, List, Optional
from uuid import UUID
import httpx
from ..database import get_supabase_client, get_supabase_service_role_client
from fastapi import HTTPException

async def get_station_manager(manager_id: UUID) -> Optional[Dict[str, Any]]:
    try:
        supabase = await get_supabase_client()
        response = supabase.table("station_managers").select("*").eq("id", str(manager_id)).single().execute()
        return response.data
    except httpx.HTTPError as e:
        print(f"Error fetching manager {manager_id}: {e}")
        return None

async def create_station_manager(manager_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    try:
        supabase = await get_supabase_client()
        supabase_service_role = await get_supabase_service_role_client()
        email = manager_data.get("email")
        password = manager_data.get("password")

        if not email:
            raise HTTPException(status_code=400, detail="Email is required for station manager creation")

        # Check if user exists by attempting signup with provided password
        # If user exists, signup will fail - then we can find their ID from auth
        existing_user_id = None
        user_exists = False

        try:
            print(f"Attempting to create account for {email}...")
            if not password:
                raise HTTPException(status_code=400, detail="Password is required")
            signup_response = supabase.auth.sign_up({
                "email": email,
                "password": password,
                "options": {
                    "data": {
                        "name": manager_data.get("name"),
                        "phone": manager_data.get("phone"),
                        "address": manager_data.get("address"),
                        "city": manager_data.get("city")
                    }
                },
            })

            if signup_response.user:
                print(f"New user created: {signup_response.user.id}")
                existing_user_id = signup_response.user.id
            else:
                print("Signup response had no user - checking if error indicates existing user")

        except Exception as signup_error:
            error_str = str(signup_error).lower()
            print(f"Signup failed with error: {error_str}")

            if "already" in error_str and ("registered" in error_str or "exist" in error_str):
                print(f"User {email} already exists, will treat as existing user")
                user_exists = True

                # Now get the existing user ID from auth
                users_response = supabase_service_role.auth.admin.list_users()
                users = users_response.data.users if hasattr(users_response, 'data') and hasattr(users_response.data, 'users') else []
                print(f"list_users returned {len(users)} users for lookup")

                # Debug: show all emails in the response
                for u in users[:5]:  # Show first 5 for debug
                    print(f"  User: {u.email if hasattr(u, 'email') else getattr(u, 'data', {}).get('email', 'no-email')}")

                existing_user = next((u for u in users if (u.email if hasattr(u, 'email') else getattr(u, 'data', {}).get('email', None)) == email), None)
                if existing_user:
                    existing_user_id = existing_user.id if hasattr(existing_user, 'id') else getattr(existing_user, 'data', {}).get('id')
                    print(f"Found existing user ID: {existing_user_id}")
                else:
                    print(f"User {email} not found in users list, trying profiles table...")

                    # Try to get user ID from profiles table
                    try:
                        profiles_response = supabase_service_role.table("profiles").select("id").eq("email", email).single().execute()
                        if profiles_response.data:
                            existing_user_id = profiles_response.data["id"]
                            print(f"Found user ID from profiles: {existing_user_id}")
                        else:
                            raise HTTPException(status_code=400, detail=f"User {email} already registered. Please have them log in to complete their profile first, then try making them a station manager.")
                    except Exception:
                        raise HTTPException(status_code=400, detail=f"User {email} already registered. Please have them log in to complete their profile first, then try making them a station manager.")
            else:
                # Some other signup error
                raise HTTPException(status_code=400, detail=f"Failed to create user account: {str(signup_error)}")

        # Now user_id is either from new signup or existing user lookup
        user_id = existing_user_id
        is_new_user = not user_exists

        if user_exists:
            print(f"User already exists with ID: {user_id}")
            # If password is provided for existing user, reset it
            if password:
                try:
                    reset_response = supabase_service_role.auth.admin.update_user_by_id(
                        user_id,
                        {"password": password}
                    )
                    print(f"Password reset for existing user {email}")
                except Exception as e:
                    print(f"Failed to reset password for existing user: {e}")
                    raise HTTPException(status_code=500, detail="Failed to reset user password")
        else:
            print(f"New user created with ID: {user_id}")

        # Check if user is already in station_managers table
        manager_exists = supabase.table("station_managers").select("*").eq("id", user_id).execute()
        if manager_exists.data and len(manager_exists.data) > 0:
            raise HTTPException(status_code=400, detail="User is already registered as a station manager")

        # Check current profile role
        profile_response = supabase.table("profiles").select("role").eq("id", user_id).single().execute()
        current_role = profile_response.data.get("role") if profile_response.data else None

        # Update profile role to station_manager if not already set
        if current_role != "station_manager":
            profile_update = {
                "role": "station_manager"
            }
            update_response = supabase.table("profiles").update(profile_update).eq("id", user_id).execute()
            if update_response.data:
                print(f"Updated profile role to station_manager for user {user_id}")
            else:
                print(f"Could not update profile role for user {user_id}")

        # Create station manager record if it doesn't exist
        if not manager_exists.data or len(manager_exists.data) == 0:
            print("Creating station manager record...")
            data = {
                "id": user_id,
                "name": manager_data.get("name"),
                "email": email,
                "phone": manager_data.get("phone"),
                "address": manager_data.get("address"),
                "city": manager_data.get("city"),
                "state": manager_data.get("state"),
                "country": manager_data.get("country"),
                "zip_code": manager_data.get("zip_code")
            }

            insert_response = supabase.table("station_managers").insert(data).execute()

            if insert_response.data:
                print(f"Successfully created station manager record: {insert_response.data[0]}")
                return insert_response.data[0]
            else:
                raise HTTPException(status_code=500, detail="Failed to create station manager record")
        else:
            # User is already a station manager, return existing record
            print(f"User {user_id} is already registered as station manager")
            return manager_exists.data[0]

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error creating station manager: {e}")
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")

async def update_station_manager(manager_id: UUID, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    try:
        supabase = await get_supabase_client()
        # If caller provided station_ids (denormalized), sync stations table instead of trying
        # to update a non-existent column on station_managers
        station_ids = None
        if "station_ids" in update_data:
            station_ids = update_data.pop("station_ids") or []
            # Normalize ids to strings
            station_ids = [str(s) for s in station_ids]

            # Get current stations assigned to this manager
            current_resp = supabase.table("stations").select("id").eq("station_manager", str(manager_id)).execute()
            current_ids = [r.get("id") for r in (current_resp.data or [])]

            # Compute to_add and to_remove
            to_add = [sid for sid in station_ids if sid not in current_ids]
            to_remove = [sid for sid in current_ids if sid not in station_ids]

            if to_remove:
                supabase.table("stations").update({"station_manager": None}).in_("id", to_remove).execute()
            if to_add:
                supabase.table("stations").update({"station_manager": str(manager_id)}).in_("id", to_add).execute()

        # Update manager record with remaining fields (do not attempt to write station_ids)
        if update_data:
            response = supabase.table("station_managers").update(update_data).eq("id", str(manager_id)).execute()
            if response.data:
                return response.data[0]
        else:
            # Nothing to update on manager row itself; return fresh manager record
            fresh = supabase.table("station_managers").select("*").eq("id", str(manager_id)).maybe_single().execute()
            return getattr(fresh, "data", None)
    except httpx.HTTPError as e:
        print(f"Error updating manager {manager_id}: {e}")
        return None

async def assign_manager_to_station(manager_user_id: UUID, station_id: UUID) -> Optional[Dict[str, Any]]:
    """Create an assignment row linking a manager user to a station."""
    try:
        supabase = await get_supabase_client()
        # Assign the station -> manager (stations.station_manager is the single source of truth)
        response = supabase.table("stations").update({"station_manager": str(manager_user_id)}).eq("id", str(station_id)).execute()
        if response and getattr(response, "data", None):
            return response.data[0]
    except httpx.HTTPError as e:
        print(f"Error assigning manager {manager_user_id} to station {station_id}: {e}")
        return None

async def delete_station_manager(manager_id: UUID) -> bool:
    """Delete a station manager by ID. Unassigns stations and updates profile role."""
    try:
        supabase = await get_supabase_client()

        # First, unassign all stations that were assigned to this manager
        unassign_response = supabase.table("stations").update({"station_manager": None}).eq("station_manager", str(manager_id)).execute()
        print(f"Unassigned manager {manager_id} from {len(unassign_response.data or [])} stations")

        # Update profile role back to app_user
        profile_update = supabase.table("profiles").update({"role": "app_user"}).eq("id", str(manager_id)).execute()
        if profile_update.data:
            print(f"Updated profile role to app_user for user {manager_id}")

        # Delete the manager record
        delete_response = supabase.table("station_managers").delete().eq("id", str(manager_id)).execute()
        if delete_response.data and len(delete_response.data) > 0:
            print(f"Deleted station manager record for {manager_id}")
            return True
        else:
            print(f"No manager record found to delete for {manager_id}")
            return False

    except httpx.HTTPError as e:
        print(f"Error deleting manager {manager_id}: {e}")
        return False


async def get_manager_stations(manager_id: str) -> List[Dict[str, Any]]:
    """Get all stations managed by a specific station manager"""
    try:
        supabase = await get_supabase_client()
        response = supabase.table("stations").select("*").eq("station_manager", manager_id).execute()
        return response.data or []
    except httpx.HTTPError as e:
        print(f"Error fetching stations for manager {manager_id}: {e}")
        return []


async def get_manager_bookings(manager_id: str) -> List[Dict[str, Any]]:
    """Get all bookings for stations managed by a specific station manager"""
    try:
        supabase = await get_supabase_client()
        # First get the station IDs managed by this manager
        stations_response = supabase.table("stations").select("id").eq("station_manager", manager_id).execute()
        station_ids = [station["id"] for station in (stations_response.data or [])]

        if not station_ids:
            return []

        # Get bookings for these stations
        bookings_response = supabase.table("bookings").select("*").in_("station_id", station_ids).execute()
        return bookings_response.data or []
    except httpx.HTTPError as e:
        print(f"Error fetching bookings for manager {manager_id}: {e}")
        return []


async def get_manager_sessions(manager_id: str) -> List[Dict[str, Any]]:
    """Get all charging sessions for stations managed by a specific station manager"""
    try:
        supabase = await get_supabase_client()
        # First get the station IDs managed by this manager
        stations_response = supabase.table("stations").select("id").eq("station_manager", manager_id).execute()
        station_ids = [station["id"] for station in (stations_response.data or [])]

        if not station_ids:
            return []

        # Get charging sessions for these stations
        sessions_response = supabase.table("charging_sessions").select("*").in_("station_id", station_ids).execute()
        return sessions_response.data or []
    except httpx.HTTPError as e:
        print(f"Error fetching sessions for manager {manager_id}: {e}")
        return []
