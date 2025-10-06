import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

supabase: Client = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

# Minimal startup hook to ensure imports in main.py succeed
def init_db() -> None:
    """
    Placeholder for any database initialization logic (e.g., migrations, health checks).
    Currently a no-op to satisfy application startup.
    """
    return None
