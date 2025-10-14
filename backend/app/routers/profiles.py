from fastapi import APIRouter, Depends, HTTPException, status
from typing import Any, Dict
from uuid import UUID

from ..dependencies import get_current_user
from ..crud import get_user_profile, update_user_profile

router = APIRouter(
    prefix="/profiles",
    tags=["Profiles"]
)


@router.get("/{profile_id}", response_model=Dict[str, Any])
def read_profile(
    profile_id: UUID,
    current_user: Any = Depends(get_current_user)
):
    """
    Retrieve a user profile by its ID.
    Users can view their own profile.
    Admins can view any profile.
    """

    # Fetch profile
    profile = get_user_profile(profile_id)
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


@router.put("/{profile_id}", response_model=Dict[str, Any])
def update_profile_endpoint(
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
    updated_profile = update_user_profile(profile_id, update_data)
    if not updated_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found or update failed."
        )

    return updated_profile
