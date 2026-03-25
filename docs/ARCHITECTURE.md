# ChargeX Architecture Documentation

## System Overview

ChargeX is a comprehensive smart electric vehicle charging station management system designed with a modern, scalable architecture. The system follows a three-tier architecture pattern with clear separation of concerns.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        ChargeX System                          │
├─────────────────────────────────────────────────────────────────┤
│  Frontend Layer (React)                                        │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐              │
│  │   Admin     │ │  Manager    │ │    User     │              │
│  │ Dashboard   │ │ Dashboard   │ │ Dashboard   │              │
│  └─────────────┘ └─────────────┘ └─────────────┘              │
├─────────────────────────────────────────────────────────────────┤
│  API Layer (FastAPI)                                           │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐              │
│  │  Auth API   │ │ Station API │ │ Booking API │              │
│  └─────────────┘ └─────────────┘ └─────────────┘              │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐              │
│  │ Session API │ │ Profile API │ │ Feedback API│              │
│  └─────────────┘ └─────────────┘ └─────────────┘              │
├─────────────────────────────────────────────────────────────────┤
│  Data Layer (Supabase PostgreSQL)                              │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐              │
│  │   Users     │ │  Stations   │ │  Bookings   │              │
│  │  Profiles   │ │   Slots     │ │  Sessions   │              │
│  └─────────────┘ └─────────────┘ └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

## Component Architecture

### 1. Frontend Layer (React)

The frontend is built using React 19 with modern hooks and functional components.

#### Component Hierarchy
```
App
├── Authentication
│   ├── Login
│   └── Signup
├── RoleGate
│   ├── AdminDashboard
│   │   ├── Overview
│   │   ├── Stations
│   │   ├── Users
│   │   └── Managers
│   ├── ManagerDashboard
│   └── UserDashboard
└── Shared Components
    ├── StatCard
    ├── StationCard
    └── Common UI Elements
```

#### Key Frontend Technologies
- **React 19**: Latest React with concurrent features
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **ESLint**: Code quality and consistency

#### State Management
- **Local State**: React hooks (useState, useEffect)
- **Authentication State**: localStorage for token persistence
- **API State**: Direct API calls with error handling

### 2. Backend Layer (FastAPI)

The backend follows a modular architecture with clear separation of concerns.

#### Application Structure
```
backend/
├── app/
│   ├── main.py              # Application entry point
│   ├── database.py          # Database configuration
│   ├── dependencies.py      # Authentication & authorization
│   ├── crud.py             # Database operations
│   └── routers/            # API route handlers
│       ├── auth.py         # Authentication endpoints
│       ├── stations.py     # Station management
│       ├── bookings.py     # Booking system
│       ├── charging_sessions.py # Session management
│       ├── profiles.py     # User profiles
│       ├── vehicles.py     # Vehicle management
│       ├── slots.py        # Charging slot management
│       ├── station_managers.py # Manager operations
│       └── feedback.py     # Feedback system
```

#### Key Backend Technologies
- **FastAPI**: Modern, fast web framework
- **Pydantic**: Data validation and serialization
- **Supabase**: Backend-as-a-Service
- **Uvicorn**: ASGI server
- **Python 3.12**: Core programming language

#### API Design Principles
- **RESTful**: Following REST conventions
- **Stateless**: Each request contains all necessary information
- **Resource-based**: URLs represent resources
- **HTTP Methods**: Proper use of GET, POST, PUT, DELETE
- **Status Codes**: Meaningful HTTP status codes

### 3. Data Layer (Supabase PostgreSQL)

The database layer uses PostgreSQL with Supabase for enhanced features.

#### Database Schema Design

```sql
-- Core Entities
profiles (id, name, email, phone, address, city, created_at, updated_at)
admins (id -> profiles.id)
stations (id, name, city, latitude, longitude, capacity, available_slots, status)
station_managers (id -> profiles.id, station_id -> stations.id)
vehicles (id, owner_id -> profiles.id, make, model, year, license_plate, battery_capacity)
slots (id, station_id -> stations.id, slot_number, status)
bookings (id, user_id -> profiles.id, station_id -> stations.id, slot_id -> slots.id, start_time, end_time, status)
charging_sessions (id, station_id -> stations.id, user_id -> profiles.id, vehicle_id -> vehicles.id, started_at, ended_at, energy_consumed, cost, status)
feedback (id, station_id -> stations.id, user_id -> profiles.id, rating, comment, created_at)
```

#### Database Features
- **Row Level Security (RLS)**: Database-level access control
- **Real-time Subscriptions**: Live data updates
- **Automatic API Generation**: REST and GraphQL APIs
- **Built-in Authentication**: User management
- **Backup and Recovery**: Automated backups

## Security Architecture

### Authentication Flow
```
1. User Registration/Login
   ↓
2. Supabase Auth generates JWT
   ↓
3. JWT stored in localStorage
   ↓
4. JWT sent with each API request
   ↓
5. Backend validates JWT with Supabase
   ↓
6. Role-based access control applied
```

### Authorization Model
```
Admin (Full Access)
├── Manage all stations
├── Manage all users
├── Manage station managers
├── View all analytics
└── System configuration

Station Manager (Limited Access)
├── Manage assigned stations
├── View station bookings
├── Create charging sessions
├── View station analytics
└── Manage station slots

App User (Basic Access)
├── View available stations
├── Create bookings
├── View own bookings
├── Submit feedback
└── Manage own profile
```

### Security Measures
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Granular permissions
- **Input Validation**: Pydantic models for data validation
- **CORS Protection**: Configured for secure cross-origin requests
- **Environment Variables**: Sensitive data stored securely
- **Row Level Security**: Database-level access control

## Data Flow Architecture

### 1. User Registration Flow
```
Frontend → POST /auth/signup → Supabase Auth → Database → JWT Response → Frontend
```

### 2. Station Management Flow
```
Admin Dashboard → POST /stations/ → FastAPI → CRUD Operations → Supabase → Database
```

### 3. Booking Flow
```
User Dashboard → POST /bookings/ → FastAPI → Validation → Database → Confirmation
```

### 4. Real-time Updates
```
Database Change → Supabase Realtime → WebSocket → Frontend Update
```

## API Architecture

### RESTful Design
- **Resources**: Stations, Bookings, Users, Sessions
- **HTTP Methods**: GET, POST, PUT, DELETE
- **Status Codes**: 200, 201, 400, 401, 403, 404, 500
- **Content Types**: application/json
- **Authentication**: Bearer token in Authorization header

### API Versioning
- **Current Version**: v1.0.0
- **Versioning Strategy**: URL path versioning (/api/v1/)
- **Backward Compatibility**: Maintained for stable versions

### Error Handling
```json
{
  "detail": "Error message",
  "status_code": 400,
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## Performance Architecture

### Frontend Performance
- **Code Splitting**: Lazy loading of components
- **Bundle Optimization**: Vite for fast builds
- **Caching**: Browser caching for static assets
- **Responsive Design**: Mobile-first approach

### Backend Performance
- **Async Operations**: FastAPI async/await
- **Database Indexing**: Optimized queries
- **Connection Pooling**: Efficient database connections
- **Caching**: In-memory caching for frequently accessed data

### Database Performance
- **Indexes**: Strategic indexing on frequently queried columns
- **Query Optimization**: Efficient SQL queries
- **Connection Pooling**: Managed by Supabase
- **Read Replicas**: For read-heavy operations

## Scalability Architecture

### Horizontal Scaling
- **Stateless Backend**: Easy to scale horizontally
- **Load Balancing**: Multiple backend instances
- **Database Scaling**: Supabase handles database scaling
- **CDN**: Static asset delivery

### Vertical Scaling
- **Resource Optimization**: Efficient resource usage
- **Memory Management**: Proper memory allocation
- **CPU Optimization**: Async operations
- **Storage Optimization**: Efficient data storage

## Deployment Architecture

### Development Environment
```
Local Machine
├── Frontend (localhost:5173)
├── Backend (localhost:8000)
└── Database (Supabase Cloud)
```

### Production Environment
```
Load Balancer
├── Frontend (Static Hosting)
├── Backend (Multiple Instances)
└── Database (Supabase Production)
```

### Container Architecture (Future)
```
Docker Containers
├── Frontend Container
├── Backend Container
├── Database Container
└── Reverse Proxy Container
```

## Monitoring and Logging

### Application Monitoring
- **Error Tracking**: Comprehensive error logging
- **Performance Monitoring**: Response time tracking
- **User Analytics**: Usage pattern analysis
- **Health Checks**: System health monitoring

### Logging Strategy
- **Structured Logging**: JSON format logs
- **Log Levels**: DEBUG, INFO, WARNING, ERROR
- **Centralized Logging**: Aggregated log collection
- **Log Retention**: Configurable retention policies

## Integration Architecture

### External Integrations
- **Payment Gateway**: Future payment processing
- **Maps API**: Location services
- **Notification Service**: Email/SMS notifications
- **Analytics Service**: Usage analytics

### API Integrations
- **REST APIs**: Standard REST endpoints
- **WebSocket**: Real-time updates
- **Webhooks**: Event notifications
- **GraphQL**: Future GraphQL support

## Data Architecture

### Data Models
- **User Data**: Profile information, preferences
- **Station Data**: Location, capacity, status
- **Booking Data**: Reservations, time slots
- **Session Data**: Charging sessions, energy consumption
- **Analytics Data**: Usage statistics, trends

### Data Relationships
- **One-to-Many**: User → Bookings, Station → Slots
- **Many-to-Many**: Users ↔ Stations (through bookings)
- **Hierarchical**: Admin → Managers → Stations

### Data Validation
- **Input Validation**: Pydantic models
- **Database Constraints**: Foreign keys, check constraints
- **Business Rules**: Application-level validation
- **Data Integrity**: ACID compliance

## Future Architecture Considerations

### Microservices Migration
- **Service Decomposition**: Break into smaller services
- **API Gateway**: Centralized API management
- **Service Discovery**: Dynamic service registration
- **Event-Driven Architecture**: Asynchronous communication

### Cloud-Native Features
- **Container Orchestration**: Kubernetes deployment
- **Service Mesh**: Inter-service communication
- **Observability**: Distributed tracing
- **Auto-scaling**: Dynamic resource allocation

### Advanced Features
- **Machine Learning**: Predictive analytics
- **IoT Integration**: Smart charging stations
- **Blockchain**: Transparent transactions
- **Edge Computing**: Local processing

## Technology Stack Summary

### Frontend
- React 19, Vite, Tailwind CSS, Lucide React

### Backend
- FastAPI, Python 3.12, Pydantic, Uvicorn

### Database
- Supabase PostgreSQL, Row Level Security

### Infrastructure
- Supabase Cloud, Static Hosting, CDN

### Development
- Git, ESLint, Prettier, Docker (future)

---

This architecture provides a solid foundation for the ChargeX system while maintaining flexibility for future enhancements and scalability requirements.
