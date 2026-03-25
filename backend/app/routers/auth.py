from fastapi import APIRouter, HTTPException, status, Request, Depends
import logging
import os
import httpx
from ..dependencies import get_supabase_client, get_current_user

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/signup")
async def signup(request: Request):
    body = await request.json()
    email = body.get("email")
    password = body.get("password")

    if not email or not password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email and password required")

    try:
        supabase = await get_supabase_client()
        res = supabase.auth.sign_up({
            "email": email,
            "password": password,
            "options" : {
                "data" : {
                    "name": body.get("name"),
                    "phone": body.get("phone"),
                    "address": body.get("address"),
                    "city": body.get("city")
                }
            },
            
        })
        session = getattr(res, "session", None)
        user = getattr(res, "user", None)

        # Debug logging
        logger.info(f"[auth.signup] sign_up result session={'yes' if session else 'no'} user_id={getattr(user, 'id', None)} email={getattr(user, 'email', None)}")

        if not session or not user:
            raise Exception("Invalid login credentials")

        # Attempt to compute normalized user (role, station_ids) using existing dependency
        normalized = None
        try:
            # get_current_user expects the token param; call it directly
            normalized = await get_current_user(token=session.access_token)
        except Exception as e:
            logger.warning(f"[auth.login] failed to compute normalized user: {e}")

        # Build user payload merged with normalized info when available
        user_payload = {
            "id": user.id,
            "email": user.email,
            "name": user.user_metadata.get("name", ""),
            "phone": user.user_metadata.get("phone", ""),
            "city": user.user_metadata.get("city", ""),
            "address": user.user_metadata.get("address", "")
        }

        if normalized:
            # normalized contains id, role, station_ids
            user_payload["role"] = normalized.get("role")
            user_payload["station_ids"] = normalized.get("station_ids")

        return {
            "access_token": session.access_token,
            "refresh_token": session.refresh_token,
            "expires_in": session.expires_in,
            "token_type": session.token_type,
            "user": user_payload
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Signup failed: {e}")



@router.post("/login")
async def login(request: Request):
    body = await request.json()
    email = body.get("email")
    password = body.get("password")

    if not email or not password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email and password required")

    try:
        supabase = await get_supabase_client()
        res = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })

        session = getattr(res, "session", None)
        user = getattr(res, "user", None)

        # Debug logging
        logger.info(f"[auth.login] sign_in result session={'yes' if session else 'no'} user_id={getattr(user, 'id', None)} email={getattr(user, 'email', None)}")

        if not session or not user:
            raise Exception("Invalid login credentials")
        # Attempt to compute normalized user (role, station_ids)
        normalized = None
        try:
            normalized = await get_current_user(token=session.access_token)
        except Exception as e:
            logger.warning(f"[auth.login] failed to compute normalized user: {e}")

        user_payload = {
            "id": user.id,
            "email": user.email,
            "name": user.user_metadata.get("name", ""),
            "phone": user.user_metadata.get("phone", ""),
            "city": user.user_metadata.get("city", ""),
            "address": user.user_metadata.get("address", "")
        }

        if normalized:
            user_payload["role"] = normalized.get("role")
            user_payload["station_ids"] = normalized.get("station_ids")

        return {
            "access_token": session.access_token,
            "refresh_token": session.refresh_token,
            "expires_in": session.expires_in,
            "token_type": session.token_type,
            "user": user_payload
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Login failed: {e}")


@router.get("/me")
async def me(current_user: dict = Depends(get_current_user)):
    """Return normalized current user with role and station_ids."""
    logger.info(f"[auth.me] current_user id={current_user.get('id')} role={current_user.get('role')} stations={current_user.get('station_ids')}")
    return current_user


@router.post("/refresh")
async def refresh(request: Request):
    """Exchange a refresh token for a new session with Supabase and return normalized user."""
    body = await request.json()
    refresh_token = body.get("refresh_token")

    if not refresh_token:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="refresh_token required")

    SUPABASE_URL = os.getenv("SUPABASE_URL")
    SUPABASE_KEY = os.getenv("SUPABASE_KEY")

    if not SUPABASE_URL or not SUPABASE_KEY:
        raise HTTPException(status_code=500, detail="Supabase config not available")

    token_url = f"{SUPABASE_URL.rstrip('/')}/auth/v1/token?grant_type=refresh_token"

    async with httpx.AsyncClient() as client:
        headers = {"Content-Type": "application/json", "apikey": SUPABASE_KEY}
        resp = await client.post(token_url, json={"refresh_token": refresh_token}, headers=headers)

    if resp.status_code != 200:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    data = resp.json()
    access_token = data.get("access_token")

    normalized = None
    try:
        normalized = await get_current_user(token=access_token)
    except Exception as e:
        logger.warning(f"[auth.refresh] failed to compute normalized user: {e}")

    user_payload = None
    if normalized:
        user_payload = {
            "id": normalized.get("id"),
            "role": normalized.get("role"),
            "station_ids": normalized.get("station_ids"),
        }

    return {
        "access_token": data.get("access_token"),
        "refresh_token": data.get("refresh_token"),
        "expires_in": data.get("expires_in"),
        "token_type": data.get("token_type"),
        "user": user_payload or {}
    }
