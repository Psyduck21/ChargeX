from typing import Any, Dict, List, Optional
from uuid import UUID
import httpx
from ..database import get_supabase_client


async def get_slot(slot_id: UUID) -> Optional[Dict[str, Any]]:
    try:
        supabase = await get_supabase_client()
        response =  supabase.table("slots").select("*").eq("id", str(slot_id)).single().execute()
        return response.data
    except httpx.HTTPError as e:
        print(f"Error fetching slot {slot_id}: {e}")
        return None

async def list_station_slots(station_id: UUID) -> List[Dict[str, Any]]:
    try:
        supabase = await get_supabase_client()
        response =  supabase.table("slots").select("*").eq("station_id", str(station_id)).execute()
        return response.data or []
    except httpx.HTTPError as e:
        print(f"Error listing slots for station {station_id}: {e}")
        return []

async def create_slot(slot_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    try:
        supabase = await get_supabase_client()
        response =  supabase.table("slots").insert(slot_data).execute()
        return response.data[0] if response.data else None
    except httpx.HTTPError as e:
        print(f"Error creating slot: {e}")
        return None

async def update_slot(slot_id: UUID, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    try:
        supabase = await get_supabase_client()
        response =  supabase.table("slots").update(update_data).eq("id", str(slot_id)).execute()
        return response.data
    except httpx.HTTPError as e:
        print(f"Error updating slot {slot_id}: {e}")
        return None

async def list_slots(station_ids: List[UUID]) -> List[Dict[str, Any]]:
    if not station_ids:
        return []
    try:
        supabase = await get_supabase_client()
        response =  supabase.table("slots").select("*").in_("station_id", [str(s) for s in station_ids]).execute()
        return response.data or []
    except httpx.HTTPError as e:
        print(f"Error listing slots for stations {station_ids}: {e}")
        return []
