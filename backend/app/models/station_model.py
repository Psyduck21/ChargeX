from pydantic import BaseModel
from typing import Optional


class StationBase(BaseModel):
    name: str
    address: str
    city: str
    country: Optional[str] = None
    zip_code: Optional[str] = None
    state: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    capacity: Optional[int] = None
    available_slots: Optional[int] = None
    status: Optional[str] = "active"


class StationCreate(StationBase):
    pass


class StationUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    zip_code: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    capacity: Optional[int] = None
    available_slots: Optional[int] = None
    status: Optional[str] = None
    

class StationOut(StationBase):
    id: str
    station_manager: Optional[str] = None

    class Config:
        from_attributes = True
