import React, { useState, useEffect } from 'react';
import { MapPin, Activity, DollarSign, Zap, Battery, BarChart3, TrendingUp, Filter } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import EmptyState from './EmptyState';
import apiService from '../../services/api';

export default function StationsAnalyticsTab({
  stations,
  darkMode = false
}) {
  const [selectedStation, setSelectedStation] = useState(null);
  const [stationAnalytics, setStationAnalytics] = useState({});
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('7d'); // 7d, 30d, 90d

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'];

  useEffect(() => {
    if (stations.length > 0 && !selectedStation) {
      setSelectedStation(stations[0]);
    }
  }, [stations]);

  useEffect(() => {
    if (selectedStation) {
      fetchStationAnalytics(selectedStation.id);
    }
  }, [selectedStation, timeRange]);

  const fetchStationAnalytics = async (stationId) => {
    setLoading(true);
    try {
      // Calculate days based on time range
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;

      const [energyTrend, revenueTrend, chargerTypes, slots] = await Promise.all([
        apiService.getEnergyConsumptionAnalytics(days),
        apiService.getRevenueAnalytics(days),
        apiService.getChargingTypeAnalytics(days),
        apiService.getSlots(stationId)
      ]);

      // Filter data for this station only
      const stationEnergy = (energyTrend || []).filter(item => {
        // Since we can't filter by station in the current API, we'll show all data
        // In a real implementation, you'd modify the API to accept station_id
        return true;
      });

      const stationRevenue = (revenueTrend || []).filter(item => {
        return true;
      });

      // Process data for charts
      const processedEnergy = stationEnergy.map(item => ({
        ...item,
        day: new Date(item.date).toLocaleDateString(undefined, { weekday: 'short' }),
        energy: item.energy_kwh || 0
      }));

      const processedRevenue = stationRevenue.map(item => ({
        ...item,
        day: new Date(item.date).toLocaleDateString(undefined, { weekday: 'short' }),
        revenue: item.revenue || 0
      }));

      // Calculate slot status for this station
      const stationSlots = slots || [];
      const availableSlots = stationSlots.filter(slot => slot.status === 'available').length;
      const occupiedSlots = stationSlots.filter(slot => slot.status === 'occupied').length;
      const underMaintenanceSlots = stationSlots.filter(slot => slot.status === 'under_maintenance').length;

      // Calculate charger types from station slots instead of analytics API
      const chargerTypeCounts = {};
      const connectorTypeCounts = {};
      stationSlots.forEach(slot => {
        const chargerType = slot.charger_type || 'Unknown';
        const connectorType = slot.connector_type || 'Unknown';
        chargerTypeCounts[chargerType] = (chargerTypeCounts[chargerType] || 0) + 1;
        connectorTypeCounts[connectorType] = (connectorTypeCounts[connectorType] || 0) + 1;
      });

      const processedChargerTypes = Object.entries(chargerTypeCounts).map(([name, value], i) => ({
        name,
        value,
        color: COLORS[i % COLORS.length]
      }));

      const processedConnectorTypes = Object.entries(connectorTypeCounts).map(([name, value], i) => ({
        name,
        value,
        color: COLORS[i % COLORS.length]
      }));

      const slotStatusData = [
        { name: 'Available', value: availableSlots, color: '#10b981' },
        { name: 'Occupied', value: occupiedSlots, color: '#f59e0b' },
        { name: 'Under Maintenance', value: underMaintenanceSlots, color: '#ef4444' },
      ].filter(item => item.value > 0); // Only show categories with values > 0

      setStationAnalytics({
        energyData: processedEnergy,
        revenueData: processedRevenue,
        chargerTypeData: processedChargerTypes,
        connectorTypeData: processedConnectorTypes,
        slotStatusData,
        slots: stationSlots,
        availableSlotsCount: availableSlots
      });

    } catch (error) {
      console.error('Error fetching station analytics:', error);
      setStationAnalytics({
        energyData: [],
        revenueData: [],
        chargerTypeData: [],
        slotStatusData: [],
        slots: []
      });
    } finally {
      setLoading(false);
    }
  };

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case '7d': return 'Last 7 days';
      case '30d': return 'Last 30 days';
      case '90d': return 'Last 90 days';
      default: return 'Last 7 days';
    }
  };

  if (!selectedStation) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Station Analytics</h2>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Detailed analytics for each station</p>
          </div>
        </div>
        <EmptyState message="No stations available" icon={MapPin} darkMode={darkMode} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */} 
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Station Analytics</h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Detailed analytics and performance metrics</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Station Selector */}
          <div className="flex items-center gap-2">
            <Filter className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <select
              value={selectedStation?.id || ''}
              onChange={(e) => {
                const station = stations.find(s => s.id === e.target.value);
                setSelectedStation(station);
              }}
              className={`px-4 py-2.5 border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm`}
            >
              {stations.map(station => (
                <option key={station.id} value={station.id}>
                  {station.name}
                </option>
              ))}
            </select>
          </div>

          {/* Time Range Selector */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className={`px-4 py-2.5 border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm`}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Station Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl p-4 md:p-6 border`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Slots</p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {selectedStation.capacity || 0}
              </p>
            </div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl p-4 md:p-6 border`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Available Slots</p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {stationAnalytics.availableSlotsCount || 0}
              </p>
            </div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl p-4 md:p-6 border`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Revenue</p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                ₹{stationAnalytics.revenueData?.reduce((sum, item) => sum + (item.revenue || 0), 0)?.toLocaleString() || '0'}
              </p>
            </div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl p-4 md:p-6 border`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Energy Delivered</p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {stationAnalytics.energyData?.reduce((sum, item) => sum + (item.energy || 0), 0)?.toFixed(1) || '0'} kWh
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl p-6 border`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Revenue Trend</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{getTimeRangeLabel()}</p>
            </div>
            <TrendingUp className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
          ) : stationAnalytics.revenueData && stationAnalytics.revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={stationAnalytics.revenueData}>
                <defs>
                  <linearGradient id="colorRevenueStation" x1="0" y1="0" x2="0" y2="1">
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
                  formatter={(value) => [`₹${value}`, 'Revenue']}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenueStation)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No revenue data available</p>
            </div>
          )}
        </div>

        {/* Energy Consumption */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl p-6 border`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Energy Consumption</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{getTimeRangeLabel()}</p>
            </div>
            <BarChart3 className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
          ) : stationAnalytics.energyData && stationAnalytics.energyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={stationAnalytics.energyData}>
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
                  formatter={(value) => [`${value} kWh`, 'Energy']}
                />
                <Bar dataKey="energy" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No energy data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row: Charger Types, Connector Types, and Slot Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Charger Types */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl p-6 border`}>
          <div className="mb-6">
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Charger Types</h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Distribution by type</p>
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
          ) : stationAnalytics.chargerTypeData && stationAnalytics.chargerTypeData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={stationAnalytics.chargerTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stationAnalytics.chargerTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || '#8884d8'} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? '#1f2937' : 'white',
                      border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                      color: darkMode ? '#fff' : '#000'
                    }}
                    formatter={(value, name) => [`${value} slots`, 'Count']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {stationAnalytics.chargerTypeData.map((item, i) => (
                  <div key={`charger-${i}`} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color || '#8884d8' }}></div>
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{item.name || 'Unknown'}</span>
                    </div>
                    <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.value || 0}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-32">
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No charger type data available</p>
            </div>
          )}
        </div>

        {/* Connector Types */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl p-6 border`}>
          <div className="mb-6">
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Connector Types</h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Distribution by connector</p>
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
          ) : stationAnalytics.connectorTypeData && stationAnalytics.connectorTypeData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={stationAnalytics.connectorTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stationAnalytics.connectorTypeData.map((entry, index) => (
                      <Cell key={`connector-cell-${index}`} fill={entry.color || '#8884d8'} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? '#1f2937' : 'white',
                      border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                      color: darkMode ? '#fff' : '#000'
                    }}
                    formatter={(value, name) => [`${value} slots`, 'Count']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {stationAnalytics.connectorTypeData.map((item, i) => (
                  <div key={`connector-${i}`} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color || '#8884d8' }}></div>
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{item.name || 'Unknown'}</span>
                    </div>
                    <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.value || 0}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-32">
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No connector type data available</p>
            </div>
          )}
        </div>

        {/* Slot Status */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl p-6 border`}>
          <div className="mb-6">
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Slot Status</h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Current distribution</p>
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
          ) : stationAnalytics.slotStatusData && stationAnalytics.slotStatusData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={stationAnalytics.slotStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stationAnalytics.slotStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1f2937' : 'white', border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`, color: darkMode ? '#fff' : '#000' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {stationAnalytics.slotStatusData.map((item, i) => (
                  <div key={`status-${i}`} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{item.name}</span>
                    </div>
                    <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-32">
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No slot data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
