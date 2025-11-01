from pydantic import BaseModel
from typing import Optional


class VehicleBase(BaseModel):
    make: str
    model: str
    year: int
    battery_capacity_kwh: Optional[float] = None


class VehicleCreate(VehicleBase):
    owner_id: Optional[str] = None


class VehicleUpdate(BaseModel):
    make: Optional[str] = None
    model: Optional[str] = None
    year: Optional[int] = None
    battery_capacity_kwh: Optional[float] = None


class VehicleOut(VehicleBase):
    id: str
    owner_id: str

    class Config:
        from_attributes = True


