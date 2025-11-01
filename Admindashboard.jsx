import React, { useEffect, useState } from 'react';
import { BarChart3, Users, MapPin, Zap, TrendingUp, Plus, Edit2, Trash2, Search, Download, Calendar, ChevronRight, Activity, Battery, Settings, LogOut, User, Bell, Lock, Shield } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Component to handle map interactions and centering
const LocationPicker = ({ position, setPosition, center }) => {
  const map = useMap();

  useEffect(() => {
    if (center && map) {
      map.flyTo(center, map.getZoom());
    }
  }, [center, map]);

  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    }
  });

  return position ? (
    <Marker position={{ lat: position[0], lng: position[1] }}>
      <Popup>Selected location: {position[0].toFixed(6)}, {position[1].toFixed(6)}</Popup>
    </Marker>
  ) : null;
};

// Component for location search using Nominatim API
const LocationSearch = ({ onLocationSelect }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchLocations = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5&countrycodes=in&addressdetails=1&extratags=1`
      );
      const data = await response.json();

      const formattedSuggestions = data.map(item => ({
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        label: item.display_name,
        type: item.type,
        address: {
          city: item.address?.city || item.address?.town || item.address?.village || '',
          state: item.address?.state || '',
          country: item.address?.country || '',
          postcode: item.address?.postcode || '',
          formatted: item.display_name || ''
        }
      }));

      setSuggestions(formattedSuggestions);
    } catch (error) {
      console.error('Location search error:', error);
      setSuggestions([]);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchLocations(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSuggestionClick = (suggestion) => {
    onLocationSelect({
      lat: suggestion.lat,
      lng: suggestion.lng,
      address: suggestion.address.formatted,
      city: suggestion.address.city,
      state: suggestion.address.state,
      country: suggestion.address.country,
      postcode: suggestion.address.postcode
    });
    setQuery(suggestion.label);
    setShowSuggestions(false);
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search for a location (e.g., Delhi, Mumbai)..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => {
          // Delay hiding suggestions to allow clicks
          setTimeout(() => setShowSuggestions(false), 200);
        }}
        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-xl mt-1 shadow-lg max-h-48 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <div className="font-medium text-gray-900 text-sm">{suggestion.label}</div>
              <div className="text-xs text-gray-500 mt-1">
                {suggestion.address.city && `${suggestion.address.city}, `}
                {suggestion.address.state && `${suggestion.address.state}, `}
                {suggestion.address.country}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Use the shared API service for real backend calls
import apiService from '../services/api';
import Button from './ui/Button';
import ConfirmDialog from './ui/ConfirmDialog';

export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [stats, setStats] = useState({ totalStations: 0, totalManagers: 0, totalBookings: 0, totalUsers: 0, totalRevenue: 0, totalEnergy: 0 });
  const [stations, setStations] = useState([]);
  const [managers, setManagers] = useState([]);
  const [users, setUsers] = useState([]);
  const [energyData, setEnergyData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [chargingTypeData, setChargingTypeData] = useState([]);
  const [peakHoursData, setPeakHoursData] = useState([]);
  const [stationUtilization, setStationUtilization] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    loading: false
  });

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'];
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'station' or 'manager'
  const [modalMode, setModalMode] = useState(''); // 'create' or 'edit'
  const [editingItem, setEditingItem] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
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

  const fetchAll = async () => {
    setLoading(true);
    try {
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
  }, []);

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

  const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
          {change && (
            <p className="text-sm text-emerald-600 mt-2 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              {change}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const OverviewTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Stations" value={stats.totalStations} change="+12% from last month" icon={MapPin} color="bg-emerald-600" />
        <StatCard title="Total Managers" value={stats.totalManagers} change="+8% from last month" icon={Users} color="bg-blue-600" />
        <StatCard title="Total Bookings" value={stats.totalBookings} change="+23% from last month" icon={Calendar} color="bg-purple-600" />
        <StatCard title="Total Users" value={stats.totalUsers} change="+15% from last month" icon={Users} color="bg-orange-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Energy Consumption</h3>
              <p className="text-sm text-gray-500">Weekly energy usage trends</p>
            </div>
            <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={energyData}>
              <defs>
                <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="energy" 
                stroke="#10b981" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorEnergy)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Bookings Overview</h3>
              <p className="text-sm text-gray-500">Daily booking statistics</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={energyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="bookings" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Revenue Trends</h3>
              <p className="text-sm text-gray-500">Monthly revenue vs target</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs">
                <span className="w-3 h-3 bg-emerald-600 rounded-full"></span>
                Actual
              </span>
              <span className="flex items-center gap-1 text-xs">
                <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
                Target
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value) => `₹${value.toLocaleString()}`}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="target" 
                stroke="#d1d5db" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#d1d5db', r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Charging Types</h3>
            <p className="text-sm text-gray-500">Distribution by type</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={chargingTypeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {chargingTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {chargingTypeData.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Peak Usage Hours</h3>
            <p className="text-sm text-gray-500">Hourly station utilization</p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={peakHoursData}>
              <defs>
                <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="hour" stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="usage" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorUsage)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Station Utilization</h3>
            <p className="text-sm text-gray-500">Current capacity usage</p>
          </div>
          <div className="space-y-4">
            {stationUtilization.map((station, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{station.name}</span>
                  <span className="text-sm font-bold text-gray-900">{station.value}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${station.value}%`,
                      backgroundColor: station.value > 80 ? '#ef4444' : station.value > 60 ? '#f59e0b' : '#10b981'
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <button className="text-sm text-emerald-600 font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {[
              { user: 'Alice Johnson', action: 'Completed booking', station: 'Downtown Hub', time: '2 min ago' },
              { user: 'Bob Williams', action: 'Started charging', station: 'Airport Station', time: '15 min ago' },
              { user: 'Charlie Brown', action: 'Completed booking', station: 'Mall Parking', time: '1 hour ago' },
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-semibold">
                  {activity.user[0]}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                  <p className="text-xs text-gray-500">{activity.action} at {activity.station}</p>
                </div>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Battery className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Energy Statistics</h3>
              <p className="text-emerald-100 text-sm">Real-time metrics</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-emerald-100 text-xs mb-1">Total Energy</p>
              <p className="text-2xl font-bold">{stats.totalEnergy} kWh</p>
              <p className="text-emerald-200 text-xs mt-1">+12% this month</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-emerald-100 text-xs mb-1">Avg. Session</p>
              <p className="text-2xl font-bold">45 min</p>
              <p className="text-emerald-200 text-xs mt-1">-5% vs last week</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-emerald-100 text-xs mb-1">Active Sessions</p>
              <p className="text-2xl font-bold">28</p>
              <p className="text-emerald-200 text-xs mt-1">Across 12 stations</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-emerald-100 text-xs mb-1">CO₂ Saved</p>
              <p className="text-2xl font-bold">1.2t</p>
              <p className="text-emerald-200 text-xs mt-1">This month</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">System Performance</h3>
            <p className="text-emerald-100 mb-6">Overall system metrics and health status</p>
            <div className="grid grid-cols-3 gap-8">
              <div>
                <p className="text-emerald-200 text-sm mb-1">Total Revenue</p>
                <p className="text-3xl font-bold">₹{(stats.totalRevenue / 1000).toFixed(1)}k</p>
              </div>
              <div>
                <p className="text-emerald-200 text-sm mb-1">Energy Delivered</p>
                <p className="text-3xl font-bold">{stats.totalEnergy} kWh</p>
              </div>
              <div>
                <p className="text-emerald-200 text-sm mb-1">Uptime</p>
                <p className="text-3xl font-bold">99.8%</p>
              </div>
            </div>
          </div>
          <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center">
            <Zap className="w-16 h-16" />
          </div>
        </div>
      </div>
    </div>
  );

  const StationsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search stations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
        <button
          onClick={() => openModal('station', 'create')}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl hover:bg-emerald-700 font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Station
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {stations.filter(s => (s?.name || '').toLowerCase().includes(searchQuery.toLowerCase())).map((station) => (
          <div key={station.station_id} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{station.name}</h3>
                <p className="text-sm text-gray-500 flex items-center gap-1 mb-1">
                  <MapPin className="w-4 h-4" />
                  {station.address}, {station.city}{station.country && `, ${station.country}`}{station.state && `, ${station.state}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openModal('station', 'edit', station)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDeleteStation(station)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Capacity</p>
                <p className="text-xl font-bold text-gray-900">{station.capacity || 'N/A'}</p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-3">
                <p className="text-xs text-emerald-700 mb-1">Available</p>
                <p className="text-xl font-bold text-emerald-600">{station.available_slots}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2">Manager</p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-semibold text-sm">
                  {(station.managers && station.managers[0] && (station.managers[0].name || station.managers[0].email) ? (station.managers[0].name || station.managers[0].email)[0] : 'U')}
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {(station.managers && station.managers[0] && (station.managers[0].name || station.managers[0].email)) || 'Unassigned'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ManagersTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search managers..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
        <button
          onClick={() => openModal('manager', 'create')}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl hover:bg-emerald-700 font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Manager
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(managers || []).map((manager) => (
          <div key={manager?.id || manager?.email || manager?.name} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                {((manager && (manager.name || manager.name)) || (manager && manager.email) || 'U')[0]}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openModal('manager', 'edit', manager)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDeleteManager(manager)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-1">{manager.name || manager.name || manager.email || 'Unnamed'}</h3>
            <p className="text-sm text-gray-500 mb-4">{manager.email || '—'}</p>

            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2">Assigned Stations</p>
              <div className="space-y-1">
                {(manager.stations || []).map((station, i) => (
                  <div key={i} className="text-sm text-gray-900 flex items-center gap-1">
                    <ChevronRight className="w-3 h-3 text-gray-400" />
                    {station?.name || station?.station_name || station?.id || station?.station_id || 'Unknown'}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const UsersTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">User</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Total Bookings</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(users || []).map((user) => {
               const displayName = user?.name || user?.name || user?.email || 'Unknown';
               const initial = displayName ? displayName.charAt(0) : '?';
               const email = user?.email || '—';
               const totalBookings = (user && (user.total_bookings ?? user.totalBookings ?? user.bookings_count)) || 0;

              return (
                <tr key={user?.id || displayName} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                        {initial}
                      </div>
                      <span className="font-medium text-gray-900">{displayName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{email}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{totalBookings}</td>
                  <td className="px-6 py-4">
                    <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">View Details</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const ReportsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">System Reports</h2>
        <button className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl hover:bg-emerald-700 font-medium transition-colors">
          <Download className="w-5 h-5" />
          Export All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { title: 'Monthly Revenue Report', desc: 'Detailed revenue analysis for the current month', date: 'October 2025' },
          { title: 'Station Utilization Report', desc: 'Usage statistics and availability metrics', date: 'Last 30 days' },
          { title: 'User Activity Report', desc: 'User engagement and booking patterns', date: 'Last 90 days' },
          { title: 'Energy Consumption Report', desc: 'Total energy delivered across all stations', date: 'Year to date' },
        ].map((report, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-emerald-600" />
              </div>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Download className="w-4 h-4" />
              </button>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{report.title}</h3>
            <p className="text-sm text-gray-500 mb-4">{report.desc}</p>
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-400">{report.date}</span>
              <button className="text-sm text-emerald-600 font-medium hover:text-emerald-700">View Report</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const Modal = () => {
    const [formData, setFormData] = useState(editingItem || {});
    const [modalSubmitting, setModalSubmitting] = useState(false);
    const [mapPosition, setMapPosition] = useState(editingItem && editingItem.lat && editingItem.long ? [editingItem.lat, editingItem.long] : null);
    const [mapCenter, setMapCenter] = useState([28.6139, 77.2090]); // Default to Delhi

    useEffect(() => {
      if (modalType === 'station') {
        // Try to get user's current location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              setMapCenter([latitude, longitude]);
            },
            (error) => {
              console.log('Geolocation error:', error);
              // Keep default Delhi location
            },
            { enableHighAccuracy: true, timeout: 10000 }
          );
        }
      }
    }, [modalType]);

    useEffect(() => {
      // Normalize editingItem for station/manager forms
      if (editingItem) {
        // If manager has stations, extract station ids
        const mgr = editingItem;
        const station_ids = (mgr.stations || []).map(s => s.station_id || s.id || s.station_id);
        setFormData({ ...editingItem, station_ids });
      } else {
        setFormData({});
      }
    }, [editingItem]);

    useEffect(() => {
      if (mapPosition) {
        setFormData({ ...formData, lat: mapPosition[0], long: mapPosition[1] });
      }
    }, [mapPosition]);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setModalSubmitting(true);
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
            station_ids: formData.station_ids || []
          };

          if (modalMode === 'create') {
            await apiService.createStationManager(payload);
            toast.success('Manager created');
          } else {
            const id = editingItem?.id;
            await apiService.updateStationManager(id, payload);
            toast.success('Manager updated');
          }
        }

        closeModal();
        fetchAll();
      } catch (err) {
        console.error('Submit error:', err);
        toast.error('Failed to save. See console for details.');
      } finally {
        setModalSubmitting(false);
      }
    };

    if (!showModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900">
              {modalMode === 'create' ? 'Add New' : 'Edit'} {modalType === 'station' ? 'Station' : 'Manager'}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {modalType === 'station' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Station Name</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <div style={{ zIndex: 1000, position: 'relative' }}>
                    <GooglePlacesAutocomplete
                      selectProps={{
                        placeholder: 'Search for a location...',
                        onChange: (place) => {
                          if (place && place.value && place.value.place_id) {
                            // Get place details using Google Maps Places Service
                            const service = new window.google.maps.places.PlacesService(
                              new window.google.maps.Map(document.createElement('div'))
                            );

                            service.getDetails(
                              {
                                placeId: place.value.place_id,
                                fields: ['formatted_address', 'geometry', 'address_components']
                              },
                              (details, status) => {
                                if (status === window.google.maps.places.PlacesServiceStatus.OK && details) {
                                  // Extract coordinates
                                  const lat = details.geometry.location.lat();
                                  const lng = details.geometry.location.lng();

                                  // Extract address components
                                  let city = '';
                                  let state = '';
                                  let country = '';
                                  let zipCode = '';

                                  if (details.address_components) {
                                    details.address_components.forEach(component => {
                                      if (component.types.includes('locality')) {
                                        city = component.long_name;
                                      } else if (component.types.includes('administrative_area_level_1')) {
                                        state = component.long_name;
                                      } else if (component.types.includes('country')) {
                                        country = component.long_name;
                                      } else if (component.types.includes('postal_code')) {
                                        zipCode = component.long_name;
                                      }
                                    });
                                  }

                                  // Update form data
                                  setFormData({
                                    ...formData,
                                    address: details.formatted_address || place.label,
                                    city: city,
                                    state: state || formData.state,
                                    country: country || formData.country,
                                    zip_code: zipCode || formData.zip_code,
                                    lat: lat,
                                    long: lng
                                  });

                                  // Update map position and center
                                  setMapPosition([lat, lng]);
                                  setMapCenter([lat, lng]);
                                }
                              }
                            );
                          }
                        },
                        styles: {
                          input: (provided) => ({
                            ...provided,
                            fontSize: '14px',
                            padding: '12px 16px',
                            border: '1px solid #d1d5db',
                            borderRadius: '12px',
                            boxShadow: 'none',
                            '&:focus': {
                              borderColor: '#10b981',
                              boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.1)',
                            }
                          }),
                          control: (provided) => ({
                            ...provided,
                            border: '1px solid #d1d5db',
                            borderRadius: '12px',
                            boxShadow: 'none',
                            '&:hover': {
                              borderColor: '#9ca3af',
                            },
                            '&:focus-within': {
                              borderColor: '#10b981',
                              boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.1)',
                            }
                          }),
                          option: (provided, state) => ({
                            ...provided,
                            fontSize: '14px',
                            padding: '12px 16px',
                            backgroundColor: state.isSelected ? '#10b981' : 'white',
                            color: state.isSelected ? 'white' : '#374151',
                            '&:hover': {
                              backgroundColor: state.isSelected ? '#10b981' : '#f3f4f6',
                            }
                          }),
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      value={formData.city || ''}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input
                      type="text"
                      value={formData.address || ''}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.lat || ''}
                      onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.long || ''}
                      onChange={(e) => setFormData({ ...formData, long: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
                    <input
                      type="number"
                      value={formData.capacity || ''}
                      onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="kW"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Available Slots</label>
                    <input
                      type="number"
                      value={formData.available_slots || ''}
                      onChange={(e) => setFormData({ ...formData, available_slots: parseInt(e.target.value) })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-2">Location Preview - Click on map to select location</p>
                  <div className="bg-white rounded-lg h-64 overflow-hidden">
                    <GoogleMap
                      mapContainerStyle={{ height: '100%', width: '100%' }}
                      center={{ lat: mapCenter[0], lng: mapCenter[1] }}
                      zoom={10}
                      onClick={(e) => {
                        const lat = e.latLng.lat();
                        const lng = e.latLng.lng();
                        setMapPosition([lat, lng]);
                      }}
                      options={{
                        zoomControl: true,
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: true
                      }}
                    >
                      <LocationPicker position={mapPosition} setPosition={setMapPosition} onMapClick={() => {}} />
                    </GoogleMap>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assign Stations</label>
                  <select
                      multiple
                      value={formData.station_ids || []}
                      onChange={(e) => {
                        const vals = Array.from(e.target.selectedOptions).map(o => o.value);
                          setFormData({ ...formData, station_ids: vals });
                      }}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {stations.map((station) => (
                      <option key={station.station_id} value={station.station_id}>
                        {station.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple stations</p>
                </div>
              </>
            )}

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <Button
                type="button"
                onClick={closeModal}
                variant="outline"
                className="px-6 py-2.5"
              >
                Cancel
              </Button>
              <Button type="submit" loading={modalSubmitting} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700" variant="primary">
                {modalMode === 'create' ? 'Create' : 'Update'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const ProfileModal = () => {
    const [profileForm, setProfileForm] = useState(adminProfile);
    const [activeProfileTab, setActiveProfileTab] = useState('personal');
    const [passwordForm, setPasswordForm] = useState({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    const [profileSubmitting, setProfileSubmitting] = useState(false);
    const [passwordSubmitting, setPasswordSubmitting] = useState(false);

    useEffect(() => {
      setProfileForm(adminProfile);
    }, [adminProfile]);

    const handleProfileUpdate = (e) => {
      e.preventDefault();
      (async () => {
        setProfileSubmitting(true);
        try {
          const res = await apiService.updateProfile(profileForm);
          setAdminProfile(res || profileForm);
          toast.success('Profile updated successfully!');
          setShowProfileModal(false);
        } catch (err) {
          console.error(err);
          toast.error('Failed to update profile');
        } finally {
          setProfileSubmitting(false);
        }
      })();
    };

    const handlePasswordChange = (e) => {
      e.preventDefault();
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        toast.error('Passwords do not match!');
        return;
      }
      (async () => {
        setPasswordSubmitting(true);
        try {
          await apiService.updateProfile({ password: passwordForm.newPassword });
          toast.success('Password changed successfully!');
          setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
          console.error(err);
          toast.error('Failed to change password');
        } finally {
          setPasswordSubmitting(false);
        }
      })();
    };

    if (!showProfileModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="relative">
            <div className="h-32 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-t-2xl"></div>
            <div className="px-8 pb-6">
              <div className="relative -mt-16 mb-6">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                  {adminProfile.name[0]}
                </div>
                <button className="absolute bottom-2 right-2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-emerald-600 hover:bg-emerald-50">
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>

              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{adminProfile.name}</h2>
                <p className="text-gray-500">{adminProfile.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                    {adminProfile.role}
                  </span>
                  <span className="text-xs text-gray-500">Joined {adminProfile.joined}</span>
                </div>
              </div>

              <div className="flex gap-2 mb-6 border-b border-gray-200">
                <button
                  onClick={() => setActiveProfileTab('personal')}
                  className={`px-4 py-2 font-medium transition-colors ${
                    activeProfileTab === 'personal'
                      ? 'text-emerald-600 border-b-2 border-emerald-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Personal Info
                </button>
                <button
                  onClick={() => setActiveProfileTab('security')}
                  className={`px-4 py-2 font-medium transition-colors ${
                    activeProfileTab === 'security'
                      ? 'text-emerald-600 border-b-2 border-emerald-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Security
                </button>
                <button
                  onClick={() => setActiveProfileTab('notifications')}
                  className={`px-4 py-2 font-medium transition-colors ${
                    activeProfileTab === 'notifications'
                      ? 'text-emerald-600 border-b-2 border-emerald-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Notifications
                </button>
              </div>

              {activeProfileTab === 'personal' && (
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                      <input
                        type="text"
                        value={profileForm.role}
                        disabled
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setShowProfileModal(false)} className="px-6 py-2.5">
                      Cancel
                    </Button>
                    <Button type="submit" loading={profileSubmitting} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700" variant="primary">
                      Save Changes
                    </Button>
                  </div>
                </form>
              )}

              {activeProfileTab === 'security' && (
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900 mb-1">Password Requirements</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• At least 8 characters long</li>
                          <li>• Include uppercase and lowercase letters</li>
                          <li>• Include at least one number</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setShowProfileModal(false)} className="px-6 py-2.5">
                      Cancel
                    </Button>
                    <Button type="submit" loading={passwordSubmitting} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700" variant="primary">
                      Change Password
                    </Button>
                  </div>
                </form>
              )}

              {activeProfileTab === 'notifications' && (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900">Email Notifications</h4>
                        <p className="text-sm text-gray-500">Receive updates via email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900">Booking Alerts</h4>
                        <p className="text-sm text-gray-500">Get notified of new bookings</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900">System Updates</h4>
                        <p className="text-sm text-gray-500">Important system announcements</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowProfileModal(false)}
                      className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
  )};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">EV Charge</span>
        </div>

        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-emerald-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            Overview
          </button>

          <button
            onClick={() => setActiveTab('stations')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              activeTab === 'stations'
                ? 'bg-emerald-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <MapPin className="w-5 h-5" />
            Stations
          </button>

          <button
            onClick={() => setActiveTab('managers')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              activeTab === 'managers'
                ? 'bg-emerald-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Users className="w-5 h-5" />
            Managers
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              activeTab === 'users'
                ? 'bg-emerald-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Users className="w-5 h-5" />
            Users
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              activeTab === 'reports'
                ? 'bg-emerald-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Download className="w-5 h-5" />
            Reports
          </button>
        </nav>

        <div className="absolute bottom-6 left-6 right-6 space-y-4">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <User className="w-5 h-5" />
            <div className="flex-1 text-left">Admin User</div>
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h1>
              <p className="text-gray-500">Manage and monitor your EV charging infrastructure</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-semibold">
                {adminProfile.name[0]}
              </div>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'stations' && <StationsTab />}
            {activeTab === 'managers' && <ManagersTab />}
            {activeTab === 'users' && <UsersTab />}
            {activeTab === 'reports' && <ReportsTab />}
          </>
        )}
      </main>

      <Modal />
      <ProfileModal />
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
