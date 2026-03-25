# ChargeX Setup Guide

This guide will walk you through setting up the ChargeX smart EV charging station management system from scratch.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software
- **Python 3.12+** - [Download Python](https://www.python.org/downloads/)
- **Node.js 18+** - [Download Node.js](https://nodejs.org/)
- **npm or yarn** - Comes with Node.js
- **Git** - [Download Git](https://git-scm.com/downloads)

### Required Accounts
- **Supabase Account** - [Sign up for Supabase](https://supabase.com/)

### System Requirements
- **RAM**: Minimum 4GB, Recommended 8GB+
- **Storage**: At least 2GB free space
- **OS**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 18.04+)

## Step 1: Clone the Repository

```bash
# Clone the repository
git clone <repository-url>
cd ChargeX

# Verify the project structure
ls -la
```

You should see the following structure:
```
ChargeX/
├── backend/
├── frontend/
├── docs/
└── README.md
```

## Step 2: Backend Setup

### 2.1 Create Python Virtual Environment

```bash
# Navigate to the backend directory
cd backend

# Create virtual environment
python -m venv myenv

# Activate virtual environment
# On Windows:
myenv\Scripts\activate
# On macOS/Linux:
source myenv/bin/activate
```

### 2.2 Install Python Dependencies

```bash
# Upgrade pip
python -m pip install --upgrade pip

# Install dependencies
pip install -r requirements.txt
```

### 2.3 Set Up Environment Variables

```bash
# Create .env file
touch .env  # On Windows: type nul > .env

# Edit the .env file with your preferred editor
nano .env   # or use vim, code, etc.
```

Add the following content to your `.env` file:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
SERVICE_ROLE=your_supabase_service_role_key

# Optional: Database URL (if using direct PostgreSQL)
# DATABASE_URL=postgresql://user:password@localhost:5432/chargex

# Optional: JWT Secret (if not using Supabase Auth)
# JWT_SECRET=your_jwt_secret_key

# Optional: Environment
ENVIRONMENT=development
```

### 2.4 Get Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Create a new project or select existing one
3. Go to **Settings** → **API**
4. Copy the following values:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** key → `SUPABASE_KEY`
   - **service_role** key → `SERVICE_ROLE`

## Step 3: Database Setup

### 3.1 Create Database Tables

Run the following SQL commands in your Supabase SQL editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT,
    email TEXT UNIQUE,
    phone TEXT,
    address TEXT,
    city TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admins table
CREATE TABLE admins (
    id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create stations table
CREATE TABLE stations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    capacity INTEGER DEFAULT 0,
    available_slots INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create station_managers table
CREATE TABLE station_managers (
    id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    station_id UUID REFERENCES stations(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vehicles table
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    make TEXT,
    model TEXT,
    year INTEGER,
    license_plate TEXT,
    battery_capacity DECIMAL(5, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create slots table
CREATE TABLE slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    station_id UUID REFERENCES stations(id) ON DELETE CASCADE,
    slot_number INTEGER,
    status TEXT DEFAULT 'available',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    station_id UUID REFERENCES stations(id) ON DELETE CASCADE,
    slot_id UUID REFERENCES slots(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create charging_sessions table
CREATE TABLE charging_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    station_id UUID REFERENCES stations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
    started_at TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE,
    energy_consumed DECIMAL(8, 2),
    cost DECIMAL(8, 2),
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create feedback table
CREATE TABLE feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    station_id UUID REFERENCES stations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_stations_city ON stations(city);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_station_id ON bookings(station_id);
CREATE INDEX idx_charging_sessions_station_id ON charging_sessions(station_id);
CREATE INDEX idx_charging_sessions_user_id ON charging_sessions(user_id);
CREATE INDEX idx_feedback_station_id ON feedback(station_id);
```

### 3.2 Set Up Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE station_managers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE charging_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (basic setup)
-- Profiles: Users can only see their own profile
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Stations: Everyone can view stations
CREATE POLICY "Anyone can view stations" ON stations
    FOR SELECT USING (true);

-- Admins can manage stations
CREATE POLICY "Admins can manage stations" ON stations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admins 
            WHERE admins.id = auth.uid()
        )
    );

-- Bookings: Users can only see their own bookings
CREATE POLICY "Users can view own bookings" ON bookings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bookings" ON bookings
    FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### 3.3 Create Sample Data (Optional)

```sql
-- Insert sample stations
INSERT INTO stations (name, city, latitude, longitude, capacity, available_slots) VALUES
('Downtown Charging Hub', 'New York', 40.7128, -74.0060, 10, 10),
('Mall Charging Station', 'Los Angeles', 34.0522, -118.2437, 8, 8),
('Airport Charging Point', 'Chicago', 41.8781, -87.6298, 12, 12);

-- Create sample admin (replace with actual user ID from Supabase Auth)
-- First, create a profile, then add to admins table
-- INSERT INTO profiles (id, name, email) VALUES ('your-admin-uuid', 'Admin User', 'admin@example.com');
-- INSERT INTO admins (id) VALUES ('your-admin-uuid');
```

## Step 4: Frontend Setup

### 4.1 Install Node.js Dependencies

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Or using yarn
yarn install
```

### 4.2 Configure Frontend Environment

```bash
# Create .env file for frontend
touch .env.local  # On Windows: type nul > .env.local

# Edit the .env.local file
nano .env.local
```

Add the following content:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Environment
VITE_ENVIRONMENT=development
```

## Step 5: Running the Application

### 5.1 Start the Backend Server

```bash
# Navigate to backend directory
cd ../backend

# Make sure virtual environment is activated
source myenv/bin/activate  # On Windows: myenv\Scripts\activate

# Start the FastAPI server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

You should see output like:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [12345] using StatReload
INFO:     Started server process [12346]
INFO:     Waiting for application startup.
✅ Database initialized and FastAPI startup complete.
INFO:     Application startup complete.
```

### 5.2 Start the Frontend Development Server

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Start the development server
npm run dev
```

You should see output like:
```
  VITE v7.1.7  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

## Step 6: Verify Installation

### 6.1 Test Backend API

Open your browser and navigate to:
- **API Documentation**: http://localhost:8000/docs
- **API Root**: http://localhost:8000/

You should see the API documentation and a JSON response respectively.

### 6.2 Test Frontend Application

Open your browser and navigate to:
- **Frontend Application**: http://localhost:5173/

You should see the ChargeX login page.

### 6.3 Create Your First Admin User

1. Go to http://localhost:5173/
2. Click "Sign up for free"
3. Fill in the registration form
4. After successful registration, note the user ID from the response
5. Go to your Supabase dashboard → SQL Editor
6. Run the following SQL (replace `your-user-id` with the actual ID):

```sql
-- Add the user to admins table
INSERT INTO admins (id) VALUES ('your-user-id');
```

7. Log in with your new admin account

## Step 7: Production Setup (Optional)

### 7.1 Backend Production Setup

```bash
# Install production dependencies
pip install gunicorn

# Create production configuration
cat > gunicorn.conf.py << EOF
bind = "0.0.0.0:8000"
workers = 4
worker_class = "uvicorn.workers.UvicornWorker"
timeout = 120
keepalive = 2
max_requests = 1000
max_requests_jitter = 100
EOF

# Run with Gunicorn
gunicorn -c gunicorn.conf.py app.main:app
```

### 7.2 Frontend Production Build

```bash
# Build for production
npm run build

# The built files will be in the 'dist' directory
# Serve with any static file server
npx serve dist
```

## Troubleshooting

### Common Issues and Solutions

#### 1. Python Virtual Environment Issues

**Problem**: `python: command not found`
**Solution**: 
```bash
# Use python3 instead
python3 -m venv myenv
source myenv/bin/activate
```

#### 2. Node.js Version Issues

**Problem**: `npm install` fails with version errors
**Solution**:
```bash
# Check Node.js version
node --version

# Use nvm to manage Node.js versions
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

#### 3. Supabase Connection Issues

**Problem**: Database connection errors
**Solution**:
1. Verify your Supabase credentials in `.env`
2. Check if your Supabase project is active
3. Ensure RLS policies are correctly set up

#### 4. CORS Issues

**Problem**: Frontend can't connect to backend
**Solution**:
1. Check if backend is running on port 8000
2. Verify CORS settings in `backend/app/main.py`
3. Ensure frontend is using the correct API URL

#### 5. Port Already in Use

**Problem**: `Address already in use`
**Solution**:
```bash
# Find process using the port
lsof -i :8000  # On macOS/Linux
netstat -ano | findstr :8000  # On Windows

# Kill the process or use a different port
uvicorn app.main:app --reload --port 8001
```

### Getting Help

If you encounter issues not covered here:

1. Check the [API Documentation](API.md)
2. Review the [main README](../README.md)
3. Check the application logs for error messages
4. Verify all environment variables are set correctly
5. Ensure all dependencies are installed

### Logs and Debugging

#### Backend Logs
```bash
# Run with debug logging
uvicorn app.main:app --reload --log-level debug
```

#### Frontend Logs
```bash
# Check browser console for errors
# Or run with verbose logging
npm run dev -- --debug
```

## Next Steps

After successful setup:

1. **Explore the Admin Dashboard**: Create stations and manage users
2. **Test User Registration**: Create test user accounts
3. **Set Up Station Managers**: Assign managers to stations
4. **Create Bookings**: Test the booking system
5. **Monitor Charging Sessions**: Track usage and analytics

## Security Considerations

1. **Environment Variables**: Never commit `.env` files to version control
2. **Database Security**: Use strong passwords and enable RLS
3. **API Keys**: Rotate Supabase keys regularly
4. **HTTPS**: Use HTTPS in production
5. **Authentication**: Implement proper session management

---

Congratulations! You've successfully set up the ChargeX system. For more information, refer to the [main documentation](../README.md) and [API documentation](API.md).
