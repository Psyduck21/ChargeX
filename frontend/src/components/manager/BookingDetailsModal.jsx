import React, { useState } from 'react';
import { X, Calendar, MapPin, Car, Zap, Clock, User, CreditCard } from 'lucide-react';
import apiService from '../../services/api';

export default function BookingDetailsModal({ booking, isOpen, onClose, onUpdate, darkMode = false }) {
  const [isUpdating, setIsUpdating] = useState(false);
  if (!isOpen || !booking) return null;

  const getStatusColor = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'pending': return 'bg-orange-500 text-white';
      case 'accepted': return 'bg-yellow-500 text-white';
      case 'active': return 'bg-blue-500 text-white';
      case 'completed': return 'bg-green-500 text-white';
      case 'rejected': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleString();
  };

  const handleRejectBooking = async () => {
    if (!booking?.id && !booking?.booking_id) return;

    setIsUpdating(true);
    try {
      await apiService.updateBooking(booking.id || booking.booking_id, { status: 'rejected' });
      if (onUpdate) {
        await onUpdate();
      }
      onClose();
    } catch (error) {
      console.error('Failed to reject booking:', error);
      // Could show a toast notification here
      alert('Failed to reject booking. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border`}>
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Booking Details</h2>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>ID: {booking.id || booking.booking_id}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Status Badge */}
          <div className="mb-6">
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
              {(booking.status || 'unknown').toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Information */}
            <div className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-2xl p-6`}>
              <div className="flex items-center gap-3 mb-4">
                <User className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>User Information</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Name</p>
                  <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{booking.user_name || booking.user || 'Unknown User'}</p>
                </div>
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Email</p>
                  <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{booking.user_email || booking.email || 'No Email'}</p>
                </div>
              </div>
            </div>

            {/* Station Information */}
            <div className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-2xl p-6`}>
              <div className="flex items-center gap-3 mb-4">
                <MapPin className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Station Information</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Station Name</p>
                  <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{booking.station || booking.station_name || 'Unknown Station'}</p>
                </div>
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Location</p>
                  <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{booking.station_address || 'Address not available'}</p>
                </div>
              </div>
            </div>

            {/* Charging Details */}
            <div className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-2xl p-6`}>
              <div className="flex items-center gap-3 mb-4">
                <Zap className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Charging Details</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Slot Type</p>
                  <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{booking.slot_type || 'Unknown'}</p>
                </div>
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Connector Type</p>
                  <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{booking.connector_type || 'Unknown'}</p>
                </div>
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Energy Consumed</p>
                  <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{booking.energy ? `${booking.energy} kWh` : 'Not recorded'}</p>
                </div>
              </div>
            </div>

            {/* Time Information */}
            <div className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-2xl p-6`}>
              <div className="flex items-center gap-3 mb-4">
                <Clock className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Time Information</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Start Time</p>
                  <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{formatDateTime(booking.start_time)}</p>
                </div>
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>End Time</p>
                  <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{formatDateTime(booking.end_time)}</p>
                </div>
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Created At</p>
                  <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{formatDateTime(booking.created_at)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          {booking.notes && (
            <div className={`mt-6 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-2xl p-6`}>
              <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Additional Notes</h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{booking.notes}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            {(booking.status || '').toLowerCase() === 'pending' && (
              <button
                onClick={handleRejectBooking}
                disabled={isUpdating}
                className={`px-6 py-3 rounded-xl font-semibold transition-colors ${
                  isUpdating
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {isUpdating ? 'Rejecting...' : 'Reject Booking'}
              </button>
            )}
            <button
              onClick={onClose}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-colors ${
                darkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
