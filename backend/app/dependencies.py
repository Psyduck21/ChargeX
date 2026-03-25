# backend/app/dependencies.py

import os
import logging
import asyncio
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

        # 3) Check metadata for role claim (fast, no queries)
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

        # 4) Check ADMIN_EMAILS env var (fast, no queries)
        if role != "admin" and user_email:
            admin_emails = os.getenv("ADMIN_EMAILS", "").split(",") if os.getenv("ADMIN_EMAILS") else []
            admin_emails = [e.strip().lower() for e in admin_emails if e.strip()]
            if user_email.lower() in admin_emails:
                role = "admin"

        # If still not admin, perform parallel database queries to check roles
        if role != "admin":
            # Prepare queries with timeouts to prevent hanging on Supabase issues
            # Supabase queries are synchronous, so run them in threads with timeouts
            loop = asyncio.get_event_loop()

            tasks = [
                asyncio.wait_for(
                    loop.run_in_executor(None, lambda: supabase_service_role.table("admins").select("id").eq("id", user_id).execute()),
                    timeout=10.0
                ),
                asyncio.wait_for(
                    loop.run_in_executor(None, lambda: supabase.table("station_managers").select("*").eq("id", user_id).execute()),
                    timeout=10.0
                ),
                asyncio.wait_for(
                    loop.run_in_executor(None, lambda: supabase.table("profiles").select("id").eq("id", user_id).execute()),
                    timeout=10.0
                ),
            ]

            if user_email:
                tasks.extend([
                    asyncio.wait_for(
                        loop.run_in_executor(None, lambda: supabase_service_role.table("admins").select("id").eq("email", user_email).execute()),
                        timeout=10.0
                    ),
                    asyncio.wait_for(
                        loop.run_in_executor(None, lambda: supabase.table("station_managers").select("*").eq("email", user_email).execute()),
                        timeout=10.0
                    ),
                    asyncio.wait_for(
                        loop.run_in_executor(None, lambda: supabase.table("profiles").select("id").eq("email", user_email).execute()),
                        timeout=10.0
                    ),
                ])

            # Run queries in parallel with timeouts
            results = await asyncio.gather(*tasks, return_exceptions=True)

            # Unpack results
            admin_id_result = results[0]
            manager_id_result = results[1]
            profile_id_result = results[2]

            admin_email_result = None
            manager_email_result = None
            profile_email_result = None

            if user_email:
                admin_email_result = results[3]
                manager_email_result = results[4]
                profile_email_result = results[5]

            # Handle exceptions in results
            for i, result in enumerate(results):
                if isinstance(result, Exception):
                    logger.warning(f"[auth] Query {i} failed: {result}")
                    results[i] = None

            # Check admin role from queries
            admin_found = (
                (admin_id_result and getattr(admin_id_result, "data", None)) or
                (user_email and admin_email_result and getattr(admin_email_result, "data", None))
            )
            if admin_found:
                role = "admin"
            else:
                # Check station manager
                manager_data = (
                    (manager_id_result and getattr(manager_id_result, "data", None)) or
                    (user_email and manager_email_result and getattr(manager_email_result, "data", None))
                )
                if manager_data:
                    role = "station_manager"
                    # Get station IDs from stations table where station_manager = user_id (with timeout)
                    stations_response = await asyncio.wait_for(
                        loop.run_in_executor(None, lambda: supabase.table("stations").select("id").eq("station_manager", user_id).execute()),
                        timeout=10.0
                    )
                    station_ids = [s.get("id") for s in (stations_response.data or []) if s.get("id")]
                    logger.debug(f"[auth] station_managers found: {manager_data}")
                else:
                    # Check if user exists in profiles table by id or email
                    profile_exists = (
                        (profile_id_result and getattr(profile_id_result, "data", None)) or
                        (user_email and profile_email_result and getattr(profile_email_result, "data", None))
                    )
                    if not profile_exists:
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
