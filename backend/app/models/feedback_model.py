from pydantic import BaseModel
from typing import Optional


class FeedbackBase(BaseModel):
    station_id: str
    user_id: str
    rating: int  # 1-5
    comment: Optional[str] = None


class FeedbackCreate(FeedbackBase):
    pass


class FeedbackUpdate(BaseModel):
    rating: Optional[int] = None
    comment: Optional[str] = None


class FeedbackOut(FeedbackBase):
    id: str

    class Config:
        from_attributes = True
