import React, { useEffect, useState } from 'react';
import Sidebar from './admindashboard/Sidebar';
import OverviewTab from './admindashboard/OverviewTab';
import StationsTab from './admindashboard/StationsTab';
import ManagersTab from './admindashboard/ManagersTab';
import UsersTab from './admindashboard/UsersTab';
import ReportsTab from './admindashboard/ReportsTab';
import Modal from './admindashboard/Modal';
import ProfileModal from './admindashboard/ProfileModal';
import ConfirmDialog from './ui/ConfirmDialog';
import Tooltip from './manager/Tooltip';
import Breadcrumb from './manager/Breadcrumb';
import { Search } from 'lucide-react';
import toast from 'react-hot-toast';

// Use the shared API service for real backend calls
import apiService from '../services/api';

export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalStations: 0, totalManagers: 0, totalBookings: 0, totalUsers: 0, totalRevenue: 0, totalEnergy: 0 });
  const [stations, setStations] = useState([]);
  const [managers, setManagers] = useState([]);
  const [users, setUsers] = useState([]);
  const [energyData, setEnergyData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [chargingTypeData, setChargingTypeData] = useState([]);
  const [peakHoursData, setPeakHoursData] = useState([]);
  const [stationUtilization, setStationUtilization] = useState([]);
  const [realTimeStats, setRealTimeStats] = useState({
    activeSessions: 0,
    averageSessionDuration: 'N/A',
    co2Saved: '0 kg'
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    loading: false
  });

  const [breadcrumbs, setBreadcrumbs] = useState([
    { name: 'Dashboard', path: 'overview' }
  ]);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'];

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'station' or 'manager'
  const [modalMode, setModalMode] = useState(''); // 'create' or 'edit'
  const [editingItem, setEditingItem] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Admin profile data
  const [adminProfile, setAdminProfile] = useState({
    name: 'Admin User',
    email: 'admin@evcharge.com',
    role: 'Super Admin',
    phone: '+91 98765 43210',
    avatar: '',
    joined: 'January 2024',
    lastLogin: 'Today at 10:30 AM'
  });

  const fetchAnalyticsData = async (retryCount = 0) => {
    try {
      const [bookingsTrend, energyTrend, revenueTrend, chargingTypes, peakHours, stationUtil, activeSessions, avgDuration, co2Saved, recentActivity] = await Promise.all([
        apiService.getBookingsAnalytics(7),
        apiService.getEnergyConsumptionAnalytics(7),
        apiService.getRevenueAnalytics(180),
        apiService.getChargingTypeAnalytics(30),
        apiService.getPeakHoursAnalytics(24),
        apiService.getStationUtilizationAnalytics(),
        apiService.getActiveSessionsCount(),
        apiService.getAverageSessionDuration(),
        apiService.getCO2Saved(),
        apiService.getRecentActivity(10)
      ]);

      // Merge energy and bookings trends by date into energyData { name, energy, bookings }
      const energyMap = {};
      (energyTrend || []).forEach(d => {
        const name = d.date || d.name;
        energyMap[name] = { name, energy: d.energy_kwh || d.energy || 0, bookings: 0 };
      });
      (bookingsTrend || []).forEach(d => {
        const name = d.date || d.name;
        if (!energyMap[name]) energyMap[name] = { name, energy: 0, bookings: d.bookings || 0 };
        else energyMap[name].bookings = d.bookings || 0;
      });
      // Convert to array and sort by date
      const energyArr = Object.values(energyMap).sort((a,b) => new Date(a.name) - new Date(b.name));
      // Format name to short date label
      const formattedEnergy = energyArr.map(item => ({ ...item, name: new Date(item.name).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) }));
      setEnergyData(formattedEnergy);

      // Revenue: aggregate by month (from revenueTrend which is date->revenue)
      const monthMap = {};
      (revenueTrend || []).forEach(d => {
        const dateKey = d.date || d.name;
        const dt = new Date(dateKey);
        const monthKey = `${dt.getFullYear()}-${(dt.getMonth()+1).toString().padStart(2,'0')}`;
        monthMap[monthKey] = (monthMap[monthKey] || 0) + (d.revenue || 0);
      });
      const revenueArr = Object.keys(monthMap).sort().map(k => {
        const [y, mth] = k.split('-');
        const monthLabel = new Date(Number(y), Number(mth)-1, 1).toLocaleString(undefined, { month: 'short' });
        return { month: monthLabel, revenue: Math.round(monthMap[k]), target: Math.round(monthMap[k]) };
      });
      setRevenueData(revenueArr);

      // Charging type data: attach color palette
      const chargingWithColors = (chargingTypes || []).map((c, i) => ({ ...c, color: COLORS[i % COLORS.length] }));
      setChargingTypeData(chargingWithColors);

      // Peak hours data
      setPeakHoursData(peakHours || []);

      // Station utilization: normalize total_sessions to percentage for UI bars
      const util = (stationUtil || []).map(su => ({
        name: su.station_name || su.station_name || su.station || su.station_id,
        value: su.total_sessions || 0
      }));
      const maxSessions = util.reduce((mx, it) => Math.max(mx, it.value || 0), 0) || 1;
      const utilPct = util.map(it => ({ name: it.name, value: Math.round((it.value / maxSessions) * 100) }));
      setStationUtilization(utilPct);

      // Set real-time statistics from API responses
      setRealTimeStats({
        activeSessions: activeSessions?.active_sessions || 0,
        averageSessionDuration: avgDuration?.average_session_duration || 'N/A',
        co2Saved: co2Saved?.co2_saved || '0 kg'
      });

      // Set recent activity data
      setRecentActivities(recentActivity || []);

    } catch (error) {
      console.error('Error fetching analytics data:', error);
    }
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      // Fetch user data first (this always works)
      const user = await apiService.getCurrentUser();

      // Fetch profile data separately and handle errors gracefully - doesn't block main dashboard
      let profile = null;
      try {
        profile = await apiService.getMyProfile();
      } catch (err) {
        console.warn('Profile not available yet, using auth data only:', err);
        // Profile not available - that's okay, use auth data from current user endpoint
      }

      const [s, m, u, adminStats, bookingsTrend, energyTrend, revenueTrend, chargingTypes, peakHours, stationUtil] = await Promise.all([
        apiService.getStationsWithManagers(),
        apiService.getManagersWithStations(), // <- use aggregated view endpoint
        apiService.getAllUsers(),
        apiService.getAdminStatistics(),
        apiService.getBookingsAnalytics(7),
        apiService.getEnergyConsumptionAnalytics(7),
        apiService.getRevenueAnalytics(180),
        apiService.getChargingTypeAnalytics(30),
        apiService.getPeakHoursAnalytics(24),
        apiService.getStationUtilizationAnalytics()
      ]);

      // Set user profile data - prefer profile data, fallback to auth data from /auth/me
      if (profile) {
        // Use complete profile data when available
        setAdminProfile({
          name: profile.name || 'Admin User',
          email: profile.email || 'admin@evcharge.com',
          role: profile.role || 'Admin',
          phone: profile.phone || '+91 98765 43210',
          avatar: '', // Profile model doesn't include avatar yet
          joined: profile.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'January 2024',
          lastLogin: profile.updated_at ? new Date(profile.updated_at).toLocaleString() : 'Today',
          // Additional profile fields
          address: profile.address || '',
          city: profile.city || '',
          country: profile.country || '',
          zipCode: profile.zip_code || ''
        });
      } else if (user) {
        // Fallback to auth data (always available)
        setAdminProfile({
          name: user.name || user.full_name || 'Admin User',
          email: user.email || 'admin@evcharge.com',
          role: user.role || 'Admin',
          phone: user.phone || '+91 98765 43210',
          avatar: '',
          joined: user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'January 2024',
          lastLogin: user.last_login_at ? new Date(user.last_login_at).toLocaleString() : 'Today'
        });
      }

      // normalize station ids (some endpoints return id vs station_id)
      const normalizedStations = (s || []).map(st => ({ ...st, station_id: st.station_id || st.id }));
      setStations(normalizedStations);
      // managers view returns managers with .stations array already
      // ensure each manager has stations as array
      const normalizedManagers = (m || []).map(mgr => ({ ...mgr, stations: Array.isArray(mgr.stations) ? mgr.stations : [] }));
      setManagers(normalizedManagers);
      setUsers(u || []);

      // Set top-level stats from admin endpoint
      setStats({
        totalStations: adminStats?.total_stations || (s || []).length,
        totalManagers: adminStats?.total_managers || (m || []).length,
        totalBookings: adminStats?.total_bookings || 0,
        totalUsers: adminStats?.total_users || (u || []).length,
        totalRevenue: adminStats?.total_revenue || 0,
        totalEnergy: adminStats?.total_sessions || 0
      });

      // Merge energy and bookings trends by date into energyData { name, energy, bookings }
      const energyMap = {};
      (energyTrend || []).forEach(d => {
        const name = d.date || d.name;
        energyMap[name] = { name, energy: d.energy_kwh || d.energy || 0, bookings: 0 };
      });
      (bookingsTrend || []).forEach(d => {
        const name = d.date || d.name;
        if (!energyMap[name]) energyMap[name] = { name, energy: 0, bookings: d.bookings || 0 };
        else energyMap[name].bookings = d.bookings || 0;
      });
      // Convert to array and sort by date
      const energyArr = Object.values(energyMap).sort((a,b) => new Date(a.name) - new Date(b.name));
      // Format name to short date label
      const formattedEnergy = energyArr.map(item => ({ ...item, name: new Date(item.name).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) }));
      setEnergyData(formattedEnergy);

      // Revenue: aggregate by month (from revenueTrend which is date->revenue)
      const monthMap = {};
      (revenueTrend || []).forEach(d => {
        const dateKey = d.date || d.name;
        const dt = new Date(dateKey);
        const monthKey = `${dt.getFullYear()}-${(dt.getMonth()+1).toString().padStart(2,'0')}`;
        monthMap[monthKey] = (monthMap[monthKey] || 0) + (d.revenue || 0);
      });
      const revenueArr = Object.keys(monthMap).sort().map(k => {
        const [y, mth] = k.split('-');
        const monthLabel = new Date(Number(y), Number(mth)-1, 1).toLocaleString(undefined, { month: 'short' });
        return { month: monthLabel, revenue: Math.round(monthMap[k]), target: Math.round(monthMap[k]) };
      });
      setRevenueData(revenueArr);

      // Charging type data: attach color palette
      const chargingWithColors = (chargingTypes || []).map((c, i) => ({ ...c, color: COLORS[i % COLORS.length] }));
      setChargingTypeData(chargingWithColors);

      // Peak hours data
      setPeakHoursData(peakHours || []);

      // Station utilization: normalize total_sessions to percentage for UI bars
      const util = (stationUtil || []).map(su => ({
        name: su.station_name || su.station_name || su.station || su.station_id,
        value: su.total_sessions || 0
      }));
      const maxSessions = util.reduce((mx, it) => Math.max(mx, it.value || 0), 0) || 1;
      const utilPct = util.map(it => ({ name: it.name, value: Math.round((it.value / maxSessions) * 100) }));
      setStationUtilization(utilPct);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();

    // Set up analytics updates every 5 minutes (300 seconds) to avoid rate limits
    const analyticsInterval = setInterval(fetchAnalyticsData, 300000); // 5 minutes

    // Cleanup interval on unmount
    return () => clearInterval(analyticsInterval);
  }, []);

  // Additional useEffect for initial analytics fetch
  useEffect(() => {
    fetchAnalyticsData(); // Fetch analytics immediately when component loads
  }, []);

  useEffect(() => {
    const tabNames = {
      overview: 'Overview',
      stations: 'Stations',
      managers: 'Managers',
      users: 'Users',
      reports: 'Reports'
    };
    setBreadcrumbs([
      { name: 'Dashboard', path: 'overview' },
      { name: tabNames[activeTab], path: activeTab }
    ]);
  }, [activeTab]);

  const openModal = (type, mode, item = null) => {
    setModalType(type);
    setModalMode(mode);
    setEditingItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  // Delete handlers
  const showDeleteConfirm = (type, id, name) => {
    setConfirmDialog({
      isOpen: true,
      title: `Delete ${type}`,
      message: `Are you sure you want to delete ${type.toLowerCase()} "${name}"? This action cannot be undone.`,
      loading: false,
      danger: true,
      onConfirm: async () => {
        setConfirmDialog(d => ({ ...d, loading: true }));
        try {
          if (type === 'Station') {
            await apiService.deleteStation(id);
          } else {
            await apiService.deleteStationManager(id);
          }
          toast.success(`${type} deleted successfully`);
          fetchAll();
          setConfirmDialog(d => ({ ...d, isOpen: false }));
        } catch (err) {
          console.error(err);
          toast.error(`Failed to delete ${type.toLowerCase()}`);
          setConfirmDialog(d => ({ ...d, loading: false }));
        }
      }
    });
  };

  const handleDeleteStation = (station) => {
    showDeleteConfirm('Station', station.station_id, station.name);
  };

  const handleDeleteManager = (manager) => {
    showDeleteConfirm('Manager', manager.id, manager.name);
  };

  const handleAssignManager = async (stationId, managerId) => {
    try {
      await apiService.assignManagerToStation(stationId, managerId);
      if (managerId) {
        toast.success('Manager assigned successfully');
      } else {
        toast.success('Manager unassigned successfully');
      }
      fetchAll(); // Refresh data
    } catch (err) {
      console.error('Manager assignment error:', err);
      toast.error('Failed to assign manager');
    }
  };

  const handleAssignStations = async (managerId, stationId, isCurrentlyAssigned) => {
    try {
      // If currently assigned, unassign (set managerId to null)
      // If not assigned, assign (set managerId to the manager's ID)
      const targetManagerId = isCurrentlyAssigned ? null : managerId;

      await apiService.assignManagerToStation(stationId, targetManagerId);

      if (isCurrentlyAssigned) {
        toast.success('Station unassigned from manager successfully');
      } else {
        toast.success('Station assigned to manager successfully');
      }

      fetchAll(); // Refresh data to show updated assignments
    } catch (err) {
      console.error('Station assignment error:', err);
      toast.error('Failed to update station assignment');
    }
  };

  const handleModalSubmit = async (formData) => {
    try {
      if (modalType === 'station') {
        if (modalMode === 'create') {
          await apiService.createStation(formData);
          toast.success('Station created');
        } else {
          const id = editingItem?.station_id || editingItem?.id;
          await apiService.updateStation(id, formData);
          toast.success('Station updated');
        }
      } else if (modalType === 'manager') {
        const payload = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          zip_code: formData.zip_code,
          password: formData.password,
          station_ids: formData.station_ids || []
        };

        if (modalMode === 'create') {
          // Password is only needed for creating new managers
          await apiService.createStationManager(payload);
          toast.success('Manager created');
        } else {
          const id = editingItem?.id;
          // Remove password for updates (not needed and not accepted by backend)
          const { password, ...updatePayload } = payload;
          await apiService.updateStationManager(id, updatePayload);
          toast.success('Manager updated');
        }
      }

      closeModal();
      fetchAll();
    } catch (err) {
      console.error('Submit error:', err);
      toast.error('Failed to save. See console for details.');
      throw err; // Re-throw to let modal handle it
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        adminProfile={adminProfile}
        onLogout={onLogout}
        onProfileClick={() => setShowProfileModal(true)}
      />

      {/* Main Content */}
      <main className="ml-64 p-8">
        <header className="mb-8">
          <Breadcrumb breadcrumbs={breadcrumbs} onNavigate={setActiveTab} darkMode={false} />
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h1>
              <p className="text-gray-500">Manage and monitor your EV charging infrastructure</p>
            </div>
            <div className="flex items-center gap-3">
              <Tooltip text="Search across stations, managers, and users">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-64 pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </Tooltip>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <OverviewTab
                stats={stats}
                energyData={energyData}
                revenueData={revenueData}
                chargingTypeData={chargingTypeData}
                peakHoursData={peakHoursData}
                stationUtilization={stationUtilization}
                realTimeStats={realTimeStats}
                recentActivities={recentActivities}
              />
            )}
            {activeTab === 'stations' && (
              <StationsTab
                stations={stations}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onCreateStation={() => openModal('station', 'create')}
                onEditStation={(station) => openModal('station', 'edit', station)}
                onDeleteStation={handleDeleteStation}
                managers={managers}
                onAssignManager={handleAssignManager}
              />
            )}
            {activeTab === 'managers' && (
              <ManagersTab
                managers={managers}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onCreateManager={() => openModal('manager', 'create')}
                onEditManager={(manager) => openModal('manager', 'edit', manager)}
                onDeleteManager={handleDeleteManager}
                onAssignStations={handleAssignStations}
                stations={stations}
              />
            )}
            {activeTab === 'users' && (
              <UsersTab
                users={users}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            )}
            {activeTab === 'reports' && <ReportsTab />}
          </>
        )}
      </main>

      <Modal
        showModal={showModal}
        modalType={modalType}
        modalMode={modalMode}
        editingItem={editingItem}
        closeModal={closeModal}
        onSubmit={handleModalSubmit}
        stations={stations}
      />

      <ProfileModal
        showProfileModal={showProfileModal}
        adminProfile={adminProfile}
        setShowProfileModal={setShowProfileModal}
        setAdminProfile={setAdminProfile}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onClose={() => setConfirmDialog(d => ({ ...d, isOpen: false }))}
        loading={confirmDialog.loading}
        danger={confirmDialog.danger}
      />
    </div>
  );
}
