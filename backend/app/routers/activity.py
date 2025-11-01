from fastapi import APIRouter, Depends
from ..dependencies import get_current_user, require_admin
from ..database import get_supabase_client

router = APIRouter(prefix="/activity", tags=["Activity Logs"])

@router.get("/admin")
async def get_admin_activity(limit: int = 20, current_user: dict = Depends(require_admin)):
    """Get all activity logs for admin view"""
    supabase = await get_supabase_client()
    res = supabase.table("user_activity_log").select("*").order("created_at", desc=True).limit(limit).execute()
    return res.data

@router.get("/manager")
async def get_manager_activity(current_user: dict = Depends(get_current_user), limit: int = 20):
    """Get activity logs for current manager only"""
    supabase = await get_supabase_client()
    res = supabase.table("user_activity_log").select("*").eq("user_id", str(current_user["id"])).order("created_at", desc=True).limit(limit).execute()
    return res.data
