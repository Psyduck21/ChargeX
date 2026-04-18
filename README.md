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
- **AI-Powered Booking Assistant**: Intelligent agent using Ollama for natural language booking assistance
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
- **Ollama** - Local AI model runtime for intelligent booking assistance
- **LangChain** - Framework for building AI applications

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
- **Python 3.12+** - Download from [python.org](https://python.org)
- **Node.js 18+** - Download from [nodejs.org](https://nodejs.org)
- **npm** or **yarn** (comes with Node.js)
- **Ollama** - For AI agent functionality
- **Supabase account** - Sign up at [supabase.com](https://supabase.com)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ChargeX
   ```

2. **Install and Set Up Ollama**

   #### Windows
   ```cmd
   # Download and install Ollama from https://ollama.ai/download
   # Or use winget:
   winget install Ollama.Ollama
   
   # Start Ollama service
   ollama serve
   
   # In a new terminal, pull the required model
   ollama pull qwen2.5:3b
   ```

   #### Linux
   ```bash
   # Install Ollama
   curl -fsSL https://ollama.ai/install.sh | sh
   
   # Start Ollama service (runs in background)
   ollama serve &
   
   # Pull the required model
   ollama pull qwen2.5:3b
   ```

   #### macOS
   ```bash
   # Install Ollama using Homebrew
   brew install ollama
   
   # Start Ollama service
   ollama serve &
   
   # Pull the required model
   ollama pull qwen2.5:3b
   ```

   **Note**: The AI agent uses the `qwen2.5:3b` model for intelligent booking assistance. Make sure Ollama is running before starting the backend.

3. **Backend Setup**

   #### Windows
   ```cmd
   # Create virtual environment
   python -m venv myenv
   
   # Activate virtual environment
   myenv\Scripts\activate
   
   # Install dependencies
   pip install -r requirements.txt
   ```

   #### Linux/macOS
   ```bash
   # Create virtual environment
   python -m venv myenv
   
   # Activate virtual environment
   source myenv/bin/activate
   
   # Install dependencies
   pip install -r requirements.txt
   ```

3. **Frontend Setup** (Same for all platforms)
   ```bash
   cd frontend
   npm install
   ```

4. **Database Setup**
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Set up the database schema using the migrations in `supabase/migrations/`
   - Update your `.env` file with Supabase credentials (see Configuration section)

### Running the Application

#### Windows

1. **Start the Backend**
   ```cmd
   cd backend
   myenv\Scripts\activate
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Start the Frontend** (in a new terminal)
   ```cmd
   cd frontend
   npm run dev
   ```

#### Linux/macOS

1. **Start the Backend**
   ```bash
   cd backend
   source myenv/bin/activate
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Start the Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm run dev
   ```

#### Accessing the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

### Platform-Specific Notes

#### Windows
- Ensure Python is added to your PATH during installation
- Use Command Prompt or PowerShell (not Git Bash for activation)
- If you encounter permission errors, run Command Prompt as Administrator
- For virtual environment activation, use `myenv\Scripts\activate` (not `myenv/bin/activate`)
- **Ollama**: May require administrator privileges for installation. Use PowerShell for better compatibility.

#### Linux
- Python 3.12+ is usually available via package manager:
  ```bash
  # Ubuntu/Debian
  sudo apt update
  sudo apt install python3.12 python3.12-venv
  
  # CentOS/RHEL
  sudo yum install python312 python312-venv
  ```
- Ensure your firewall allows connections on ports 5173 and 8000
- **Ollama**: The install script handles most dependencies. If you encounter GPU-related issues, install appropriate drivers.

#### macOS
- Install Python 3.12+ using Homebrew:
  ```bash
  brew install python@3.12
  ```
- Node.js can be installed via Homebrew:
  ```bash
  brew install node
  ```
- If you encounter permission issues with npm, you may need to change npm's default directory:
  ```bash
  mkdir ~/.npm-global
  npm config set prefix '~/.npm-global'
  export PATH=~/.npm-global/bin:$PATH
  # Add the export to your ~/.bash_profile or ~/.zshrc
  ```
- **Ollama**: Works well with Apple Silicon Macs. Use `brew services start ollama` for automatic startup.

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

5. **Ollama/AI Agent Issues**
   - Ensure Ollama is running: `ollama serve`
   - Verify model is downloaded: `ollama list`
   - Check if port 11434 is available (Ollama's default port)
   - Restart Ollama service if the agent can't connect

### Platform-Specific Issues

#### Windows
- **Virtual Environment Issues**: If `myenv\Scripts\activate` fails, ensure you're using Command Prompt or PowerShell, not Git Bash
- **Permission Errors**: Run Command Prompt as Administrator or use `python -m pip install --user` for global packages
- **Path Issues**: Ensure Python and npm are in your PATH. You may need to restart Command Prompt after installation
- **Port Conflicts**: If ports 5173 or 8000 are in use, change them in the commands (e.g., `--port 8001`)
- **Ollama**: If installation fails, try downloading directly from the Ollama website. Ensure antivirus doesn't block it.

#### Linux
- **Permission Issues**: If you get permission errors with npm, you may need to install packages globally or change npm's default directory:
  ```bash
  mkdir ~/.npm-global
  npm config set prefix '~/.npm-global'
  export PATH=~/.npm-global/bin:$PATH
  ```
- **Python Version**: Ensure you're using Python 3.12+, not the system Python 2.x
- **Firewall**: Ensure ports 5173 and 8000 are open: `sudo ufw allow 5173` and `sudo ufw allow 8000`
- **Ollama**: If GPU acceleration doesn't work, Ollama will fall back to CPU. Check system logs with `journalctl -u ollama`

#### macOS
- **Python Installation**: If you have multiple Python versions, use `python3` instead of `python`
- **Xcode Command Line Tools**: Install if you encounter compilation errors: `xcode-select --install`
- **Homebrew Issues**: Update Homebrew before installing packages: `brew update`
- **Permission Errors**: If npm install fails, try: `sudo chown -R $(whoami) ~/.npm`
- **Ollama**: For Apple Silicon Macs, ensure you're using the native version. Check with `ollama --version`

### Development Tips
- **Backend**: Use `uvicorn app.main:app --reload --log-level info` for more detailed logging
- **Frontend**: Use `npm run dev -- --host 0.0.0.0` to allow external access
- **Database**: Check Supabase logs in the dashboard for database-related errors
- **Environment**: Always activate the virtual environment before running backend commands
- **Ollama**: Monitor AI agent performance with `ollama logs` and check model status with `ollama ps`

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
