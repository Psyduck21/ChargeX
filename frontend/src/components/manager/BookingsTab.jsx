import React, { useState, useMemo } from 'react';
import { Calendar, Download, Grid, List, Search } from 'lucide-react';
import EmptyState from './EmptyState';

export default function BookingsTab({
  bookings,
  darkMode = false,
  onExport = () => {}
}) {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      const matchesSearch = booking.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            booking.user_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            booking.station.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterStatus === 'all' || booking.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [bookings, searchQuery, filterStatus]);

  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  const statusStats = useMemo(() => {
    return {
      active: bookings.filter(b => b.status === 'active').length,
      completed: bookings.filter(b => b.status === 'completed').length,
      pending: bookings.filter(b => b.status === 'pending').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length,
    };
  }, [bookings]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'completed': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300';
      case 'pending': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
      case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={`px-4 py-2 border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'} rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500`}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            onClick={onExport}
            className="p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 dark:bg-blue-900/20 dark:border-blue-800">
          <p className="text-sm text-blue-700 dark:text-blue-300 mb-1">Active Bookings</p>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            {statusStats.active}
          </p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 dark:bg-emerald-900/20 dark:border-emerald-800">
          <p className="text-sm text-emerald-700 dark:text-emerald-300 mb-1">Completed Today</p>
          <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
            {statusStats.completed}
          </p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 dark:bg-orange-900/20 dark:border-orange-800">
          <p className="text-sm text-orange-700 dark:text-orange-300 mb-1">Pending</p>
          <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
            {statusStats.pending}
          </p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 dark:bg-red-900/20 dark:border-red-800">
          <p className="text-sm text-red-700 dark:text-red-300 mb-1">Cancelled</p>
          <p className="text-2xl font-bold text-red-900 dark:text-red-100">
            {statusStats.cancelled}
          </p>
        </div>
      </div>

      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl p-4 border`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500`}
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-emerald-100 text-emerald-600' : darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-emerald-100 text-emerald-600' : darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <EmptyState message="No bookings found" icon={Calendar} darkMode={darkMode} />
        ) : viewMode === 'list' ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <tr>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase`}>User</th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase`}>Station</th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase`}>Slot</th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase`}>Time</th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase`}>Energy</th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase`}>Status</th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase`}>Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
                {paginatedBookings.map((booking) => (
                  <tr key={booking.id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                    <td className="px-6 py-4">
                      <div>
                        <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{booking.user_name}</p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{booking.user_email}</p>
                      </div>
                    </td>
                    <td className={`px-6 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>{booking.station}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'} rounded-lg text-sm font-medium`}>
                        {booking.slot}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>{booking.start_time}</td>
                    <td className={`px-6 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>{booking.energy} kWh</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedBookings.map((booking) => (
              <div key={booking.id} className={`${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} border rounded-xl p-4 hover:shadow-lg transition-shadow`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{booking.user_name}</h4>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{booking.user_email}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Station:</span>
                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{booking.station}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Slot:</span>
                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{booking.slot}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Time:</span>
                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{booking.start_time}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Energy:</span>
                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{booking.energy} kWh</span>
                  </div>
                </div>
                <button className="w-full mt-4 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 text-sm font-medium">
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredBookings.length)} of {filteredBookings.length} results
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg ${page === currentPage ? 'bg-emerald-600 text-white' : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
