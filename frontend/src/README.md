# ChargeX Frontend Integration Components

This directory contains comprehensive React integration components for all ChargeX operations with minimal UI design.

## Components Overview

### 1. API Service Layer (`services/api.js`)
**Purpose**: Centralized API service for all backend operations

**Features**:
- JWT authentication handling
- Error handling and logging
- Generic API call method
- All CRUD operations for every entity
- Role-based endpoint access

**Key Methods**:
```javascript
// Authentication
apiService.login(email, password)
apiService.signup(userData)
apiService.getCurrentUser()

// Station Management
apiService.getStations()
apiService.createStation(stationData)
apiService.updateStation(stationId, updateData)
apiService.deleteStation(stationId)

// Admin Operations
apiService.getAdminStatistics()
apiService.getAllUsers()
apiService.getAllManagers()

// Manager Operations
apiService.getManagerStations()
apiService.getManagerBookings()
apiService.createChargingSession(sessionData)

// User Operations
apiService.getBookings()
apiService.createBooking(bookingData)
apiService.getVehicles()
apiService.createVehicle(vehicleData)
```

### 2. Admin Operations (`components/AdminOperations.jsx`)
**Purpose**: Complete admin functionality with minimal UI

**Features**:
- System statistics dashboard
- Station management (CRUD operations)
- User management and viewing
- Manager creation and assignment
- Analytics and reporting
- Real-time data updates

**Operations Available**:
- Create, update, delete stations
- Assign managers to stations
- Create new station managers
- View system-wide statistics
- Access consumption analytics
- Manage all users and bookings

### 3. Manager Operations (`components/ManagerOperations.jsx`)
**Purpose**: Station manager functionality with minimal UI

**Features**:
- Station and slot management
- Booking management
- Charging session control
- Feedback management
- Real-time updates

**Operations Available**:
- Manage assigned stations
- Create and manage charging slots
- View and update bookings
- Create and monitor charging sessions
- Manage station feedback
- Update slot statuses

### 4. User Operations (`components/UserOperations.jsx`)
**Purpose**: End-user functionality with minimal UI

**Features**:
- Profile management
- Vehicle management
- Booking system
- Session history
- Feedback submission

**Operations Available**:
- Update personal profile
- Add and manage vehicles
- Create and cancel bookings
- View charging session history
- Submit station feedback

### 5. Operations App (`components/OperationsApp.jsx`)
**Purpose**: Main application wrapper with role-based access

**Features**:
- Role-based component rendering
- Navigation and tabs
- User profile display
- Help and documentation
- Logout functionality

**Role Handling**:
- Admin: Full system access
- Station Manager: Limited to assigned stations
- App User: Personal operations only

### 6. Quick Test (`components/QuickTest.jsx`)
**Purpose**: API testing and debugging tool

**Features**:
- Test all API endpoints
- Role-based test categories
- Real-time result display
- Error handling demonstration

## Usage Examples

### Basic Setup
```javascript
import OperationsApp from './components/OperationsApp';

function App() {
  return <OperationsApp />;
}
```

### Direct Component Usage
```javascript
import AdminOperations from './components/AdminOperations';
import ManagerOperations from './components/ManagerOperations';
import UserOperations from './components/UserOperations';

// Use based on user role
const userRole = 'admin'; // or 'station_manager' or 'app_user'

function MyApp() {
  switch (userRole) {
    case 'admin':
      return <AdminOperations />;
    case 'station_manager':
      return <ManagerOperations />;
    case 'app_user':
      return <UserOperations />;
    default:
      return <div>Unauthorized</div>;
  }
}
```

### API Service Usage
```javascript
import apiService from './services/api';

// Create a new station
const createStation = async () => {
  try {
    const station = await apiService.createStation({
      name: 'New Station',
      city: 'New York',
      latitude: 40.7128,
      longitude: -74.0060,
      capacity: 10
    });
    console.log('Station created:', station);
  } catch (error) {
    console.error('Error:', error.message);
  }
};

// Get user bookings
const getBookings = async () => {
  try {
    const bookings = await apiService.getBookings();
    console.log('User bookings:', bookings);
  } catch (error) {
    console.error('Error:', error.message);
  }
};
```

## Environment Configuration

Create a `.env.local` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

## Authentication Flow

1. User logs in through the main app
2. JWT token is stored in localStorage
3. API service automatically includes token in requests
4. Components check user role and render appropriate operations
5. All operations include proper error handling

## Error Handling

All components include comprehensive error handling:
- Network errors
- Authentication errors
- Validation errors
- Permission errors
- User-friendly error messages

## Styling

Components use Tailwind CSS classes for minimal, clean styling:
- Responsive design
- Consistent spacing and colors
- Hover effects and transitions
- Loading states
- Success/error message styling

## Testing

Use the `QuickTest` component to test all API endpoints:
- Basic operations
- Role-specific operations
- Error scenarios
- Real-time result display

## Integration with Backend

All components are designed to work with the FastAPI backend:
- RESTful API calls
- JWT authentication
- Role-based access control
- Real-time data updates
- Comprehensive error handling

## Customization

Components are designed to be easily customizable:
- Modify UI elements
- Add new operations
- Change styling
- Extend functionality
- Add new API endpoints

## Performance Considerations

- Lazy loading of data
- Efficient state management
- Minimal re-renders
- Optimized API calls
- Error boundary handling

## Security Features

- JWT token management
- Role-based access control
- Input validation
- XSS protection
- Secure API communication

---

These components provide a complete integration solution for all ChargeX operations with minimal UI design and comprehensive functionality.
