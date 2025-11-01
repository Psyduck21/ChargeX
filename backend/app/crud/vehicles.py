from typing import Any, Dict, List, Optional
from uuid import UUID
import httpx
from ..database import get_supabase_client
from ..models import VehicleCreate, VehicleUpdate, VehicleOut


async def get_vehicle(vehicle_id: UUID) -> Optional[VehicleOut]:
    try:
        supabase = await get_supabase_client()
        response = await supabase.table("vehicles").select("*").eq("id", str(vehicle_id)).single().execute()
        data = response.data
        return VehicleOut(**data) if data else None
    except httpx.HTTPError as e:
        print(f"Error fetching vehicle {vehicle_id}: {e}")
        return None

async def create_vehicle(vehicle_data: VehicleCreate) -> Optional[VehicleOut]:
    try:
        supabase = await get_supabase_client()
        response = await supabase.table("vehicles").insert(vehicle_data.dict()).execute()
        created = (response.data or [None])[0]
        return VehicleOut(**created) if created else None
    except httpx.HTTPError as e:
        print(f"Error creating vehicle: {e}")
        return None

async def update_vehicle(vehicle_id: UUID, update_data: VehicleUpdate) -> Optional[VehicleOut]:
    try:
        supabase = await get_supabase_client()
        response = await supabase.table("vehicles").update(update_data.dict(exclude_unset=True)).eq("id", str(vehicle_id)).execute()
        updated = (response.data or [None])[0]
        return VehicleOut(**updated) if updated else None
    except httpx.HTTPError as e:
        print(f"Error updating vehicle {vehicle_id}: {e}")
        return None

async def list_user_vehicles(owner_id: UUID) -> List[VehicleOut]:
    try:
        supabase = await get_supabase_client()
        response = await supabase.table("vehicles").select("*").eq("owner_id", str(owner_id)).execute()
        items = response.data or []
        return [VehicleOut(**item) for item in items]
    except httpx.HTTPError as e:
        print(f"Error listing vehicles for owner {owner_id}: {e}")
        return []