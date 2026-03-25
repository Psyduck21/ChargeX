from typing import Any, Dict, List, Optional
from uuid import UUID
from supabase import create_client, AsyncClient
import asyncio
from ..database import get_supabase_client  # we'll define this helper
import math

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
        return False

async def find_nearest_station(station_id: str) -> Optional[Dict[str, Any]]:
    """Find the nearest station with available slots relative to the given station ID."""
    try:
        supabase = await get_supabase_client()
        # First, grab the target station coordinates
        target_resp = supabase.table("stations").select("latitude, longitude").eq("id", station_id).single().execute()
        target = target_resp.data
        if not target or target.get("latitude") is None or target.get("longitude") is None:
            return None
        
        target_lat = float(target["latitude"])
        target_lon = float(target["longitude"])

        # Fetch all other stations that are active and have available slots
        other_resp = supabase.table("stations").select("id, name, address, latitude, longitude, available_slots").gt("available_slots", 0).neq("id", station_id).execute()
        others = other_resp.data or []
        
        nearest = None
        min_dist = float('inf')

        # Haversine distance
        def haversine(lat1, lon1, lat2, lon2):
            R = 6371.0  # Earth radius in kilometers
            dlat = math.radians(lat2 - lat1)
            dlon = math.radians(lon2 - lon1)
            a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
            c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
            return R * c

        for st in others:
            if st.get("latitude") is None or st.get("longitude") is None:
                continue
            dist = haversine(target_lat, target_lon, float(st["latitude"]), float(st["longitude"]))
            if dist < min_dist:
                min_dist = dist
                nearest = st
                # attach distance property to hint to user
                nearest["distance_km"] = round(dist, 2)
                
        return nearest
        
    except Exception as e:
        print(f"❌ Error finding nearest station: {e}")
        return None
