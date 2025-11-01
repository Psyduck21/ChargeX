from typing import Any, Dict, List, Optional
from uuid import UUID
import httpx
from ..database import get_supabase_client


async def get_feedback(feedback_id: UUID) -> Optional[Dict[str, Any]]:
    try:
        supabase = await get_supabase_client()
        response =  supabase.table("feedback").select("*").eq("id", str(feedback_id)).single().execute()
        return response.data
    except httpx.HTTPError as e:
        print(f"Error fetching feedback {feedback_id}: {e}")
        return None

async def create_feedback(feedback_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    try:
        supabase = await get_supabase_client()
        response =  supabase.table("feedback").insert(feedback_data).execute()
        return response.data
    except httpx.HTTPError as e:
        print(f"Error creating feedback: {e}")
        return None

async def update_feedback(feedback_id: UUID, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    try:
        supabase = await get_supabase_client()
        response =  supabase.table("feedback").update(update_data).eq("id", str(feedback_id)).execute()
        return response.data
    except httpx.HTTPError as e:
        print(f"Error updating feedback {feedback_id}: {e}")
        return None

async def list_station_feedback(station_id: UUID) -> List[Dict[str, Any]]:
    try:
        supabase = await get_supabase_client()
        response =  supabase.table("feedback").select("*").eq("station_id", str(station_id)).execute()
        return response.data or []
    except httpx.HTTPError as e:
        print(f"Error listing feedback for station {station_id}: {e}")
        return []

async def list_feedback(station_ids: List[UUID]) -> List[Dict[str, Any]]:
    if not station_ids:
        return []
    try:
        supabase = await get_supabase_client()
        response =  supabase.table("feedback").select("*").in_("station_id", [str(s) for s in station_ids]).execute()
        return response.data or []
    except httpx.HTTPError as e:
        print(f"Error listing feedback for stations {station_ids}: {e}")
        return []