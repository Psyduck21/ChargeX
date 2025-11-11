from typing import Any, Dict, List, Optional
from uuid import UUID
import httpx
from ..database import get_supabase_client
from ..models import AdminCreate, AdminUpdate, AdminOut, ProfileOut

async def list_profiles() -> List[ProfileOut]:
    """Get all user profiles."""
    try:
        supabase = await get_supabase_client()
        response = supabase.table("profiles").select("*").execute()
        data = response.data or []
        return [ProfileOut(**profile) for profile in data]
    except httpx.HTTPError as e:
        print(f"Error fetching user profiles: {e}")
        return []


async def get_admin(admin_id: UUID) -> Optional[AdminOut]:
    try:
        supabase = await get_supabase_client()
        response = supabase.table("admins").select("*").eq("id", str(admin_id)).single().execute()
        data = response.data
        return AdminOut(**data) if data else None
    except httpx.HTTPError as e:
        print(f"Error fetching admin {admin_id}: {e}")
        return None

async def create_admin(admin_data: AdminCreate) -> Optional[AdminOut]:
    try:
        supabase = await get_supabase_client()
        response = supabase.table("admins").insert(admin_data.dict()).execute()
        created = (response.data or [None])[0]
        return AdminOut(**created) if created else None
    except httpx.HTTPError as e:
        print(f"Error creating admin: {e}")
        return None

async def update_admin(admin_id: UUID, update_data: AdminUpdate) -> Optional[AdminOut]:
    try:
        supabase = await get_supabase_client()
        response = supabase.table("admins").update(update_data.dict(exclude_unset=True)).eq("id", str(admin_id)).execute()
        updated = (response.data or [None])[0]
        return AdminOut(**updated) if updated else None
    except httpx.HTTPError as e:
        print(f"Error updating admin {admin_id}: {e}")
        return None

async def list_admins() -> List[AdminOut]:
    try:
        supabase = await get_supabase_client()
        response = supabase.table("admins").select("*").execute()
        items = response.data or []
        return [AdminOut(list_profiles**item) for item in items]
    except httpx.HTTPError as e:
        print(f"Error listing admins: {e}")
        return []
