from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import routers
from .routers import (
    auth,
    profiles,
    vehicles,
    stations,
    slots,
    bookings,
    charging_sessions,
    station_managers,
    feedback
)

from .database import init_db

app = FastAPI(
    title="SmartEV Backend API",
    description="Backend API for SmartEV system with stations, vehicles, bookings, charging, and feedback",
    version="1.0.0",
)

# Allow CORS for frontend access
origins = [
    "http://localhost",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routers
app.include_router(profiles.router)
app.include_router(vehicles.router)
app.include_router(stations.router)
app.include_router(station_managers.router)
app.include_router(slots.router)
app.include_router(bookings.router)
app.include_router(charging_sessions.router)
app.include_router(feedback.router)
app.include_router(auth.router)

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
