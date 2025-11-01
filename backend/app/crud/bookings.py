from typing import Any, Dict, List, Optional
from uuid import UUID
import httpx
from ..database import get_supabase_client
from ..models import BookingCreate, BookingUpdate, BookingOut

async def get_booking(booking_id: UUID) -> Optional[BookingOut]:
    try:
        supabase = await get_supabase_client()
        response = supabase.table("bookings").select("*").eq("id", str(booking_id)).single().execute()
        data = response.data
        return BookingOut(**data) if data else None
    except httpx.HTTPError as e:
        print(f"Error fetching booking {booking_id}: {e}")
        return None

async def create_booking(booking_data: BookingCreate) -> Optional[BookingOut]:
    try:
        supabase = await get_supabase_client()
        response = supabase.table("bookings").insert(booking_data.dict()).execute()
        created = (response.data or [None])[0]
        return BookingOut(**created) if created else None
    except httpx.HTTPError as e:
        print(f"Error creating booking: {e}")
        return None

async def update_booking(booking_id: UUID, update_data: BookingUpdate) -> Optional[BookingOut]:
    try:
        supabase = await get_supabase_client()
        response = supabase.table("bookings").update(update_data.dict(exclude_unset=True)).eq("id", str(booking_id)).execute()
        updated = (response.data or [None])[0]
        return BookingOut(**updated) if updated else None
    except httpx.HTTPError as e:
        print(f"Error updating booking {booking_id}: {e}")
        return None

async def list_bookings(owner_id: UUID) -> List[BookingOut]:
    try:
        supabase = await get_supabase_client()
        response = supabase.table("bookings").select("*").eq("user_id", str(owner_id)).execute()
        items = response.data or []
        return [BookingOut(**item) for item in items]
    except httpx.HTTPError as e:
        print(f"Error listing bookings for owner {owner_id}: {e}")
        return []
