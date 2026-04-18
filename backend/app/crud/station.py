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

async def find_stations_by_coordinates(target_lat: float, target_lon: float, exclude_station_id: Optional[str] = None, limit: int = 3, sort_by: str = "distance") -> List[Dict[str, Any]]:
    """Generic utility to find stations near coordinates. Can optionally exclude a specific station ID."""
    try:
        supabase = await get_supabase_client()

        # Fetch full station details with all relevant fields
        active_sessions_response = supabase.table("charging_sessions").select("slot_id").is_("end_time", None).execute()
        occupied_slot_ids = {
            str(session.get("slot_id"))
            for session in (active_sessions_response.data or [])
            if session.get("slot_id")
        }

        # Query all slots and optionally filter out the excluded station ID
        slots_query = supabase.table("charging_slots").select("id, station_id, is_available, status, max_power_kw")
        if exclude_station_id:
            slots_query = slots_query.neq("station_id", exclude_station_id)
        slots_response = slots_query.execute()
        slots = slots_response.data or []

        station_available_counts = {}
        for slot in slots:
            sid = slot.get("station_id")
            if not sid:
                continue
            slot_id = str(slot.get("id"))
            is_available = slot.get("is_available", False)
            status = (slot.get("status") or "").lower()
            if not is_available:
                continue
            if status in ["maintenance", "disabled", "out_of_order"]:
                continue
            if slot_id in occupied_slot_ids:
                continue

            sid_str = str(sid)
            station_available_counts[sid_str] = station_available_counts.get(sid_str, 0) + 1

        # Query all stations and optionally filter out the excluded station ID
        stations_query = supabase.table("stations").select(
            "id, name, address, city, country, zip_code, latitude, longitude, total_slots, "
            "price_per_hour"
        )
        if exclude_station_id:
            stations_query = stations_query.neq("id", exclude_station_id)
        other_resp = stations_query.execute()
        others = other_resp.data or []
        
        def haversine(lat1, lon1, lat2, lon2):
            R = 6371.0
            dlat = math.radians(lat2 - lat1)
            dlon = math.radians(lon2 - lon1)
            a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
            c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
            return R * c

        valid_stations = []
        for st in others:
            db_capacity = st.get("total_slots")
            if db_capacity is not None:
                st["total_slots"] = db_capacity

            station_id_str = str(st.get("id"))
            available_count = station_available_counts.get(station_id_str, 0)
            if available_count <= 0:
                continue
            if st.get("latitude") is None or st.get("longitude") is None:
                continue
            dist = haversine(target_lat, target_lon, float(st["latitude"]), float(st["longitude"]))
            st["distance_km"] = round(dist, 2)
            st["available_slots"] = available_count
            
            # max_power_kw is not in the stations table (it's slot-level data)
            # Set a safe default; sort_by='power' will treat all equally here
            st["max_power_kw"] = 0
            
            valid_stations.append(st)
        
        # Sort based on the sort_by parameter    
        if sort_by == "power":
            valid_stations.sort(key=lambda x: x.get("max_power_kw", 0), reverse=True)
        else:
            valid_stations.sort(key=lambda x: x["distance_km"])
        
        return valid_stations[:limit]

    except Exception as e:
        print(f"❌ Error finding stations by coordinates: {e}")
        return []

async def find_nearest_station(station_id: str) -> Optional[Dict[str, Any]]:
    """Find the nearest station with available slots relative to the given station ID."""
    try:
        supabase = await get_supabase_client()
        target_resp = supabase.table("stations").select("latitude, longitude").eq("id", station_id).single().execute()
        target = target_resp.data
        if not target or target.get("latitude") is None or target.get("longitude") is None:
            return None
        
        target_lat = float(target["latitude"])
        target_lon = float(target["longitude"])
        
        nearest_list = await find_stations_by_coordinates(
            target_lat=target_lat, 
            target_lon=target_lon, 
            exclude_station_id=station_id, 
            limit=1
        )
        return nearest_list[0] if nearest_list else None
        
    except Exception as e:
        print(f"❌ Error finding nearest station: {e}")
        return None

async def find_nearby_stations(station_id: str, limit: int = 3, sort_by: str = "distance") -> List[Dict[str, Any]]:
    """Find nearby stations with available slots relative to the given station ID, sorted by distance or power."""
    try:
        supabase = await get_supabase_client()
        target_resp = supabase.table("stations").select("latitude, longitude").eq("id", station_id).single().execute()
        target = target_resp.data
        if not target or target.get("latitude") is None or target.get("longitude") is None:
            return []
            
        target_lat = float(target["latitude"])
        target_lon = float(target["longitude"])

        return await find_stations_by_coordinates(
            target_lat=target_lat,
            target_lon=target_lon,
            exclude_station_id=station_id,
            limit=limit,
            sort_by=sort_by
        )
    except Exception as e:
        print(f"❌ Error finding nearby stations: {e}")
        return []
