# schemas/profile.py
from pydantic import BaseModel, EmailStr
from typing import Optional
from enum import Enum

class UserRole(str, Enum):
    admin = "admin"
    station_manager = "station_manager"
    app_user = "app_user"

class ProfileBase(BaseModel):
    name: str
    phone: str
    address: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    zip_code: Optional[str] = None

class ProfileCreate(ProfileBase):
    """Used when normal users sign up."""
    email: EmailStr
    role: Optional[UserRole] = UserRole.app_user   # default for user signups

class ProfileUpdate(BaseModel):
    """For users updating their info."""
    name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    zip_code: Optional[str] = None

class ProfileOut(ProfileBase):
    """Returned to client"""
    id: str
    email: EmailStr
    role: UserRole

    class Config:
        from_attributes = True
