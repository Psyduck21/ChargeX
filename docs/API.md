# ChargeX API Documentation

## Overview

The ChargeX API is a RESTful service built with FastAPI that provides comprehensive endpoints for managing electric vehicle charging stations, user bookings, and charging sessions.

**Base URL**: `http://localhost:8000` (development)  
**API Version**: 1.0.0  
**Authentication**: Bearer Token (JWT)

## Authentication

All API endpoints (except signup/login) require authentication via JWT tokens.

### Headers
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

## Endpoints

### Authentication

#### POST /auth/signup
Register a new user account.

**Request Body:**
```json
{
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
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600,
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "+1234567890",
    "city": "New York",
    "address": "123 Main St"
  }
}
```

#### POST /auth/login
Authenticate user and receive access token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600,
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "+1234567890",
    "city": "New York",
    "address": "123 Main St"
  }
}
```

#### GET /auth/me
Get current authenticated user information.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "id": "uuid",
  "role": "app_user",
  "station_ids": []
}
```

### Station Management

#### GET /stations/
List all charging stations.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Downtown Charging Station",
    "city": "New York",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "capacity": 10,
    "available_slots": 8,
    "status": "active",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

#### POST /stations/
Create a new charging station. (Admin only)

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "name": "New Charging Station",
  "city": "Los Angeles",
  "latitude": 34.0522,
  "longitude": -118.2437,
  "capacity": 15
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "New Charging Station",
  "city": "Los Angeles",
  "latitude": 34.0522,
  "longitude": -118.2437,
  "capacity": 15,
  "available_slots": 15,
  "status": "active",
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### PUT /stations/{station_id}
Update an existing station. (Admin only)

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "name": "Updated Station Name",
  "capacity": 20
}
```

#### DELETE /stations/{station_id}
Delete a station. (Admin only)

**Headers:** `Authorization: Bearer <admin_token>`

**Response:** `204 No Content`

#### GET /stations/{station_id}/managers
Get managers assigned to a specific station. (Admin only)

**Headers:** `Authorization: Bearer <admin_token>`

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Manager Name",
    "email": "manager@example.com",
    "phone": "+1234567890",
    "station_id": "station_uuid"
  }
]
```

#### POST /stations/{station_id}/assign_manager
Assign a manager to a station. (Admin only)

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "user_id": "manager_uuid"
}
```

### Admin Dashboard Endpoints

#### GET /stations/admin/statistics
Get system-wide statistics. (Admin only)

**Headers:** `Authorization: Bearer <admin_token>`

**Response:**
```json
{
  "total_users": 150,
  "total_stations": 25,
  "total_managers": 12,
  "total_bookings": 450,
  "total_sessions": 380
}
```

#### GET /stations/admin/stations-with-managers
Get all stations with their assigned managers. (Admin only)

**Headers:** `Authorization: Bearer <admin_token>`

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Station Name",
    "city": "City",
    "managers": [
      {
        "id": "uuid",
        "name": "Manager Name",
        "email": "manager@example.com"
      }
    ]
  }
]
```

#### GET /stations/admin/users
Get all registered users. (Admin only)

**Headers:** `Authorization: Bearer <admin_token>`

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "User Name",
    "email": "user@example.com",
    "phone": "+1234567890",
    "role": "app_user"
  }
]
```

### Booking System

#### GET /bookings/
Get bookings for the current user.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "id": "uuid",
    "user_id": "user_uuid",
    "station_id": "station_uuid",
    "slot_id": "slot_uuid",
    "start_time": "2024-01-01T10:00:00Z",
    "end_time": "2024-01-01T12:00:00Z",
    "status": "confirmed",
    "created_at": "2024-01-01T09:00:00Z"
  }
]
```

#### POST /bookings/
Create a new booking.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "station_id": "station_uuid",
  "slot_id": "slot_uuid",
  "start_time": "2024-01-01T10:00:00Z",
  "end_time": "2024-01-01T12:00:00Z"
}
```

**Response:**
```json
{
  "id": "uuid",
  "user_id": "user_uuid",
  "station_id": "station_uuid",
  "slot_id": "slot_uuid",
  "start_time": "2024-01-01T10:00:00Z",
  "end_time": "2024-01-01T12:00:00Z",
  "status": "confirmed",
  "created_at": "2024-01-01T09:00:00Z"
}
```

### Charging Sessions

#### GET /charging_sessions/
Get charging sessions accessible to the current user.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "id": "uuid",
    "station_id": "station_uuid",
    "user_id": "user_uuid",
    "vehicle_id": "vehicle_uuid",
    "started_at": "2024-01-01T10:00:00Z",
    "ended_at": "2024-01-01T12:00:00Z",
    "energy_consumed": 25.5,
    "cost": 12.75,
    "status": "completed"
  }
]
```

#### POST /charging_sessions/
Create a new charging session. (Manager/Admin only)

**Headers:** `Authorization: Bearer <manager_or_admin_token>`

**Request Body:**
```json
{
  "station_id": "station_uuid",
  "user_id": "user_uuid",
  "vehicle_id": "vehicle_uuid",
  "started_at": "2024-01-01T10:00:00Z"
}
```

#### GET /charging_sessions/analytics/consumption
Get consumption analytics for a date range. (Admin only)

**Headers:** `Authorization: Bearer <admin_token>`

**Query Parameters:**
- `start`: Start date (ISO format)
- `end`: End date (ISO format)

**Response:**
```json
[
  {
    "id": "uuid",
    "station_id": "station_uuid",
    "started_at": "2024-01-01T10:00:00Z",
    "energy_consumed": 25.5,
    "cost": 12.75
  }
]
```

### User Profiles

#### GET /profiles/
Get user profile information.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "user@example.com",
  "phone": "+1234567890",
  "address": "123 Main St",
  "city": "New York",
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### PUT /profiles/
Update user profile.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Updated Name",
  "phone": "+0987654321",
  "address": "456 New St"
}
```

### Vehicle Management

#### GET /vehicles/
Get vehicles for the current user.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "id": "uuid",
    "owner_id": "user_uuid",
    "make": "Tesla",
    "model": "Model 3",
    "year": 2023,
    "license_plate": "ABC123",
    "battery_capacity": 75
  }
]
```

#### POST /vehicles/
Add a new vehicle.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "make": "Tesla",
  "model": "Model Y",
  "year": 2024,
  "license_plate": "XYZ789",
  "battery_capacity": 80
}
```

### Station Managers

#### GET /station_managers/
Get all station managers. (Admin only)

**Headers:** `Authorization: Bearer <admin_token>`

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Manager Name",
    "email": "manager@example.com",
    "phone": "+1234567890",
    "station": {
      "id": "station_uuid",
      "name": "Station Name"
    }
  }
]
```

#### POST /station_managers/
Create a new station manager. (Admin only)

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "name": "New Manager",
  "email": "newmanager@example.com",
  "phone": "+1234567890",
  "station_id": "station_uuid"
}
```

### Feedback System

#### GET /feedback/
Get feedback for stations accessible to the current user.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "id": "uuid",
    "station_id": "station_uuid",
    "user_id": "user_uuid",
    "rating": 5,
    "comment": "Great charging experience!",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

#### POST /feedback/
Submit feedback for a station.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "station_id": "station_uuid",
  "rating": 5,
  "comment": "Excellent service and fast charging!"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "detail": "Missing required field: name"
}
```

### 401 Unauthorized
```json
{
  "detail": "Invalid authentication credentials"
}
```

### 403 Forbidden
```json
{
  "detail": "Admin privileges required"
}
```

### 404 Not Found
```json
{
  "detail": "Station not found"
}
```

### 422 Validation Error
```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error"
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:
- **Authentication endpoints**: 10 requests per minute
- **General endpoints**: 100 requests per minute
- **Admin endpoints**: 200 requests per minute

## Webhooks

The API supports webhooks for real-time notifications:

### Available Events
- `booking.created` - New booking created
- `booking.cancelled` - Booking cancelled
- `session.started` - Charging session started
- `session.completed` - Charging session completed
- `station.status_changed` - Station status updated

### Webhook Payload Example
```json
{
  "event": "booking.created",
  "timestamp": "2024-01-01T10:00:00Z",
  "data": {
    "booking_id": "uuid",
    "user_id": "uuid",
    "station_id": "uuid"
  }
}
```

## SDKs and Libraries

### JavaScript/TypeScript
```javascript
// Example API client usage
const response = await fetch('/api/stations/', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
const stations = await response.json();
```

### Python
```python
import requests

headers = {
    'Authorization': f'Bearer {token}',
    'Content-Type': 'application/json'
}

response = requests.get('/api/stations/', headers=headers)
stations = response.json()
```

## Testing

### Postman Collection
A Postman collection is available for testing all endpoints. Import the collection and set up environment variables for easy testing.

### cURL Examples
```bash
# Login
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'

# Get stations
curl -X GET "http://localhost:8000/stations/" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Changelog

### v1.0.0
- Initial API release
- Authentication system
- Station management
- Booking system
- Charging sessions
- Admin dashboard endpoints

---

For more information, visit the [main documentation](../README.md) or check the interactive API docs at `/docs` when running the server.
