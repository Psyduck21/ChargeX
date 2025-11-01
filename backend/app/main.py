from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.exceptions import RequestValidationError
import time
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.exceptions import HTTPException as StarletteHTTPException
import os
from dotenv import load_dotenv
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Import routers
from .routers import (
    auth,
    profiles,
    vehicles,
    stations,
    station_managers,
    slots,
    bookings,
    charging_sessions,
    feedback,
    activity,
    admin,
    analytics
)
from .database import init_db

load_dotenv()

# Verify environment variables
required_env_vars = ["SUPABASE_URL", "SUPABASE_KEY", "SERVICE_ROLE"]
missing_vars = [var for var in required_env_vars if not os.getenv(var)]
if missing_vars:
    raise ValueError(f"Missing required environment variables: {', '.join(missing_vars)}")

logger.info("Environment variables loaded successfully")
logger.info(f"SUPABASE_URL: {os.getenv('SUPABASE_URL')}")

# Rate limiting middleware
class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, calls: int = 100, period: int = 60):
        super().__init__(app)
        self.calls = calls
        self.period = period
        self.clients = {}

    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host
        current_time = time.time()

        # Clean up old entries
        self.clients = {ip: data for ip, data in self.clients.items()
                       if current_time - data['start_time'] < self.period}

        # Check if client exists and create/update record
        if client_ip not in self.clients:
            self.clients[client_ip] = {
                'calls': 1,
                'start_time': current_time
            }
        else:
            client = self.clients[client_ip]
            # Reset if period has passed
            if current_time - client['start_time'] >= self.period:
                client['calls'] = 1
                client['start_time'] = current_time
            else:
                client['calls'] += 1

            # Check if rate limit exceeded
            if client['calls'] > self.calls:
                return JSONResponse(
                    status_code=429,
                    content={"detail": "Rate limit exceeded. Please try again later."}
                )

        return await call_next(request)

app = FastAPI(
    title="SmartEV Backend API",
    description="Backend API for SmartEV system with stations, vehicles, bookings, charging, and feedback",
    version="1.0.0",
)

# Allow CORS for frontend access - Enhanced with environment variables
origins = [
    "http://localhost",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
]

# Add production origins from environment
if os.getenv("PRODUCTION_FRONTEND_URL"):
    origins.append(os.getenv("PRODUCTION_FRONTEND_URL"))

# Add security middlewares
app.add_middleware(RateLimitMiddleware, calls=100, period=60)  # 100 requests per minute
app.add_middleware(TrustedHostMiddleware, allowed_hosts=["*"])  # Replace with your domains in production

# Add CORS middleware with enhanced security
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],  # Explicit methods
    allow_headers=[
        "Authorization",
        "Content-Type",
        "Access-Control-Allow-Headers",
        "Access-Control-Allow-Origin",
        "Access-Control-Allow-Methods"
    ],
    max_age=3600,  # Cache preflight requests for 1 hour
)

# Include all routers
app.include_router(auth.router)
app.include_router(profiles.router)
app.include_router(vehicles.router)
app.include_router(stations.router)
app.include_router(station_managers.router)
app.include_router(slots.router)
app.include_router(bookings.router)
app.include_router(charging_sessions.router)
app.include_router(feedback.router)
app.include_router(activity.router)
app.include_router(admin.router)
app.include_router(analytics.router)

@app.on_event("startup")
def startup_event():
    """
    Initialize database and any other startup tasks
    """
    init_db()
    print("✅ Database initialized and FastAPI startup complete.")

@app.get("/")
def root():
    return {"message": "SmartEV Backend API is running 🚀"}
