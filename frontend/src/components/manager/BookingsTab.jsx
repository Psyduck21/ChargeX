import React, { useState, useMemo } from 'react';
import { Calendar, Download, Grid, List, Search } from 'lucide-react';
import EmptyState from './EmptyState';
import BookingDetailsModal from './BookingDetailsModal';

export default function BookingsTab({
  bookings = [],
  darkMode = false,
  onExport = () => {},
  onUpdate = () => {}
}) {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const itemsPerPage = 10;

  const filteredBookings = useMemo(() => {
    const q = (searchQuery || '').toLowerCase().trim();
    return (bookings || []).filter((booking) => {
      const userName = (booking.user_name || booking.user || '').toString().toLowerCase();
      const userEmail = (booking.user_email || booking.email || '').toString().toLowerCase();
      const stationName = (booking.station || booking.station_name || '').toString().toLowerCase();

      const matchesSearch = !q || userName.includes(q) || userEmail.includes(q) || stationName.includes(q);
      const matchesFilter = filterStatus === 'all' || (booking.status || '').toLowerCase() === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [bookings, searchQuery, filterStatus]);

  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / itemsPerPage));

  const statusStats = useMemo(() => {
    const s = { pending: 0, accepted: 0, active: 0, completed: 0, rejected: 0, cancelled: 0 };
    (bookings || []).forEach(b => {
      const st = (b.status || '').toLowerCase();
      if (st in s) s[st]++;
    });
    return s;
  }, [bookings]);

  const getStatusColor = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'pending': return 'bg-orange-500 text-white dark:bg-orange-500 dark:text-white';
      case 'accepted': return 'bg-yellow-500 text-white dark:bg-yellow-500 dark:text-white';
      case 'active': return 'bg-blue-500 text-white dark:bg-blue-500 dark:text-white';
      case 'completed': return 'bg-green-500 text-white dark:bg-green-500 dark:text-white';
      case 'rejected': return 'bg-red-500 text-white dark:bg-red-500 dark:text-white';
      default: return 'bg-gray-500 text-white dark:bg-gray-500 dark:text-white';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Bookings Overview</h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Manage and monitor booking requests</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className={`flex items-center border rounded-xl px-3 py-2 w-full md:w-auto ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <Search className={`w-4 h-4 mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className={`w-full md:min-w-[220px] bg-transparent text-sm focus:outline-none placeholder:text-gray-400 ${darkMode ? 'text-white' : 'text-gray-900'}`}
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
            className={`px-3 py-2 border rounded-xl text-sm focus:outline-none ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              aria-pressed={viewMode === 'grid'}
              className={`p-2 rounded-xl transition-colors ${viewMode === 'grid' ? 'bg-emerald-600 text-white' : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
              title="Grid"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              aria-pressed={viewMode === 'list'}
              className={`p-2 rounded-xl transition-colors ${viewMode === 'list' ? 'bg-emerald-600 text-white' : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
              title="List"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={onExport}
              className="flex items-center gap-2 px-3 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors text-sm"
              title="Export bookings"
            >
              <Download className="w-4 h-4" />
              <span className="hidden md:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active', value: statusStats.active, bgClass: 'bg-blue-500', iconClass: 'text-white', darkBgClass: 'dark:bg-blue-500', darkIconClass: 'dark:text-white' },
          { label: 'Completed', value: statusStats.completed, bgClass: 'bg-green-500', iconClass: 'text-white', darkBgClass: 'dark:bg-green-500', darkIconClass: 'dark:text-white' },
          { label: 'Pending', value: statusStats.pending, bgClass: 'bg-orange-500', iconClass: 'text-white', darkBgClass: 'dark:bg-orange-500', darkIconClass: 'dark:text-white' },
          { label: 'Accepted', value: statusStats.accepted, bgClass: 'bg-yellow-500', iconClass: 'text-white', darkBgClass: 'dark:bg-yellow-500', darkIconClass: 'dark:text-white' },
        ].map((card) => (
          <div key={card.label} className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl p-4 md:p-5 border`}>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.bgClass} ${card.darkBgClass}`}>
                <Calendar className={`w-5 h-5 ${card.iconClass} ${card.darkIconClass}`} />
              </div>
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{card.label}</p>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bookings content */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl p-4 border`}>
        {filteredBookings.length === 0 ? (
          <EmptyState message="No bookings found" icon={Calendar} darkMode={darkMode} />
        ) : viewMode === 'list' ? (
          <div className="overflow-auto">
            <table className="w-full min-w-[720px] table-fixed">
              <thead className={`${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                <tr>
                  <th className={`px-4 py-3 text-left text-xs font-semibold uppercase ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>User</th>
                  <th className={`px-4 py-3 text-left text-xs font-semibold uppercase ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Station</th>
                  <th className={`px-4 py-3 text-left text-xs font-semibold uppercase ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Slot</th>
                  <th className={`px-4 py-3 text-left text-xs font-semibold uppercase ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Time</th>
                  <th className={`px-4 py-3 text-left text-xs font-semibold uppercase ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Energy</th>
                  <th className={`px-4 py-3 text-left text-xs font-semibold uppercase ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Status</th>
                  <th className={`px-4 py-3 text-left text-xs font-semibold uppercase ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
                {paginatedBookings.map((booking) => (
                  <tr key={booking.id || booking.booking_id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                    <td className="px-4 py-3">
                      <div>
                        <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{booking.user_name || booking.user || 'User'}</p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{booking.user_email || booking.email || ''}</p>
                      </div>
                    </td>
                    <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{booking.station || booking.station_name || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'}`}>
                        {booking.slot_display || `${booking.slot_type || 'Unknown'} - ${booking.connector_type || 'Unknown'}`}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="whitespace-nowrap">
                        <div className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>{booking.start_time ? new Date(booking.start_time).toLocaleString() : '—'}</div>
                        {booking.end_time && <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{new Date(booking.end_time).toLocaleTimeString()}</div>}
                      </div>
                    </td>
                    <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{booking.energy ? `${booking.energy} kWh` : '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                        {(booking.status || 'unknown').toLowerCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          setSelectedBooking(booking);
                          setShowDetailsModal(true);
                        }}
                        className={`text-sm font-medium ${darkMode ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-700'}`}
                      >
                        View
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
              <div key={booking.id || booking.booking_id} className={`relative ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl p-4 border hover:shadow-lg transition-all`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Booking</h4>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{booking.user_name || booking.user || 'Unknown User'} • {booking.user_email || booking.email || 'No Email'}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                    {(booking.status || 'unknown').toLowerCase()}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className={`${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Station</span>
                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{booking.station || booking.station_name || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Slot</span>
                    <span className={`inline-block px-2 py-1 rounded-md text-xs font-semibold ${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'}`}>
                      {booking.slot_display || `${booking.slot_type || 'Unknown'} - ${booking.connector_type || 'Unknown'}`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Time</span>
                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{booking.start_time ? new Date(booking.start_time).toLocaleString() : '—'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Energy</span>
                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{booking.energy ? `${booking.energy} kWh` : '—'}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedBooking(booking);
                    setShowDetailsModal(true);
                  }}
                  className="w-full mt-4 bg-emerald-600 text-white px-4 py-2.5 rounded-xl hover:bg-emerald-700 transition-colors text-sm font-medium"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredBookings.length)} of {filteredBookings.length} results
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded-lg transition-colors ${currentPage === 1 ? darkMode ? 'bg-gray-800 text-gray-600 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
              >
                Previous
              </button>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-lg transition-colors ${page === currentPage ? 'bg-emerald-600 text-white' : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 rounded-lg transition-colors ${currentPage === totalPages ? darkMode ? 'bg-gray-800 text-gray-600 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      <BookingDetailsModal
        booking={selectedBooking}
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedBooking(null);
        }}
        onUpdate={onUpdate}
        darkMode={darkMode}
      />
    </div>
  );
}
