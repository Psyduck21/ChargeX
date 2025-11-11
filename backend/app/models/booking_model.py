from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class BookingBase(BaseModel):
    # Accept DB 'id' field as alias for booking_id so BookingOut(**db_row) works
    booking_id: str = Field(..., alias='id')
    vehicle_id: Optional[str] = None
    station_id: str
    user_id: str
    start_time: datetime
    end_time: Optional[datetime] = None
    status: str = "pending"  # pending, accepted, cancelled, completed, rejected
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class BookingCreate(BaseModel):
    vehicle_id: Optional[str] = None
    station_id: str
    slot_id: str
    user_id: Optional[str] = None
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
