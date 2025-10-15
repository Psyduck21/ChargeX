from fastapi import APIRouter, HTTPException, status, Request, Depends
from ..dependencies import get_supabase_client, get_current_user

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/signup")
async def signup(request: Request):
    body = await request.json()
    email = body.get("email")
    password = body.get("password")

    if not email or not password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email and password required")

    # metadata = {

    #     "name": body.get("name"),
    #     "phone": body.get("phone"),
    #     "address": body.get("address"),
    #     "city": body.get("city")
    # }
    supabase = get_supabase_client()

    # 1. Create user in Supabase Auth
    try:
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

        if not session or not user:
            raise Exception("Invalid login credentials")

        return {
            "access_token": session.access_token,
            "refresh_token": session.refresh_token,
            "expires_in": session.expires_in,
            "token_type": session.token_type,
            "user": {
                "id": user.id,
                "email": user.email,
                "name": user.user_metadata.get("name", ""),
                "phone": user.user_metadata.get("phone", ""),
                "city": user.user_metadata.get("city", ""),
                "address": user.user_metadata.get("address", "")
            }
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

    supabase = get_supabase_client()

    try:
        res = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })

        session = getattr(res, "session", None)
        user = getattr(res, "user", None)

        if not session or not user:
            raise Exception("Invalid login credentials")

        return {
            "access_token": session.access_token,
            "refresh_token": session.refresh_token,
            "expires_in": session.expires_in,
            "token_type": session.token_type,
            "user": {
                "id": user.id,
                "email": user.email,
                "name": user.user_metadata.get("name", ""),
                "phone": user.user_metadata.get("phone", ""),
                "city": user.user_metadata.get("city", ""),
                "address": user.user_metadata.get("address", "")
            }
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Login failed: {e}")


@router.get("/me")
def me(current_user: dict = Depends(get_current_user)):
    """Return normalized current user with role and station_ids."""
    return current_user
