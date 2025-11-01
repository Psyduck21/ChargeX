from typing import Any, Dict, List, Optional
from uuid import UUID
from supabase import create_client, AsyncClient
import asyncio
from ..database import get_supabase_client  # we'll define this helper

# Get the async Supabase client


async def create_station(station_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Create a new charging station (async)."""
    try:
        supabase = await get_supabase_client()
        response = supabase.table("stations").insert(station_data).execute()
        return response.data[0] if response.data else None
    except Exception as e:
        print(f"❌ Error creating station: {e}")
        return None


async def get_station(station_id: UUID) -> Optional[Dict[str, Any]]:
    """Fetch a station by its ID (async)."""
    try:
        supabase = await get_supabase_client()
        response = supabase.table("stations").select("*").eq("id", str(station_id)).single().execute()
        # print(f"Fetched station {station_id}: {response.data}")
        return response.data if response.data else None
    except Exception as e:
        print(f"❌ Error fetching station {station_id}: {e}")
        return None


async def update_station(station_id: UUID, update_data: Dict[str, Any]) -> Optional[List[Dict[str, Any]]]:
    """Update an existing station (async)."""
    try:
        supabase = await get_supabase_client()

        # Handle manager assignment if provided
        manager_id = update_data.pop('manager_id', None)
        if manager_id:
            # First assign the manager to the station
            assign_response = supabase.table("stations").update({"station_manager": str(manager_id)}).eq("id", str(station_id)).execute()
            print(f"Assigned manager {manager_id} to station {station_id}")

        # Update the station with remaining data
        response = supabase.table("stations").update(update_data).eq("id", str(station_id)).execute()
        return response.data if response.data else None
    except Exception as e:
        print(f"❌ Error updating station {station_id}: {e}")
        return None


async def delete_station(station_id: UUID) -> Optional[Dict[str, Any]]:
    """Delete a station (async)."""
    try:
        supabase = await get_supabase_client()
        supabase.table("stations").delete().eq("id", str(station_id)).execute()
        return {"message": "Station deleted successfully"}
    except Exception as e:
        print(f"❌ Error deleting station {station_id}: {e}")
        return False
