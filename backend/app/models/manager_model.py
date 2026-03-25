from pydantic import BaseModel, EmailStr
from typing import Optional
from enum import Enum

class ManagerRole(str, Enum):
    station_manager = "station_manager" 

class ManagerBase(BaseModel):
    name: str
    phone: str
    address: str
    city: str
    country: str
    state: str
    zip_code: str

class ManagerCreate(ManagerBase):
    """Used when creating a station manager."""
    email: EmailStr
    role: Optional[ManagerRole] = ManagerRole.station_manager

class ManagerUpdate(BaseModel):
    """For updating station manager info."""
    name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None

class ManagerOut(ManagerBase):
    """Returned to client"""
    id: str
    email: EmailStr
    role: ManagerRole

    class Config:
        from_attributes = True
