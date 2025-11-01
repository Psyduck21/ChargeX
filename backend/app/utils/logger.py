from datetime import datetime
from ..database import get_supabase_client

async def log_activity(user_id, user_name, role, action, description, station_name=None, extra=None):
    """Insert an activity record into Supabase."""
    try:
        supabase = await get_supabase_client()
        data = {
            "user_id": user_id,
            "user_name": user_name,
            "role": role,
            "action": action,
            "description": description,
            "station_name": station_name,
            "extra": extra,
            "created_at": datetime.utcnow().isoformat(),
        }
        response = supabase.table("user_activity_log").insert(data).execute()
        print(f"[LOGGED] {role.upper()} - {action} - {user_name}")
        return response.data
    except Exception as e:
        print("Error logging activity:", e)
        return None
