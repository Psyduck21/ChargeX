from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class BookingBase(BaseModel):
    booking_id: str
    vehicle_id: Optional[str] = None
    station_id: str
    user_id: str
    start_time: datetime
    end_time: Optional[datetime] = None
    status: str = "pending"  # pending, confirmed, cancelled, completed
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class BookingCreate(BaseModel):
    vehicle_id: Optional[str] = None
    station_id: str
    start_time: datetime
    end_time: Optional[datetime] = None
    status: str = "pending"


class BookingUpdate(BaseModel):
    vehicle_id: Optional[str] = None
    station_id: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    status: Optional[str] = None


class BookingOut(BookingBase):
    class Config:
        from_attributes = True
