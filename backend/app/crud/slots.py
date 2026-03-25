from typing import Any, Dict, List, Optional
from uuid import UUID
import httpx
from ..database import get_supabase_client


async def get_slot(slot_id: UUID) -> Optional[Dict[str, Any]]:
    try:
        supabase = await get_supabase_client()
        response =  supabase.table("charging_slots").select("*").eq("id", str(slot_id)).single().execute()
        return response.data
    except httpx.HTTPError as e:
        print(f"Error fetching slot {slot_id}: {e}")
        return None

async def list_station_slots(station_id: UUID) -> List[Dict[str, Any]]:
    try:
        supabase = await get_supabase_client()
        response =  supabase.table("charging_slots").select("*").eq("station_id", str(station_id)).execute()
        return response.data or []
    except httpx.HTTPError as e:
        print(f"Error listing slots for station {station_id}: {e}")
        return []

async def create_slot(slot_data) -> Optional[Dict[str, Any]]:
    try:
        supabase = await get_supabase_client()
        # Convert Pydantic model to dict if needed
        if hasattr(slot_data, 'model_dump'):
            slot_dict = slot_data.model_dump()
        else:
            slot_dict = slot_data

        # Convert UUID fields to strings for Supabase
        if 'station_id' in slot_dict and hasattr(slot_dict['station_id'], 'hex'):
            slot_dict['station_id'] = str(slot_dict['station_id'])

        response =  supabase.table("charging_slots").insert(slot_dict).execute()
        print("Create slot response:", response)
        print("Response data type:", type(response.data))
        print("Response data:", response.data)

        # Ensure we return a single dict, not a list
        if response.data and isinstance(response.data, list) and len(response.data) > 0:
            return response.data[0]
        elif response.data and isinstance(response.data, dict):
            return response.data
        else:
            return None
    except httpx.HTTPError as e:
        print(f"Error creating slot: {e}")
        return None

async def update_slot(slot_id: UUID, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    try:
        supabase = await get_supabase_client()
        response =  supabase.table("charging_slots").update(update_data).eq("id", str(slot_id)).execute()
        print("Update slot response:", response)
        print("Update response data type:", type(response.data))
        print("Update response data:", response.data)

        # Ensure we return a single dict, not a list
        if response.data and isinstance(response.data, list) and len(response.data) > 0:
            return response.data[0]
        elif response.data and isinstance(response.data, dict):
            return response.data
        else:
            return None
    except httpx.HTTPError as e:
        print(f"Error updating slot {slot_id}: {e}")
        return None

async def list_slots(station_ids: List[UUID]) -> List[Dict[str, Any]]:
    # If station_ids is empty, return all slots (router treats empty list as "all slots")
    try:
        supabase = await get_supabase_client()
        if not station_ids:
            response = supabase.table("charging_slots").select("*").execute()
            return response.data or []
        response =  supabase.table("charging_slots").select("*").in_("station_id", [str(s) for s in station_ids]).execute()
        return response.data or []
    except httpx.HTTPError as e:
        print(f"Error listing slots for stations {station_ids}: {e}")
        return []
