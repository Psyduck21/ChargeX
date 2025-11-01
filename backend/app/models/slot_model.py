from pydantic import BaseModel
from typing import Optional
from uuid import UUID


class SlotBase(BaseModel):
    station_id: UUID
    slot_number: int
    charger_type: str
    status: str
    connector_type: str
    max_power_kw: float
    is_available: bool = True
    last_used: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


class SlotCreate(SlotBase):
    pass


class SlotUpdate(BaseModel):
    station_id: Optional[UUID] = None
    slot_number: Optional[int] = None
    charger_type: Optional[str] = None
    status: Optional[str] = None
    connector_type: Optional[str] = None
    max_power_kw: Optional[float] = None
    is_available: Optional[bool] = None


class SlotOut(SlotBase):
    id: str

    class Config:
        from_attributes = True
