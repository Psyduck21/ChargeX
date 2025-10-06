from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import HTMLResponse
from ..models import LoginRequest, SignupRequest, LoginResponse
from ..dependencies import get_supabase_client, get_current_user

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/signup", response_model=LoginResponse)
def signup(payload: SignupRequest):
    supabase = get_supabase_client()
    try:
        # Create user in Supabase Auth
        res = supabase.auth.sign_up({
            "email": payload.email,
            "password": payload.password,
        })
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Signup failed: {e}")

    # Check if user was created successfully
    user = getattr(res, "user", None)
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User creation failed")
    
    user_id = getattr(user, "id", "")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No user ID returned")
    
    # Check if session exists (might not exist if email confirmation is required)
    session = getattr(res, "session", None)
    token = None
    
    if session and hasattr(session, "access_token"):
        token = session.access_token
    else:
        # If no session (email confirmation required), we still create the user record
        # but return a message about email confirmation
        pass
    
    # Create user record in appropriate table based on role
    try:
        if payload.role == "admin":
            admin_data = {
                "id": user_id,
                "email": payload.email,
                "name": payload.name or "",
                "phone": "",
                "address": "",
                "city": ""
            }
            supabase.table("admins").insert(admin_data).execute()
        elif payload.role == "station_manager":
            # For station managers, we need a station_id - for now, we'll create without one
            # You might want to modify this to require station_id or handle it differently
            manager_data = {
                "id": user_id,
                "user_id": user_id,
                "email": payload.email,
                "name": payload.name or "",
                "phone": "",
                "address": "",
                "city": "",
                "station_id": None  # Will need to be assigned later
            }
            supabase.table("station_managers").insert(manager_data).execute()
        else:  # app_user
            profile_data = {
                "id": user_id,
                "email": payload.email,
                "name": payload.name or "",
                "phone": "",
                "address": "",
                "city": "",
            }
            supabase.table("profiles").insert(profile_data).execute()
    except Exception as e:
        # If table insert fails, we should clean up the auth user
        try:
            supabase.auth.admin.delete_user(user_id)
        except:
            pass
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Failed to create user record: {e}")
    
    # If no token (email confirmation required), return a special response
    if not token:
        return LoginResponse(
            access_token="", 
            user_id=user_id, 
            role=payload.role,
            token_type="email_confirmation_required"
        )
    
    return LoginResponse(access_token=token, user_id=user_id, role=payload.role)


@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest):
    supabase = get_supabase_client()
    try:
        res = supabase.auth.sign_in_with_password({
            "email": payload.email,
            "password": payload.password,
        })
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Login failed: {e}")

    if not getattr(res, "session", None) or not getattr(res.session, "access_token", None):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    token = res.session.access_token
    user = getattr(res, "user", None)
    user_id = getattr(user, "id", "") if user else ""
    
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="No user ID returned")
    
    # Determine role by checking which table the user exists in
    role = "app_user"  # default
    
    # Check if user is admin
    admin_response = supabase.table("admins").select("*").eq("id", str(user_id)).execute()
    if admin_response.data:
        role = "admin"
    else:
        # Check if user is station manager
        manager_response = supabase.table("station_managers").select("*").eq("user_id", str(user_id)).execute()
        if manager_response.data:
            role = "station_manager"
        else:
            # Check if user is regular app user (profiles table)
            profile_response = supabase.table("profiles").select("*").eq("id", str(user_id)).execute()
            if not profile_response.data:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found in any role table")
    
    return LoginResponse(access_token=token, user_id=user_id, role=role)


@router.post("/logout")
def logout():
    supabase = get_supabase_client()
    try:
        supabase.auth.sign_out()
    except Exception:
        pass
    return {"ok": True}


@router.get("/me")
def me(current_user = Depends(get_current_user)):
    return current_user


@router.get("/login-page", response_class=HTMLResponse)
def login_page():
    # Simple HTML form with both login and signup
    return """
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>SmartEV Login/Signup</title>
    <style>
      body { font-family: sans-serif; max-width: 420px; margin: 40px auto; }
      input, button, select { width: 100%; padding: 10px; margin: 8px 0; box-sizing: border-box; }
      .error { color: #b00020; }
      .success { color: #2e7d32; }
      .tabs { display: flex; margin-bottom: 20px; }
      .tab { flex: 1; padding: 10px; text-align: center; cursor: pointer; border: 1px solid #ccc; }
      .tab.active { background: #1976d2; color: white; }
      .form { display: none; }
      .form.active { display: block; }
    </style>
  </head>
  <body>
    <h2>SmartEV</h2>
    <div class="tabs">
      <div class="tab active" onclick="showForm('login')">Login</div>
      <div class="tab" onclick="showForm('signup')">Signup</div>
    </div>
    
    <form id="loginForm" class="form active">
      <input type="email" id="loginEmail" placeholder="Email" required />
      <input type="password" id="loginPassword" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
    
    <form id="signupForm" class="form">
      <input type="email" id="signupEmail" placeholder="Email" required />
      <input type="password" id="signupPassword" placeholder="Password" required />
      <input type="text" id="signupName" placeholder="Name (optional)" />
      <select id="signupRole">
        <option value="app_user">App User</option>
        <option value="station_manager">Station Manager</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit">Signup</button>
    </form>
    
    <div id="msg" class="error"></div>
    
    <script>
      function showForm(formType) {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.form').forEach(f => f.classList.remove('active'));
        document.querySelector(`.tab:nth-child(${formType === 'login' ? '1' : '2'})`).classList.add('active');
        document.getElementById(formType + 'Form').classList.add('active');
        document.getElementById('msg').textContent = '';
      }
      
      document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const msg = document.getElementById('msg');
        msg.textContent = '';
        msg.className = 'error';
        
        try {
          const res = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });
          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.detail || 'Login failed');
          }
          const data = await res.json();
          localStorage.setItem('token', data.access_token);
          msg.textContent = 'Logged in! Token saved to localStorage.';
          msg.className = 'success';
        } catch (err) {
          msg.textContent = err.message || String(err);
        }
      });
      
      document.getElementById('signupForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const name = document.getElementById('signupName').value;
        const role = document.getElementById('signupRole').value;
        const msg = document.getElementById('msg');
        msg.textContent = '';
        msg.className = 'error';
        
        try {
          const res = await fetch('/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name, role })
          });
          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.detail || 'Signup failed');
          }
          const data = await res.json();
          if (data.token_type === "email_confirmation_required") {
            msg.textContent = 'Account created! Please check your email to confirm your account before logging in.';
            msg.className = 'success';
          } else {
            localStorage.setItem('token', data.access_token);
            msg.textContent = 'Account created! Token saved to localStorage.';
            msg.className = 'success';
          }
        } catch (err) {
          msg.textContent = err.message || String(err);
        }
      });
    </script>
  </body>
</html>
"""

