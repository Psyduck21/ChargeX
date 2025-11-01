"""Aggregate re-exports for CRUD functions used by routers."""

# Vehicles
from .vehicles import (
    get_vehicle,
    create_vehicle,
    update_vehicle,
    list_user_vehicles,
)

# Profiles
from .profiles import (
    get_user_profile,
    create_user_profile,
    update_user_profile,
)

# Bookings
from .bookings import (
    get_booking,
    create_booking,
    update_booking,
    list_bookings,
)

# Slots
from .slots import (
    get_slot,
    list_station_slots,
    create_slot,
    update_slot,
    list_slots,
)

# Charging Sessions
from .charging_sessions import (
    get_charging_session,
    create_charging_session,
    update_charging_session,
    list_charging_sessions,
    list_charging_sessions_between,
)

# Station Managers
from .station_manager import (
    get_station_manager,
    create_station_manager,
    update_station_manager,
    assign_manager_to_station,
    get_manager_stations,
    get_manager_bookings,
    get_manager_sessions,
)

# Stations
from .station import (
    create_station,
    get_station,
    update_station,
    delete_station,
)

# Feedback
from .feedback import (
    get_feedback,
    create_feedback,
    update_feedback,
    list_feedback,
    list_station_feedback,
)

# Admins
from .admin import (
    get_admin,
    create_admin,
    update_admin,
    list_admins,
)

# Statistics helpers
from .statistics import (
    get_admin_statistics,
    get_all_users,
    get_stations_with_managers,
    list_stations,
    list_station_managers,
    list_managers_for_station,
    get_all_station_managers,
    get_user_growth_over_time,
    get_energy_consumption_trends,
    get_revenue_trends,
    get_bookings_trends,
    get_station_utilization,
    get_charging_type_distribution,
    get_peak_hours,
    get_active_sessions_count,
    get_average_session_duration,
    calculate_co2_saved,
    log_user_activity,
    get_recent_activity
)

__all__ = [
    # Vehicles
    "get_vehicle", "create_vehicle", "update_vehicle", "list_user_vehicles",
    # Profiles
    "get_user_profile", "create_user_profile", "update_user_profile",
    # Bookings
    "get_booking", "create_booking", "update_booking", "list_bookings",
    # Slots
    "get_slot", "list_station_slots", "create_slot", "update_slot", "list_slots",
    # Charging Sessions
    "get_charging_session", "create_charging_session", "update_charging_session",
    "list_charging_sessions", "list_charging_sessions_between",
    # Station Managers
    "get_station_manager", "create_station_manager", "update_station_manager",
    "list_station_managers", "list_managers_for_station", "assign_manager_to_station",
    "get_all_station_managers", "get_manager_stations", "get_manager_bookings", "get_manager_sessions",
    # Stations
    "list_stations", "create_station", "get_station", "update_station", "delete_station",
    # Feedback
    "get_feedback", "create_feedback", "update_feedback", "list_feedback", "list_station_feedback",
    # Admins
    "get_admin", "create_admin", "update_admin", "list_admins",
    # Statistics
    "get_admin_statistics", "get_all_users", "get_stations_with_managers",
    "get_user_growth_over_time", "get_energy_consumption_trends", "get_revenue_trends",
    "get_bookings_trends", "get_station_utilization", "get_charging_type_distribution", "get_peak_hours",
    "get_active_sessions_count", "get_average_session_duration", "calculate_co2_saved",
    "log_user_activity", "get_recent_activity",
]
