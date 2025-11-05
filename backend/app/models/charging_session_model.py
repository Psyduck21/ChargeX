from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ChargingSessionBase(BaseModel):
    session_id: str
    booking_id: str  # Links to the booking that created this session
    vehicle_id: str
    station_id: str
    user_id: str
    start_time: datetime
    end_time: Optional[datetime] = None
    energy_consumed: Optional[float] = None
    cost: Optional[float] = None
    status: str = "active"  # active, completed, cancelled
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class ChargingSessionCreate(BaseModel):
    booking_id: str  # Required when creating a session from a booking
    vehicle_id: str
    station_id: str
    start_time: datetime
    end_time: Optional[datetime] = None
    energy_consumed: Optional[float] = None
    cost: Optional[float] = None
    status: str = "active"


class ChargingSessionUpdate(BaseModel):
    end_time: Optional[datetime] = None
    energy_consumed: Optional[float] = None
    cost: Optional[float] = None
    status: Optional[str] = None


class ChargingSessionOut(ChargingSessionBase):
    class Config:
        from_attributes = True
