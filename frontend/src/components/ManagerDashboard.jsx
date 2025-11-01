import React, { useEffect, useState } from 'react';
import { Bell, User, Settings, LogOut, Menu, X, Sun, Moon } from 'lucide-react';
import Skeleton from './ui/Skeleton';
import ManagerSidebar from './manager/ManagerSidebar';
import Breadcrumb from './manager/Breadcrumb';
import Tooltip from './manager/Tooltip';
import BookingAlert from './manager/BookingAlert';
import ManagerProfileModal from './ManagerProfileModal';
import OverviewTab from './manager/OverviewTab';
import BookingsTab from './manager/BookingsTab';
import SlotsTab from './manager/SlotsTab';
import apiService from '../services/api';

export default function StationManagerDashboard({onLogout}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stations, setStations] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showBookingAlert, setShowBookingAlert] = useState(false);
  const [newBooking, setNewBooking] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [managerProfile, setManagerProfile] = useState({
    full_name: 'John Doe',
    email: 'john.doe@evcharge.com',
    role: 'Station Manager',
    phone: '+91 98765 43210',
    joined: 'March 2024',
    stations_managed: 2
  });

  const [breadcrumbs, setBreadcrumbs] = useState([
    { name: 'Dashboard', path: 'overview' }
  ]);

  const revenueData = [
    { day: 'Mon', revenue: 3200 },
    { day: 'Tue', revenue: 3800 },
    { day: 'Wed', revenue: 3200 },
    { day: 'Thu', revenue: 4500 },
    { day: 'Fri', revenue: 5200 },
    { day: 'Sat', revenue: 6100 },
    { day: 'Sun', revenue: 5800 },
  ];

  const energyData = [
    { day: 'Mon', energy: 240 },
    { day: 'Tue', energy: 380 },
    { day: 'Wed', energy: 320 },
    { day: 'Thu', energy: 450 },
    { day: 'Fri', energy: 520 },
    { day: 'Sat', energy: 610 },
    { day: 'Sun', energy: 580 },
  ];

  const slotStatusData = [
    { name: 'Available', value: 19, color: '#10b981' },
    { name: 'Occupied', value: 6, color: '#f59e0b' },
  ];

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [s, b] = await Promise.all([
        apiService.getManagerStations(),
        apiService.getStationBookings()
      ]);
      setStations(s || []);
      setBookings(b || []);
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

  useEffect(() => {
    const tabNames = {
      overview: 'Dashboard',
      bookings: 'Bookings',
      slots: 'Slot Management',
      stations: 'My Stations'
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

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          booking.user_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          booking.station.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || booking.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);





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
                 activeTab === 'slots' ? 'Slot Management' : 'My Stations'}
              </h1>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Welcome back, {managerProfile.full_name.split(' ')[0]}!</p>
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
                    {managerProfile.full_name[0]}
                  </div>
                  <div className="text-left hidden md:block">
                    <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{managerProfile.full_name.split(' ')[0]}</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{managerProfile.role}</p>
                  </div>
                </button>

                {showProfileDropdown && (
                  <div className={`absolute right-0 mt-2 w-64 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg border py-2 z-50`}>
                    <div className={`px-4 py-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                      <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{managerProfile.full_name}</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{managerProfile.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        setShowProfileModal(true);
                        setShowProfileDropdown(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'} flex items-center gap-3`}
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </button>

                    <button className={`w-full px-4 py-2.5 text-left text-sm ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'} flex items-center gap-3`}>
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>

                    <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'} mt-2 pt-2`}>
                      <button className={`w-full px-4 py-2.5 text-left text-sm text-red-600 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-red-50'} flex items-center gap-3`}>
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
              <OverviewTab
                stations={stations}
                revenueData={revenueData}
                energyData={energyData}
                slotStatusData={slotStatusData}
                darkMode={darkMode}
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
      <ManagerProfileModal
        showProfileModal={showProfileModal}
        managerProfile={managerProfile}
        setShowProfileModal={setShowProfileModal}
        setManagerProfile={setManagerProfile}
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
