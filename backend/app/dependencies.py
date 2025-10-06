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

if not SUPABASE_URL or not SUPABASE_KEY:
    raise Exception("Supabase URL or Key not set in .env")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_supabase_client() -> Client:
    """
    Return Supabase client instance
    """
    return supabase


def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    """
    Get current authenticated user from Supabase token and determine role from separate tables
    """
    try:
        user_response = supabase.auth.get_user(token)
        if user_response.user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        user_obj = user_response.user
        user_id = getattr(user_obj, "id", None)
        
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid user ID",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Check which table the user exists in to determine role
        role = "app_user"  # default
        station_ids = []
        
        # Check if user is admin
        admin_response = supabase.table("admins").select("*").eq("id", str(user_id)).execute()
        if admin_response.data:
            role = "admin"
        else:
            # Check if user is station manager
            manager_response = supabase.table("station_managers").select("*").eq("user_id", str(user_id)).execute()
            if manager_response.data:
                role = "station_manager"
                # Get station_ids from station_managers table
                station_ids = [manager.get("station_id") for manager in manager_response.data if manager.get("station_id")]
            else:
                # Check if user is regular app user (profiles table)
                profile_response = supabase.table("profiles").select("*").eq("id", str(user_id)).execute()
                if not profile_response.data:
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="User not found in any role table",
                        headers={"WWW-Authenticate": "Bearer"},
                    )
        
        # Normalize shape expected by routers
        normalized = {
            "id": user_id,
            "role": role,
            "station_ids": station_ids,
        }
        return normalized
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
    role = current_user.get("user_metadata", {}).get("role", "")
    if role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required",
        )
    return current_user


def require_station_manager(current_user: dict = Depends(get_current_active_user)) -> dict:
    """
    Require user to be station manager
    """
    role = current_user.get("user_metadata", {}).get("role", "")
    if role != "station_manager":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Station Manager privileges required",
        )
    return current_user


def require_app_user(current_user: dict = Depends(get_current_active_user)) -> dict:
    """
    Require user to be regular app user
    """
    role = current_user.get("user_metadata", {}).get("role", "")
    if role != "app_user":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="App User privileges required",
        )
    return current_user
