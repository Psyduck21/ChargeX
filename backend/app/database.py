# backend/app/database.py

import os
from supabase import create_client, Client  # ✅ use create_client, not async
from supabase.lib.client_options import ClientOptions
from dotenv import load_dotenv

# Load env vars
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SERVICE_ROLE")

options = ClientOptions(
    auto_refresh_token=True,
    persist_session=False,
)

# Create singleton instances
_supabase_client = None
_supabase_service_role_client = None

def check_env_vars():
    """Check if required environment variables are set."""
    if not SUPABASE_URL:
        raise ValueError("SUPABASE_URL environment variable is not set")
    if not SUPABASE_KEY:
        raise ValueError("SUPABASE_KEY environment variable is not set")
    if not SUPABASE_SERVICE_ROLE_KEY:
        raise ValueError("SUPABASE_SERVICE_ROLE_KEY environment variable is not set")

# --- Regular client ---
async def get_supabase_client() -> Client:
    """Return regular Supabase client."""
    global _supabase_client
    if not _supabase_client:
        check_env_vars()
        print(f"Initializing Supabase client with URL: {SUPABASE_URL}")
        _supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY, options=options)
    return _supabase_client

# --- Service role client ---
async def get_supabase_service_role_client() -> Client:
    """Return service-role Supabase client."""
    global _supabase_service_role_client
    if not _supabase_service_role_client:
        check_env_vars()
        print(f"Initializing Supabase service role client with URL: {SUPABASE_URL}")
        _supabase_service_role_client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, options=options)
    return _supabase_service_role_client

# --- Init DB (optional startup test) ---
def init_db():
    """Initialize Supabase connection."""
    _ = create_client(SUPABASE_URL, SUPABASE_KEY, options=options)
    print("✅ Supabase client initialized.")