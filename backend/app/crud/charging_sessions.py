from typing import Any, Dict, List, Optional
from uuid import UUID
import httpx
from ..database import get_supabase_client


async def get_charging_session(session_id: UUID) -> Optional[Dict[str, Any]]:
    try:
        supabase = await get_supabase_client()
        response =  supabase.table("charging_sessions").select("*").eq("id", str(session_id)).single().execute()
        return response.data[0]
    except httpx.HTTPError as e:
        print(f"Error fetching charging session {session_id}: {e}")
        return None

async def create_charging_session(session_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    try:
        supabase = await get_supabase_client()
        response =  supabase.table("charging_sessions").insert(session_data).execute()
        if response.data:
            return response.data[0]
    except httpx.HTTPError as e:
        print(f"Error creating charging session: {e}")
        return None

async def update_charging_session(session_id: UUID, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    try:
        supabase = await get_supabase_client()
        response =  supabase.table("charging_sessions").update(update_data).eq("id", str(session_id)).execute()
        return response.data
    except httpx.HTTPError as e:
        print(f"Error updating charging session {session_id}: {e}")
        return None

async def list_charging_sessions(station_ids: List[UUID]) -> List[Dict[str, Any]]:
    if not station_ids:
        return []
    try:
        supabase = await get_supabase_client()
        response =  supabase.table("charging_sessions").select("*").in_("station_id", [str(s) for s in station_ids]).execute()
        return response.data or []
    except httpx.HTTPError as e:
        print(f"Error listing charging sessions for stations {station_ids}: {e}")
        return []

async def list_charging_sessions_between(station_ids: List[UUID], start_iso: str, end_iso: str) -> List[Dict[str, Any]]:
    if not station_ids:
        return []
    try:
        supabase = await get_supabase_client()
        response = (
             supabase.table("charging_sessions")
            .select("*")
            .in_("station_id", [str(s) for s in station_ids])
            .gte("start_time", start_iso)
            .lte("start_time", end_iso)
            .execute()
        )
        return response.data or []
    except httpx.HTTPError as e:
        print(f"Error listing charging sessions between {start_iso} and {end_iso}: {e}")
        return []
