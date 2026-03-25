# ChargeX - Smart EV Charging Station Management System

![ChargeX Logo](https://img.shields.io/badge/ChargeX-Smart%20EV%20Charging-blue?style=for-the-badge&logo=electric-car)

A comprehensive smart electric vehicle charging station management system that enables efficient management of charging stations, user bookings, and charging sessions.

## 🚀 Features

### Core Functionality
- **Multi-Role Authentication System**: Admin, Station Manager, and App User roles
- **Station Management**: Add, edit, delete, and monitor charging stations
- **Booking System**: Users can book charging slots at available stations
- **Charging Sessions**: Track and manage active charging sessions
- **Real-time Analytics**: Dashboard with statistics and consumption analytics
- **Feedback System**: Users can provide feedback on charging experiences

### User Roles & Permissions
- **Admin**: Full system access, manage stations, users, and managers
- **Station Manager**: Manage assigned stations, view sessions and bookings
- **App User**: Book charging slots, view personal bookings and sessions

### Technical Features
- **Modern UI**: Built with React 19 and Tailwind CSS
- **RESTful API**: FastAPI backend with comprehensive endpoints
- **Database Integration**: Supabase for data persistence
- **Authentication**: JWT-based authentication with role-based access control
- **Responsive Design**: Mobile-first approach with modern UI components

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend│    │  FastAPI Backend│    │   Supabase DB   │
│                 │    │                 │    │                 │
│ • Admin Dashboard│◄──►│ • Authentication│◄──►│ • User Profiles │
│ • User Dashboard │    │ • Station Mgmt  │    │ • Stations      │
│ • Manager Panel  │    │ • Booking API   │    │ • Bookings      │
│ • Auth Components│    │ • Session API   │    │ • Sessions      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern, fast web framework for building APIs
- **Python 3.12** - Core programming language
- **Supabase** - Backend-as-a-Service for database and authentication
- **Pydantic** - Data validation and settings management
- **Uvicorn** - ASGI server for running the application

### Frontend
- **React 19** - Modern JavaScript library for building user interfaces
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful & consistent icon toolkit
- **ESLint** - Code linting and quality assurance

### Database
- **Supabase PostgreSQL** - Relational database with real-time capabilities
- **Row Level Security (RLS)** - Database-level security policies

## 📁 Project Structure

```
ChargeX/
├── backend/
│   ├── app/
│   │   ├── routers/           # API route handlers
│   │   │   ├── auth.py        # Authentication endpoints
│   │   │   ├── stations.py    # Station management
│   │   │   ├── bookings.py    # Booking system
│   │   │   ├── charging_sessions.py # Session management
│   │   │   ├── profiles.py    # User profiles
│   │   │   ├── vehicles.py    # Vehicle management
│   │   │   ├── slots.py       # Charging slot management
│   │   │   ├── station_managers.py # Manager operations
│   │   │   └── feedback.py    # Feedback system
│   │   ├── main.py           # FastAPI application entry point
│   │   ├── database.py       # Database configuration
│   │   ├── dependencies.py   # Authentication & authorization
│   │   └── crud.py          # Database operations
│   └── requirements.txt      # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── AdminDashboard.jsx    # Admin interface
│   │   │   ├── ManagerDashboard.jsx  # Manager interface
│   │   │   ├── UserDashboard.jsx     # User interface
│   │   │   ├── login.jsx            # Login component
│   │   │   ├── signup.jsx           # Registration component
│   │   │   ├── StatCard.jsx         # Statistics display
│   │   │   └── StationCard.jsx      # Station information
│   │   ├── App.jsx          # Main application component
│   │   └── main.jsx         # Application entry point
│   ├── package.json         # Node.js dependencies
│   └── vite.config.js       # Vite configuration
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites
- Python 3.12+
- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ChargeX
   ```

2. **Backend Setup**
   ```bash
   # Create virtual environment
   python -m venv myenv
   source myenv/bin/activate  # On Windows: myenv\Scripts\activate
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Set up environment variables
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

4. **Database Setup**
   - Create a new Supabase project
   - Set up the database schema (see Database Schema section)
   - Update your `.env` file with Supabase credentials

### Running the Application

1. **Start the Backend**
   ```bash
   cd backend
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Start the Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
SERVICE_ROLE=your_supabase_service_role_key
```

### Database Schema

The application uses the following main tables:

- **profiles** - User profile information
- **admins** - Admin user records
- **station_managers** - Station manager assignments
- **stations** - Charging station information
- **vehicles** - User vehicle information
- **slots** - Charging slot availability
- **bookings** - User booking records
- **charging_sessions** - Active charging sessions
- **feedback** - User feedback and ratings

## 📚 API Documentation

### Authentication Endpoints
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user information

### Station Management
- `GET /stations/` - List all stations
- `POST /stations/` - Create new station (Admin only)
- `PUT /stations/{station_id}` - Update station (Admin only)
- `DELETE /stations/{station_id}` - Delete station (Admin only)

### Booking System
- `GET /bookings/` - Get user bookings
- `POST /bookings/` - Create new booking

### Charging Sessions
- `GET /charging_sessions/` - List charging sessions
- `POST /charging_sessions/` - Create charging session (Manager/Admin)
- `GET /charging_sessions/analytics/consumption` - Get consumption analytics

For complete API documentation, visit http://localhost:8000/docs when running the backend.

## 🎨 User Interface

### Admin Dashboard
- **Overview Tab**: System statistics and recent stations
- **Stations Tab**: Manage all charging stations
- **Users Tab**: View all registered users
- **Managers Tab**: Manage station manager assignments

### Key Features
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Clean, professional interface with Tailwind CSS
- **Real-time Updates**: Live data updates and notifications
- **Role-based Access**: Different interfaces for different user types

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Granular permissions system
- **Input Validation**: Comprehensive data validation
- **CORS Protection**: Configured for secure cross-origin requests
- **Environment Variables**: Sensitive data stored securely

## 🧪 Testing

### Backend Testing
```bash
cd backend
python -m pytest
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📈 Performance Considerations

- **Database Indexing**: Optimized queries with proper indexing
- **Caching**: Implemented caching for frequently accessed data
- **Lazy Loading**: Frontend components loaded on demand
- **API Optimization**: Efficient database queries and response formatting

## 🚀 Deployment

### Backend Deployment
1. Set up a production server (AWS, DigitalOcean, etc.)
2. Install Python 3.12+ and dependencies
3. Configure environment variables
4. Use a production ASGI server like Gunicorn with Uvicorn workers

### Frontend Deployment
1. Build the production bundle: `npm run build`
2. Deploy to a static hosting service (Vercel, Netlify, etc.)
3. Configure environment variables for production API endpoints

### Database
- Use Supabase production instance
- Configure proper security policies
- Set up database backups

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation at `/docs`
- Review the troubleshooting section below

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Verify Supabase credentials in `.env`
   - Check network connectivity
   - Ensure database is properly set up

2. **Authentication Problems**
   - Clear browser localStorage
   - Check token expiration
   - Verify user role assignments

3. **CORS Issues**
   - Ensure frontend URL is in CORS origins
   - Check backend CORS configuration

4. **Build Issues**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify all dependencies are installed

## 🗺️ Roadmap

### Upcoming Features
- [ ] Real-time notifications
- [ ] Mobile app (React Native)
- [ ] Payment integration
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] API rate limiting
- [ ] Automated testing suite
- [ ] Docker containerization

### Version History
- **v1.0.0** - Initial release with core functionality
- **v1.1.0** - Enhanced UI and user experience
- **v1.2.0** - Performance optimizations and bug fixes

---

**ChargeX** - Powering the future of electric vehicle charging infrastructure 🚗⚡
