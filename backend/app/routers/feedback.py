from fastapi import APIRouter, Depends, HTTPException
from typing import List
from ..dependencies import get_current_user
from ..models import Feedback, FeedbackCreate
from ..crud import list_feedback, create_feedback

router = APIRouter(prefix="/feedback", tags=["Feedback"])

@router.get("/", response_model=List[Feedback])
def get_feedback_items(current_user = Depends(get_current_user)):
    role = current_user.get("role") if isinstance(current_user, dict) else getattr(current_user, "role", None)
    if role not in ["station_manager", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    station_ids = current_user.get("station_ids", []) if isinstance(current_user, dict) else getattr(current_user, "station_ids", [])
    return list_feedback(station_ids)

@router.post("/", response_model=Feedback)
def add_feedback(feedback: FeedbackCreate, current_user = Depends(get_current_user)):
    setattr(feedback, "user_id", current_user["id"] if isinstance(current_user, dict) else current_user.id)
    return create_feedback(feedback)
