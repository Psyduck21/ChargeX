import React, { useState, useEffect } from 'react';
import { MapPin, Activity, DollarSign, Zap } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from '../admindashboard/StatCard';
import EmptyState from './EmptyState';
import apiService from '../../services/api';

export default function OverviewTab({
  stations,
  revenueData,
  energyData,
  chargerTypeData,
  slotStatusData,
  darkMode = false
}) {
  const [chargingSessions, setChargingSessions] = useState([]);

  useEffect(() => {
    const fetchChargingSessions = async () => {
      try {
        const sessions = await apiService.getManagerSessions();
        setChargingSessions(sessions);
      } catch (error) {
        console.error('Failed to fetch charging sessions:', error);
      }
    };

    fetchChargingSessions();
  }, []);

  const totalSlots = stations.reduce((sum, s) => sum + s.capacity, 0);
  const availableSlots = stations.reduce((sum, s) => sum + s.available_slots, 0);
  const occupiedSlots = stations.reduce((sum, s) => sum + (s.capacity - s.available_slots), 0);

  // Calculate today's revenue and energy from charging sessions
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  const todaysSessions = chargingSessions.filter(session => {
    const sessionDate = new Date(session.start_time).toISOString().split('T')[0];
    return sessionDate === today && session.cost && session.energy_consumed;
  });

  const totalRevenue = todaysSessions.reduce((sum, session) => sum + (session.cost || 0), 0);
  const totalEnergy = todaysSessions.reduce((sum, session) => sum + (session.energy_consumed || 0), 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Total Slots"
          value={totalSlots}
          subtitle={`${availableSlots} available`}
          icon={MapPin}
          color="bg-emerald-600"
          tooltip="Total charging slots across all your stations"
          darkMode={darkMode}
        />
        <StatCard
          title="Active Bookings"
          value={occupiedSlots}
          change="+12% from yesterday"
          icon={Activity}
          color="bg-blue-600"
          tooltip="Currently active charging sessions"
          darkMode={darkMode}
        />
        <StatCard
          title="Today's Revenue"
          value={`₹${totalRevenue.toLocaleString()}`}
          change="+18% from yesterday"
          icon={DollarSign}
          color="bg-purple-600"
          tooltip="Total revenue generated today"
          darkMode={darkMode}
        />
        <StatCard
          title="Energy Delivered"
          value={`${totalEnergy} kWh`}
          change="+8% from yesterday"
          icon={Zap}
          color="bg-orange-600"
          tooltip="Total energy consumed today"
          darkMode={darkMode}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl p-4 md:p-6 border`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Revenue Trends</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Last 7 days</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#f0f0f0'} />
              <XAxis dataKey="day" stroke={darkMode ? '#9ca3af' : '#9ca3af'} style={{ fontSize: '12px' }} />
              <YAxis stroke={darkMode ? '#9ca3af' : '#9ca3af'} style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? '#1f2937' : 'white',
                  border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  color: darkMode ? '#fff' : '#000'
                }}
                formatter={(value) => `₹${value}`}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl p-4 md:p-6 border`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Energy Consumption</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Last 7 days</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={energyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#f0f0f0'} />
              <XAxis dataKey="day" stroke={darkMode ? '#9ca3af' : '#9ca3af'} style={{ fontSize: '12px' }} />
              <YAxis stroke={darkMode ? '#9ca3af' : '#9ca3af'} style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? '#1f2937' : 'white',
                  border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  color: darkMode ? '#fff' : '#000'
                }}
                formatter={(value) => `${value} kWh`}
              />
              <Bar dataKey="energy" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl p-4 md:p-6 border`}>
        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>My Stations</h3>
        {stations.length === 0 ? (
          <EmptyState message="No stations assigned yet" icon={MapPin} darkMode={darkMode} />
        ) : (
          <div className="space-y-4">
            {stations.map((station, index) => {
              // Calculate today's revenue for this station from charging sessions
              const stationTodaysSessions = todaysSessions.filter(session => session.station_id === station.station_id);
              const stationRevenue = stationTodaysSessions.reduce((sum, session) => sum + (session.cost || 0), 0);

              return (
                <div key={station.station_id || `station-${index}`} className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} rounded-xl p-4 transition-colors`}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 gap-3">
                    <div>
                      <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{station.name}</h4>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} flex items-center gap-1`}>
                        <MapPin className="w-3 h-3" />
                        {station.address}, {station.city}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-emerald-600">{station.available_slots}</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Available</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-3`}>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Total Slots</p>
                      <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{station.capacity}</p>
                    </div>
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-3`}>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Occupied</p>
                      <p className="text-lg font-bold text-orange-600">{station.capacity - station.available_slots}</p>
                    </div>
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-3`}>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Revenue</p>
                      <p className="text-lg font-bold text-purple-600">₹{stationRevenue.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
