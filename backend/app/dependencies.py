# backend/app/dependencies.py

import os
import logging
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from .database import get_supabase_client,get_supabase_service_role_client
from dotenv import load_dotenv
import inspect
from typing import Optional
from uuid import UUID

load_dotenv()

logger = logging.getLogger(__name__)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

async def get_current_user(token: Optional[str] = None, auth_token: str = Depends(oauth2_scheme)) -> dict:
    """
    Get current authenticated user from Supabase token and determine role from role tables.
    Role hierarchy: admin > station_manager > app_user
    """
    try:
        supabase =  await get_supabase_client()
        supabase_service_role =  await get_supabase_service_role_client()
        # Use provided token or token from header
        actual_token = token or auth_token
        # Get user info from Supabase token (handle both sync and able return)
        user_response = supabase_service_role.auth.get_user(actual_token)
        # Normalize response to a user object in a few possible shapes
        user_obj = None
        # Common shapes: object with .user, dict with 'user' or {'data': {'user': ...}}
        if hasattr(user_response, "user"):
            user_obj = user_response.user
        elif isinstance(user_response, dict):
            user_obj = user_response.get("user") or (user_response.get("data") or {}).get("user")
        elif hasattr(user_response, "data"):
            data = getattr(user_response, "data")
            if isinstance(data, dict):
                user_obj = data.get("user")
        # As a fallback, use the raw response
        if user_obj is None:
            user_obj = user_response
        if not user_obj or not getattr(user_obj, "id", None):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        user_id = user_obj.id
        logger.debug(f"[auth] user_id={user_id}")
        # Initialize defaults
        role = "app_user"
        station_ids = []

        # Try multiple ways to determine admin role:
        # 1) Check admins table by id
        # 2) Check admins table by email
        # 3) Check user's metadata for an explicit role
        # 4) Check environment ADMIN_EMAILS (comma-separated)

        # Extract email if available
        user_email = getattr(user_obj, "email", None) or (user_obj.get("email") if isinstance(user_obj, dict) else None)

        # 1) Check admins table by id
        admin_response = supabase_service_role.table("admins").select("id, email").eq("id", user_id).execute()
        if getattr(admin_response, "data", None):
            role = "admin"
        else:
            # 2) Check admins table by email (if email exists)
            if user_email:
                admin_by_email = supabase_service_role.table("admins").select("id, email").eq("email", user_email).execute()
                if getattr(admin_by_email, "data", None):
                    role = "admin"

        # 3) Check metadata for role claim
        if role != "admin":
            # Some Supabase user objects include app_metadata or user_metadata with role info
            meta_role = None
            if hasattr(user_obj, "app_metadata") and isinstance(getattr(user_obj, "app_metadata"), dict):
                meta_role = user_obj.app_metadata.get("role")
            if not meta_role and hasattr(user_obj, "user_metadata") and isinstance(getattr(user_obj, "user_metadata"), dict):
                meta_role = user_obj.user_metadata.get("role")
            if not meta_role and isinstance(user_obj, dict):
                meta_role = (user_obj.get("app_metadata") or {}).get("role") or (user_obj.get("user_metadata") or {}).get("role")
            logger.debug(f"[auth] meta_role={meta_role}")
            if meta_role == "admin":
                role = "admin"

        # 4) Check ADMIN_EMAILS env var
        if role != "admin" and user_email:
            admin_emails = os.getenv("ADMIN_EMAILS", "").split(",") if os.getenv("ADMIN_EMAILS") else []
            admin_emails = [e.strip().lower() for e in admin_emails if e.strip()]
            if user_email.lower() in admin_emails:
                role = "admin"

        # If still not admin, check station_managers by id or email
        if role != "admin":
            manager_response = supabase.table("station_managers").select("*").eq("id", user_id).execute()
            if not getattr(manager_response, "data", None) and user_email:
                # Try by email
                manager_response =  supabase.table("station_managers").select("*").eq("email", user_email).execute()
                logger.debug(f"[auth] station_managers by email response: {getattr(manager_response, 'data', None)}")

            if getattr(manager_response, "data", None):
                role = "station_manager"
                # Get station IDs from stations table where station_manager = user_id
                stations_response = supabase.table("stations").select("id").eq("station_manager", user_id).execute()
                station_ids = [s.get("id") for s in (stations_response.data or []) if s.get("id")]
            else:
                # Check if user exists in profiles table by id or email
                profile_response =  supabase.table("profiles").select("id").eq("id", user_id).execute()
                if not getattr(profile_response, "data", None) and user_email:
                    profile_response =  supabase.table("profiles").select("id").eq("email", user_email).execute()
                if not getattr(profile_response, "data", None):
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="User not found in any role table",
                        headers={"WWW-Authenticate": "Bearer"},
                    )

        # Log final role and station_ids
        logger.info(f"[auth] final role={role} station_ids={station_ids}")

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
    role = current_user.get("role", "")
    user_id = current_user.get("id", "unknown")
    logger.info(f"[auth] require_station_manager called for user {user_id} with role '{role}'")
    if role != "station_manager":
        logger.warning(f"[auth] Access denied for user {user_id}: role '{role}' is not station_manager")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Station Manager privileges required",
        )
    logger.info(f"[auth] Access granted for station_manager user {user_id}")
    return current_user


def require_admin_or_manager(current_user: dict = Depends(get_current_active_user)) -> dict:
    """Require user to be admin or station manager"""
    role = current_user.get("role", "")
    user_id = current_user.get("id", "unknown")
    logger.info(f"[auth] require_admin_or_manager called for user {user_id} with role '{role}'")
    if role not in ["admin", "station_manager"]:
        logger.warning(f"[auth] Access denied for user {user_id}: role '{role}' not authorized")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin or Station Manager privileges required",
        )
    logger.info(f"[auth] Access granted for {role} user {user_id}")
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
