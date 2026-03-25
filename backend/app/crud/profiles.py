import httpx
from typing import Any, Dict, List, Optional
from uuid import UUID
from ..database import get_supabase_client, get_supabase_service_role_client
from ..models import ProfileCreate, ProfileUpdate, ProfileOut


async def get_user_profile(user_id: UUID) -> Optional[ProfileOut]:
    try:
        supabase_service_role = await get_supabase_service_role_client()

        # First determine the user's role
        role = None

        # Check admins table
        try:
            admin_response = supabase_service_role.table("admins").select("id").eq("id", str(user_id)).execute()
            if admin_response.data:
                role = "admin"
        except:
            pass

        # Check station_managers table
        if not role:
            try:
                manager_response = supabase_service_role.table("station_managers").select("id").eq("id", str(user_id)).execute()
                if manager_response.data:
                    role = "station_manager"
            except:
                pass

        # Default to app_user
        if not role:
            role = "app_user"

        # Fetch profile based on role
        if role == "admin":
            response = supabase_service_role.table("admins").select("*").eq("id", str(user_id)).single().execute()
        elif role == "station_manager":
            response = supabase_service_role.table("station_managers").select("*").eq("id", str(user_id)).single().execute()
        else:  # app_user
            response = supabase_service_role.table("profiles").select("*").eq("id", str(user_id)).single().execute()

        data = response.data
        if data:
            # Normalize data to match ProfileOut schema - handle NULL values
            phone_value = data.get('phone')
            profile_data = {
                'id': data.get('id'),
                'email': data.get('email') or '',
                'role': role,
                'name': data.get('name') or '',
                'phone': phone_value if phone_value is not None else '',  # Explicit None check
                'address': data.get('address'),
                'city': data.get('city'),
                'country': data.get('country'),
                'zip_code': data.get('zip_code')
            }
            print(f"Profile data before ProfileOut: {profile_data}")  # Debug
            return ProfileOut(**profile_data)
        return None

    except Exception as e:
        print(f"Error fetching user profile {user_id}: {e}")
        return None

async def create_user_profile(profile_data: ProfileCreate) -> Optional[ProfileOut]:
    try:
        supabase = await get_supabase_client()
        response = supabase.table("profiles").insert(profile_data.dict()).execute()
        created = (response.data or [None])[0]
        return ProfileOut(**created) if created else None
    except httpx.HTTPError as e:
        print(f"Error creating user profile: {e}")
        return None

async def update_user_profile(user_id: UUID, update_data: ProfileUpdate) -> Optional[ProfileOut]:
    try:
        supabase_service_role = await get_supabase_service_role_client()

        # First determine the user's role
        role = None

        # Check admins table
        try:
            admin_response = supabase_service_role.table("admins").select("id").eq("id", str(user_id)).execute()
            if admin_response.data:
                role = "admin"
        except:
            pass

        # Check station_managers table
        if not role:
            try:
                manager_response = supabase_service_role.table("station_managers").select("id").eq("id", str(user_id)).execute()
                if manager_response.data:
                    role = "station_manager"
            except:
                pass

        # Default to app_user
        if not role:
            role = "app_user"

        # Update based on role
        if role == "admin":
            response = supabase_service_role.table("admins").update(update_data.dict(exclude_unset=True)).eq("id", str(user_id)).execute()
        elif role == "station_manager":
            response = supabase_service_role.table("station_managers").update(update_data.dict(exclude_unset=True)).eq("id", str(user_id)).execute()
        else:  # app_user
            response = supabase_service_role.table("profiles").update(update_data.dict(exclude_unset=True)).eq("id", str(user_id)).execute()

        updated = (response.data or [None])[0]
        if updated:
            # Normalize data to match ProfileOut schema - handle NULL values
            profile_data = {
                'id': updated.get('id'),
                'email': updated.get('email', ''),
                'role': role,
                'name': updated.get('name', ''),
                'phone': updated.get('phone') or '',  # Convert None to empty string
                'address': updated.get('address') or None,
                'city': updated.get('city') or None,
                'country': updated.get('country') or None,
                'zip_code': updated.get('zip_code') or None
            }
            return ProfileOut(**profile_data)
        return None
    except httpx.HTTPError as e:
        print(f"Error updating user profile {user_id}: {e}")
        return None
