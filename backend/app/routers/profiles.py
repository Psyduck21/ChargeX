from fastapi import APIRouter, Depends, HTTPException, status
from typing import Any, Dict, List
from uuid import UUID
import logging

logger = logging.getLogger(__name__)

from ..dependencies import get_current_user, require_admin
from ..crud import get_user_profile, update_user_profile, get_all_users
from ..models.profile_model import ProfileOut, ProfileUpdate
from ..database import get_supabase_service_role_client

router = APIRouter(
    prefix="/profiles",
    tags=["Profiles"]
)

@router.get("/", response_model=List[ProfileOut])
async def get_all_profiles(current_user: Dict = Depends(require_admin)):
    """List all user profiles. Admin only."""
    profiles = await get_all_users()
    return profiles

@router.get("/me", response_model=ProfileOut)
async def get_my_profile(current_user: Any = Depends(get_current_user)):
    """Get the current user's profile."""
    logger.info(f"[profiles.me] current_user id={current_user.get('id')} role={current_user.get('role')}")
    profile = await get_user_profile(UUID(current_user["id"]))

    if not profile:
        logger.warning(f"[profiles.me] No profile found for user {current_user['id']}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )

    # Successfully retrieved profile - log the response
    response_json = profile.model_dump_json()
    logger.info(f"[profiles.me] final response: {response_json}")
    return profile

@router.get("/{profile_id}", response_model=ProfileOut)
async def read_profile(
    profile_id: UUID,
    current_user: Any = Depends(get_current_user)
):
    """
    Retrieve a user profile by its ID.
    Users can view their own profile.
    Admins can view any profile.
    """

    # Fetch profile
    profile = await get_user_profile(profile_id)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found."
        )

    # Extract current user info
    current_id = (
        current_user.get("id")
        if isinstance(current_user, dict)
        else getattr(current_user, "id", None)
    )
    role = (
        current_user.get("role")
        if isinstance(current_user, dict)
        else getattr(current_user, "role", None)
    )

    # Check permissions
    if str(profile.get("id")) != str(current_id) and role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to view this profile."
        )

    return profile


@router.put("/me", response_model=ProfileOut)
async def update_my_profile(
    update_data: Dict[str, Any],
    current_user: Any = Depends(get_current_user)
):
    """
    Update the current user's profile.
    """
    profile_id = current_user["id"]
    # Perform update
    updated_profile = await update_user_profile(profile_id, ProfileUpdate(**update_data))
    if not updated_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found or update failed."
        )

    return updated_profile


@router.post("/me/change-password")
async def change_my_password(
    request: Dict[str, Any],
    current_user: Any = Depends(get_current_user)
):
    """
    Change the current user's password using Supabase Admin API.
    """
    new_password = request.get("new_password")

    if not new_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password is required"
        )

    try:
        logger.info(f"[profiles.me] Password change request received for user {current_user['id']}")

        # Use Supabase Admin API to update user password directly
        supabase_admin = await get_supabase_service_role_client()
        update_response = supabase_admin.auth.admin.update_user_by_id(
            current_user["id"],
            {"password": new_password}
        )

        if not update_response.user:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update password via Supabase"
            )

        return {"message": "Password changed successfully"}

    except Exception as supabase_error:
        logger.error(f"[profiles.me] Supabase password update failed: {supabase_error}")
        # If Supabase update fails, we'll return an error
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update password"
        )


@router.put("/{profile_id}", response_model=ProfileOut)
async def update_profile_endpoint(
    profile_id: UUID,
    update_data: Dict[str, Any],
    current_user: Any = Depends(get_current_user)
):
    """
    Update a user profile.
    Users can update their own profile.
    Admins can update any profile.
    """

    # Extract current user info
    current_id = (
        current_user.get("id")
        if isinstance(current_user, dict)
        else getattr(current_user, "id", None)
    )
    role = (
        current_user.get("role")
        if isinstance(current_user, dict)
        else getattr(current_user, "role", None)
    )

    # Check permissions
    if str(profile_id) != str(current_id) and role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to update this profile."
        )

    # Perform update
    updated_profile = await update_user_profile(profile_id, ProfileUpdate(**update_data))
    if not updated_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found or update failed."
        )

    return updated_profile
