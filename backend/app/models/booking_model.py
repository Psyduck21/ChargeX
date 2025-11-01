from pydantic import BaseModel
from typing import Optional


class BookingBase(BaseModel):
    user_id: str
    station_id: str
    slot_id: str
    vehicle_id: Optional[str] = None
    start_time: str  # ISO 8601
    end_time: Optional[str] = None
    status: str = "pending"  # pending, confirmed, canceled, completed


class BookingCreate(BookingBase):
    pass


class BookingUpdate(BaseModel):
    slot_id: Optional[str] = None
    vehicle_id: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    status: Optional[str] = None


class BookingOut(BookingBase):
    id: str

    class Config:
        from_attributes = True
