# backend/app/dependencies.py

import os
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from supabase import create_client, Client
from dotenv import load_dotenv
from typing import Optional
from uuid import UUID

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
SECRET_KEY = os.getenv("SERVICE_ROLE")
if not SUPABASE_URL or not SUPABASE_KEY:
    raise Exception("Supabase URL or Key not set in .env")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

supabase_service_role: Client = create_client(SUPABASE_URL,SECRET_KEY)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_supabase_client() -> Client:
    """
    Return Supabase client instance
    """
    return supabase

def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    """
    Get current authenticated user from Supabase token and determine role from role tables.
    Role hierarchy: admin > station_manager > app_user
    """
    try:
        # Get user info from Supabase token
        user_response = supabase_service_role.auth.get_user(token)
        # print(user_response)
        print(user_response.user)
        user_obj = user_response.user
        if not user_obj or not getattr(user_obj, "id", None):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        user_id = user_obj.id
        print(user_id)
        # print(type(user_id))
        # Initialize defaults
        role = "app_user"
        station_ids = []

        # Check if user exists in admins table
        admin_response = supabase_service_role.table("admins").select("id").eq("id", user_id).execute()
        # print(admin_response)
        if admin_response.data:
            role = "admin"
        # # Temporary: Allow admin access for specific email
        # elif user_obj.email == "admin@smartevev.com":
        #     role = "admin"
        else:
            # Check if user exists in station_managers table
            manager_response = supabase.table("station_managers").select("*").eq("id", user_id).execute()
            if manager_response.data:
                role = "station_manager"
                station_ids = [m.get("station_id") for m in manager_response.data if m.get("station_id")]
            else:
                # Check if user exists in profiles table
                profile_response = supabase.table("profiles").select("id").eq("id", user_id).execute()
                if not profile_response.data:
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="User not found in any role table",
                        headers={"WWW-Authenticate": "Bearer"},
                    )

        return {
            "id": user_id,
            "role": role,
            "station_ids": station_ids
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate user: {e}",
            headers={"WWW-Authenticate": "Bearer"},
        )

def get_current_active_user(current_user: dict = Depends(get_current_user)) -> dict:
    """
    Ensure user is active (optional, you can check role too)
    """
    if current_user.get("disabled", False):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user",
        )
    return current_user


def require_admin(current_user: dict = Depends(get_current_active_user)) -> dict:
    """
    Require user to be admin
    """
    role = current_user.get("role", "")
    if role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required",
        )
    return current_user


def require_station_manager(current_user: dict = Depends(get_current_active_user)) -> dict:
    """Require user to be station manager based on normalized role."""
    role = current_user.get("role", "")
    if role != "station_manager":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Station Manager privileges required",
        )
    return current_user


def require_app_user(current_user: dict = Depends(get_current_active_user)) -> dict:
    """Require user to be regular app user based on normalized role."""
    role = current_user.get("role", "")
    if role != "app_user":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="App User privileges required",
        )
    return current_user
