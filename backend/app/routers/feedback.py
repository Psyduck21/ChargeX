from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any

from ..dependencies import get_current_user
from ..crud import list_feedback, create_feedback
from ..models import FeedbackCreate, FeedbackOut

router = APIRouter(
    prefix="/feedback",
    tags=["Feedback"]
)


@router.get("/", response_model=List[FeedbackOut])
async def get_feedback_items(current_user=Depends(get_current_user)):
    """
    Retrieve feedback items.
    Only station managers and admins can list feedback.
    """
    # Extract user role
    role = (
        current_user.get("role")
        if isinstance(current_user, dict)
        else getattr(current_user, "role", None)
    )

    if role not in ["station_manager", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to view feedback."
        )

    # Retrieve station IDs linked to the current user
    station_ids = (
        current_user.get("station_ids", [])
        if isinstance(current_user, dict)
        else getattr(current_user, "station_ids", [])
    )

    return await list_feedback(station_ids)


@router.post("/", response_model=FeedbackOut)
async def add_feedback(feedback: FeedbackCreate, current_user=Depends(get_current_user)):
    """
    Submit feedback as an authenticated user.
    """
    # Get the current user's ID
    user_id = (
        current_user.get("id")
        if isinstance(current_user, dict)
        else getattr(current_user, "id", None)
    )

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unable to identify the user."
        )

    # Attach the user ID to the feedback
    payload = feedback.dict()
    payload["user_id"] = str(user_id)
    created = await create_feedback(FeedbackCreate(**payload))
    return created
