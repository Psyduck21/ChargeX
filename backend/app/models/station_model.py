from pydantic import BaseModel
from typing import Optional, List, Dict, Any


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
    total_slots: Optional[int] = None
    price_per_hour: Optional[float] = None
    charger_types: Optional[List[str]] = None
    connector_types: Optional[List[Dict[str, Any]]] = None
    amenities: Optional[List[str]] = None
    image: Optional[str] = None
    is_open: Optional[bool] = True
    open_hours: Optional[str] = "24/7"
    photos: Optional[List[str]] = None
    rating: Optional[float] = None
    reviews: Optional[int] = None
    status: Optional[str] = "active"


class StationCreate(BaseModel):
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
    total_slots: Optional[int] = None
    price_per_hour: Optional[float] = None
    charger_types: Optional[List[str]] = None
    connector_types: Optional[List[Dict[str, Any]]] = None
    amenities: Optional[List[str]] = None
    image: Optional[str] = None
    is_open: Optional[bool] = None
    open_hours: Optional[str] = None
    photos: Optional[List[str]] = None
    rating: Optional[float] = None
    reviews: Optional[int] = None
    status: Optional[str] = None
    

class StationOut(StationBase):
    id: str
    station_manager: Optional[str] = None

    class Config:
        from_attributes = True
