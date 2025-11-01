from pydantic import BaseModel
from typing import Optional


class SlotBase(BaseModel):
    station_id: str
    connector_type: str
    max_power_kw: float
    is_available: bool = True


class SlotCreate(SlotBase):
    pass


class SlotUpdate(BaseModel):
    connector_type: Optional[str] = None
    max_power_kw: Optional[float] = None
    is_available: Optional[bool] = None


class SlotOut(SlotBase):
    id: str

    class Config:
        from_attributes = True
