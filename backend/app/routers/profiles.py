from fastapi import APIRouter, Depends, HTTPException
from typing import List
from uuid import UUID
from ..dependencies import get_current_user, require_admin
from ..models import UserProfile
from ..crud import get_user_profile, update_user_profile

router = APIRouter(prefix="/profiles", tags=["Profiles"])

@router.get("/{profile_id}", response_model=UserProfile)
def read_profile(profile_id: UUID, current_user = Depends(get_current_user)):
    profile = get_user_profile(profile_id)
    current_id = current_user.get("id") if isinstance(current_user, dict) else getattr(current_user, "id", None)
    role = current_user.get("role") if isinstance(current_user, dict) else getattr(current_user, "role", None)
    if profile and profile.get("id") != str(current_id) and role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    return profile

@router.put("/{profile_id}")
def update_profile_endpoint(profile_id: UUID, update_data: dict, current_user = Depends(get_current_user)):
    current_id = current_user.get("id") if isinstance(current_user, dict) else getattr(current_user, "id", None)
    role = current_user.get("role") if isinstance(current_user, dict) else getattr(current_user, "role", None)
    if profile_id != current_id and role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    return update_user_profile(profile_id, update_data)
