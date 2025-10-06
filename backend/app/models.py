# pydantic models
from pydantic import BaseModel,EmailStr
from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import Field
from datetime import date
# AUTH MODELS
class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    name: Optional[str] = ""


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str


# USER PROFILE MODELS
class UserBase(BaseModel):
    email: EmailStr
    name: Optional[str] = ""
    phone: Optional[str] = ""
    address: Optional[str] = ""
    city: Optional[str] = ""


class UserCreate(UserBase):
    password: str


class UserProfile(UserBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

# ADMIN/STATION MANAGER MODELS
class AdminBase(BaseModel):
    email: EmailStr
    name: str
    phone: Optional[str] = ""
    address: Optional[str] = ""
    city: Optional[str] = ""


class StationManagerBase(AdminBase):
    station_id: UUID


class Admin(AdminBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class StationManager(StationManagerBase):
    id: UUID
    user_id: UUID
    assigned_at: datetime

    class Config:
        orm_mode = True 


# VEHICLE MODELS
class VehicleBase(BaseModel):
    name: str
    model: str
    registration_number: str
    battery_capacity: float = Field(..., description="Battery capacity in kWh")


class VehicleCreate(VehicleBase):
    owner_id: UUID


class Vehicle(VehicleBase):
    id: UUID
    owner_id: UUID
    registered_at: datetime
    last_service_date: Optional[date]
    status: str

    class Config:
        orm_mode = True

#STATION MODELS
class StationBase(BaseModel):
    name: str
    latitude: float
    longitude: float
    address: Optional[str]
    city: Optional[str]
    state: Optional[str]
    country: Optional[str] = "India"
    zip_code: Optional[str]
    capacity: int = 10
    available_slots: int = 10
    status: str = "active"


class StationCreate(StationBase):
    pass


class Station(StationBase):
    station_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

#CHARGER MODELS
class SlotBase(BaseModel):
    station_id: UUID
    slot_number: int
    status: str = "available"


class SlotCreate(SlotBase):
    pass


class Slot(SlotBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

#BOOKING MODELS
class BookingBase(BaseModel):
    vehicle_id: UUID
    station_id: UUID
    slot_id: Optional[int]
    start_time: datetime
    end_time: Optional[datetime]
    status: str = "booked"


class BookingCreate(BookingBase):
    pass


class Booking(BookingBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
    
#CHARGING SESSION MODELS
class ChargingSessionBase(BaseModel):
    booking_id: int
    vehicle_id: UUID
    station_id: UUID
    slot_id: int
    energy_consumed: float = Field(..., description="kWh")
    start_time: datetime
    end_time: Optional[datetime]
    status: str = "ongoing"


class ChargingSessionCreate(ChargingSessionBase):
    pass


class ChargingSession(ChargingSessionBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

#FEEDBACK MODELS
class FeedbackBase(BaseModel):
    user_id: UUID
    station_id: Optional[UUID]
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str]


class FeedbackCreate(FeedbackBase):
    pass


class Feedback(FeedbackBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True