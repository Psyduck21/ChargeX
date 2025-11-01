import React, { useEffect, useState } from 'react';
import { Bell, User, Settings, LogOut, Menu, X, Sun, Moon } from 'lucide-react';
import Skeleton from './ui/Skeleton';
import ManagerSidebar from './manager/ManagerSidebar';
import Breadcrumb from './manager/Breadcrumb';
import Tooltip from './manager/Tooltip';
import BookingAlert from './manager/BookingAlert';

import OverviewTab from './manager/OverviewTab';
import BookingsTab from './manager/BookingsTab';
import SlotsTab from './manager/SlotsTab';
import StationsAnalyticsTab from './manager/StationsAnalyticsTab';
import ProfileTab from './manager/ProfileTab';
import ChangePasswordModal from './manager/ChangePasswordModal';
import apiService from '../services/api';

export default function StationManagerDashboard({onLogout}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stations, setStations] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showBookingAlert, setShowBookingAlert] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [newBooking, setNewBooking] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const [managerProfile, setManagerProfile] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [energyData, setEnergyData] = useState([]);
  const [chargerTypeData, setChargerTypeData] = useState([]);
  const [slotStatusData, setSlotStatusData] = useState([]);

  const [breadcrumbs, setBreadcrumbs] = useState([
    { name: 'Dashboard', path: 'overview' }
  ]);

  const fetchAnalyticsData = async () => {
    try {
      const [energyTrend, revenueTrend, chargerTypes] = await Promise.all([
        apiService.getEnergyConsumptionAnalytics(7),
        apiService.getRevenueAnalytics(7),
        apiService.getChargingTypeAnalytics(30)
      ]);

      // Process energy data
      const energyArr = (energyTrend || []).map(item => ({
        ...item,
        day: new Date(item.date).toLocaleDateString(undefined, { weekday: 'short' }),
        energy: item.energy_kwh || 0
      }));
      setEnergyData(energyArr);

      // Process revenue data
      const revenueArr = (revenueTrend || []).map(item => ({
        ...item,
        day: new Date(item.date).toLocaleDateString(undefined, { weekday: 'short' }),
        revenue: item.revenue || 0
      }));
      setRevenueData(revenueArr);

      // Process charger type data with colors
      const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'];
      const chargerWithColors = (chargerTypes || []).map((c, i) => ({
        ...c,
        color: COLORS[i % COLORS.length]
      }));
      setChargerTypeData(chargerWithColors);

      // Set slot status data based on stations
      const totalSlots = stations.reduce((sum, s) => sum + (s.capacity || 0), 0);
      const availableSlots = stations.reduce((sum, s) => sum + (s.available_slots || 0), 0);
      const occupiedSlots = totalSlots - availableSlots;

      setSlotStatusData([
        { name: 'Available', value: availableSlots, color: '#10b981' },
        { name: 'Occupied', value: occupiedSlots, color: '#f59e0b' },
      ]);

    } catch (error) {
      console.error('Error fetching analytics data:', error);
      // Set fallback data
      setEnergyData([]);
      setRevenueData([]);
      setChargerTypeData([]);
      setSlotStatusData([
        { name: 'Available', value: 0, color: '#10b981' },
        { name: 'Occupied', value: 0, color: '#f59e0b' },
      ]);
    }
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [s, b, p] = await Promise.all([
        apiService.getManagerStations(),
        apiService.getManagerBookings(),
        apiService.getMyProfile().catch(() => null) // Fallback if profile fetch fails
      ]);
      setStations(s || []);
      setBookings(b || []);
      if (p) setManagerProfile(p);
      console.log('Fetched stations:', s);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();

    const interval = setInterval(() => {
      const randomBooking = {
        id: Math.random(),
        user_name: 'New User',
        station: 'Downtown Hub',
        slot: 'A' + Math.floor(Math.random() * 10),
        start_time: new Date().toLocaleTimeString(),
      };
      setNewBooking(randomBooking);
      setShowBookingAlert(true);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Fetch analytics data after stations are loaded
  useEffect(() => {
    if (stations.length > 0) {
      fetchAnalyticsData();
    }
  }, [stations]);

  // Set up analytics updates every 5 minutes
  useEffect(() => {
    if (stations.length > 0) {
      const analyticsInterval = setInterval(fetchAnalyticsData, 300000); // 5 minutes
      return () => clearInterval(analyticsInterval);
    }
  }, [stations]);

  useEffect(() => {
    const tabNames = {
      overview: 'Dashboard',
      bookings: 'Bookings',
      slots: 'Slot Management',
      stations: 'My Stations',
      profile: 'Profile'
    };
    setBreadcrumbs([
      { name: 'Dashboard', path: 'overview' },
      { name: tabNames[activeTab], path: activeTab }
    ]);
  }, [activeTab]);

  const handleConfirmBooking = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBj2Y3vHLdS0GKXzM8t2PTwsWZr3u669eGQg+jdzzvWopBjSO2fPFdCsFJ3/L8NuVR');
    audio.play().catch(() => {});
    setShowBookingAlert(false);
    fetchAll();
  };

  const handleRejectBooking = () => {
    setShowBookingAlert(false);
  };





  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-emerald-600 text-white rounded-xl shadow-lg"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <ManagerSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onToggle={() => setSidebarOpen(false)}
        isOpen={sidebarOpen}
        stations={stations}
        darkMode={darkMode}
      />

      {/* Main Content */}
      <main className="lg:ml-64 p-4 md:p-8 pt-16 lg:pt-8">
        <header className="mb-8">
          <Breadcrumb breadcrumbs={breadcrumbs} onNavigate={setActiveTab} darkMode={darkMode} />
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-4">
            <div>
              <h1 className={`text-2xl md:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                {activeTab === 'overview' ? 'Dashboard Overview' :
                 activeTab === 'bookings' ? 'Bookings Management' :
                 activeTab === 'slots' ? 'Slot Management' :
                 activeTab === 'stations' ? 'My Stations' :
                 activeTab === 'profile' ? 'My Profile' : 'Dashboard'}
              </h1>
              {
                activeTab === 'overview' ? <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Overview of your stations and performance</p> :
                activeTab === 'bookings' ? <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Manage station bookings and view details</p> :
                activeTab === 'slots' ? <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Monitor and manage charging slots</p> :
                activeTab === 'stations' ? <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>View and manage your charging stations</p> :
                activeTab === 'profile' ? <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>View and edit your profile information</p> :
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Welcome to your dashboard</p>
              }
            </div>
            <div className="flex items-center gap-3">
              <Tooltip text="Toggle dark mode">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`p-2 ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-600'} rounded-xl transition-colors`}
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </Tooltip>
              <Tooltip text="Notifications">
                <button
                  className={`relative p-2 ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'} rounded-xl transition-colors`}
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
              </Tooltip>
              <div className="relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className={`flex items-center gap-2 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-xl p-2 transition-colors`}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold cursor-pointer">
                    {managerProfile?.name?.[0] || 'U'}
                  </div>
                  <div className="text-left hidden md:block">
                    <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{managerProfile?.name?.split(' ')[0] || 'User'}</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{managerProfile?.role || 'Loading...'}</p>
                  </div>
                </button>

                {showProfileDropdown && (
                  <div className={`absolute right-0 mt-2 w-64 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg border py-2 z-50`}>
                    <div className={`px-4 py-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                      <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{managerProfile?.name || 'User'}</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{managerProfile?.email || 'Loading...'}</p>
                    </div>

                    <button
                      onClick={() => {
                        setActiveTab('profile');
                        setShowProfileDropdown(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'} flex items-center gap-3`}
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </button>

                    <button
                      onClick={() => {
                        setShowChangePasswordModal(true);
                        setShowProfileDropdown(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'} flex items-center gap-3`}
                    >
                      <Settings className="w-4 h-4" />
                      Change Password
                    </button>

                    <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'} mt-2 pt-2`}>
                      <button
                        onClick={() => {
                          setShowProfileDropdown(false);
                          onLogout();
                        }}
                        className={`w-full px-4 py-2.5 text-left text-sm text-red-600 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-red-50'} flex items-center gap-3`}
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {loading ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <>
            {activeTab === 'overview' && (
              <OverviewTab
                stations={stations}
                revenueData={revenueData}
                energyData={energyData}
                chargerTypeData={chargerTypeData}
                slotStatusData={slotStatusData}
                darkMode={darkMode}
              />
            )}
            {activeTab === 'bookings' && (
              <BookingsTab
                bookings={bookings}
                darkMode={darkMode}
                onExport={() => {}}
              />
            )}
            {activeTab === 'slots' && (
              <SlotsTab
                stations={stations}
                darkMode={darkMode}
              />
            )}
            {activeTab === 'stations' && (
              <StationsAnalyticsTab
                stations={stations}
                darkMode={darkMode}
              />
            )}
            {activeTab === 'profile' && (
              <ProfileTab
                darkMode={darkMode}
                stations={stations}
              />
            )}
          </>
        )}
      </main>

      <BookingAlert
        showBookingAlert={showBookingAlert}
        newBooking={newBooking}
        onConfirm={handleConfirmBooking}
        onReject={handleRejectBooking}
        darkMode={darkMode}
      />

      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
        onLogout={onLogout}
        darkMode={darkMode}
      />


      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
