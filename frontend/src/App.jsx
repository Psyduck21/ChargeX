import React, { useState, useEffect } from 'react'
import { ThemeProvider } from './contexts/ThemeContext'
import { ToastProvider } from './components/ui/Toast.jsx'
import ProfessionalLogin from './components/login.jsx'
import ProfessionalSignup from './components/signup.jsx'
// import ManagerOperations from './components/ManagerOperations.jsx'
import StationManagerDashboard from './components/ManagerDashboard.jsx'
import UserOperations from './components/UserOperations.jsx'
import AdminDashboard from './components/Admindashboard.jsx'
import LandingPage from './components/LandingPage.jsx'
import apiService from './services/api.js'

function AppContent() {
  const [view, setView] = useState('landing')
  const [role, setRole] = useState('')

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const storedRole = localStorage.getItem('user_role');

    if (token && storedRole) {
      setRole(storedRole);
      setView('dashboard');
    }
  }, []);

  const handleLogout = async () => {
    try {
      await apiService.logout();
      setRole('');
      setView('landing');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSwitchToLogin = () => setView('login');
  const handleSwitchToSignup = () => setView('signup');

  const handleLoggedIn = async (data) => {
    try {
      const userRole = data?.user?.role || 'app_user';
      setRole(userRole);
      setView('dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      {view === 'landing' && (
        <LandingPage
          onSwitchToLogin={handleSwitchToLogin}
          onSwitchToSignup={handleSwitchToSignup}
          onLoggedIn={handleLoggedIn}
        />
      )}
      {view === 'login' && (
        <ProfessionalLogin
          onSwitchToSignup={() => setView('signup')}
          onLoggedIn={async (data) => {
            try {
              // Login is already handled in the login component
              const userRole = data?.user?.role || 'app_user';
              setRole(userRole);
              setView('dashboard');
            } catch (error) {
              console.error('Login failed:', error);
              // Let the Login component handle the error display
              throw error;
            }
          }}
        />
      )}
      {view === 'signup' && (
        <ProfessionalSignup 
          onSwitchToLogin={() => setView('login')}
          onSignup={async (userData) => {
            try {
              await apiService.signup(userData);
              setView('login');
            } catch (error) {
              console.error('Signup failed:', error);
              // Let the Signup component handle the error display
              throw error;
            }
          }}
        />
      )}
      {view === 'dashboard' && (
        <div className="p-4">
          {role === 'admin' && <AdminDashboard onLogout={handleLogout} />}
          {role === 'station_manager' && <StationManagerDashboard onLogout={handleLogout} />}
          {role === 'app_user' && <UserOperations onLogout={handleLogout} />}
        </div>
      )}
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </ThemeProvider>
  )
}
