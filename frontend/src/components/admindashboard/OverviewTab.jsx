import React, { useEffect, useState } from 'react';
import { BarChart3, Plus, Edit2, Trash2, Search, Download, Activity, Battery, Settings, TrendingUp } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import StatCard from './StatCard';

export default function OverviewTab({
  stats,
  energyData,
  revenueData,
  chargingTypeData,
  peakHoursData,
  stationUtilization,
  realTimeStats
}) {
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'];
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivityLogs = async () => {
      try {
        const response = await fetch('http://localhost:8000/activity/admin', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const logs = await response.json();
          setActivityLogs(logs.slice(0, 10)); // Get latest 10 activities
        } else {
          console.error('Failed to fetch activity logs:', response.status);
        }
      } catch (error) {
        console.error('Error fetching activity logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivityLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Stations" value={stats.totalStations} change="+12% from last month" icon={BarChart3} color="bg-emerald-600" />
        <StatCard title="Total Managers" value={stats.totalManagers} change="+8% from last month" icon={Activity} color="bg-blue-600" />
        <StatCard title="Total Bookings" value={stats.totalBookings} change="+23% from last month" icon={TrendingUp} color="bg-purple-600" />
        <StatCard title="Total Users" value={stats.totalUsers} change="+15% from last month" icon={Activity} color="bg-orange-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-900">Energy Consumption</h3>
                <div className="flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  Live
                </div>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Peak Usage Hours</h3>
            <p className="text-sm text-gray-500">Hourly station utilization</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
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
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <button className="text-sm text-emerald-600 font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">Loading activity logs...</p>
              </div>
            ) : activityLogs.length > 0 ? activityLogs.map((log, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  log.role === 'admin' ? 'bg-blue-100 text-blue-600' :
                  log.role === 'station_manager' ? 'bg-purple-100 text-purple-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {(log.user_name || 'U')[0].toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{log.user_name || 'Unknown User'}</p>
                  <p className="text-xs text-gray-500">{log.description || 'Unknown action'}</p>
                </div>
                <span className="text-xs text-gray-400">
                  {log.created_at ? new Date(log.created_at).toLocaleString() : 'N/A'}
                </span>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No recent activity to display</p>
                <p className="text-xs mt-1">Activity logs will appear here as users interact with the system</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              <p className="text-2xl font-bold">{realTimeStats.averageSessionDuration}</p>
              <p className="text-emerald-200 text-xs mt-1">Per charging session</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-emerald-100 text-xs mb-1">Active Sessions</p>
              <p className="text-2xl font-bold">{realTimeStats.activeSessions}</p>
              <p className="text-emerald-200 text-xs mt-1">Currently charging</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-emerald-100 text-xs mb-1">CO₂ Saved</p>
              <p className="text-2xl font-bold">{realTimeStats.co2Saved}</p>
              <p className="text-emerald-200 text-xs mt-1">This month</p>
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
              <TrendingUp className="w-16 h-16" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
