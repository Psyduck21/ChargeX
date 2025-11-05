from pydantic import BaseModel
from typing import Optional
from datetime import date


class VehicleBase(BaseModel):
    plate_number: str
    vehicle_type: str  # '2_wheeler','4_wheeler','bus','truck'
    brand: str
    model: str
    color: Optional[str] = None
    battery_capacity_kwh: Optional[float] = None
    range_km: Optional[int] = None
    charging_connector: Optional[str] = None
    last_service_date: Optional[date] = None


class VehicleCreate(VehicleBase):
    owner_id: Optional[str] = None


class VehicleUpdate(BaseModel):
    plate_number: Optional[str] = None
    vehicle_type: Optional[str] = None
    brand: Optional[str] = None
    model: Optional[str] = None
    color: Optional[str] = None
    battery_capacity_kwh: Optional[float] = None
    range_km: Optional[int] = None
    charging_connector: Optional[str] = None
    last_service_date: Optional[date] = None


class VehicleOut(VehicleBase):
    id: str
    owner_id: str
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    class Config:
        from_attributes = True
