from pydantic import BaseModel
from typing import Optional


class ChargingSessionBase(BaseModel):
    vehicle_id: str
    station_id: str
    slot: str
    user_id: Optional[str] = None
    start_time: str  # ISO 8601
    end_time: Optional[str] = None
    energy_consumed: Optional[float] = None
    cost: Optional[float] = None


class ChargingSessionCreate(ChargingSessionBase):
    pass


class ChargingSessionUpdate(BaseModel):
    end_time: Optional[str] = None
    energy_consumed: Optional[float] = None
    cost: Optional[float] = None


class ChargingSessionOut(ChargingSessionBase):
    id: str

    class Config:
        from_attributes = True
