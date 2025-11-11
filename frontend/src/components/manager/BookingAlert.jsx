import React, { useState } from 'react';
import { Bell, CheckCircle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';

export default function BookingAlert({
  showBookingAlert,
  pendingBookings = [],
  onConfirm,
  onReject,
  darkMode = false
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!showBookingAlert || !pendingBookings || pendingBookings.length === 0) return null;

  const currentBooking = pendingBookings[currentIndex];
  const totalBookings = pendingBookings.length;

  const formatDateTime = (dateString) => {
    if (!dateString) return '—';
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (error) {
      return dateString; // fallback to original string if parsing fails
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalBookings);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalBookings) % totalBookings);
  };

  const handleConfirm = () => {
    onConfirm(currentBooking);
  };

  const handleReject = () => {
    onReject(currentBooking);
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-slideIn">
      <div className={`${darkMode ? 'bg-gray-800 border-emerald-400' : 'bg-white border-emerald-500'} rounded-2xl shadow-2xl border-2 p-4 md:p-6 w-80 md:w-96`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center animate-bounce">
              <Bell className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Pending Bookings</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{totalBookings} booking{totalBookings > 1 ? 's' : ''} need{totalBookings === 1 ? 's' : ''} attention</p>
            </div>
          </div>

          {totalBookings > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {currentIndex + 1} / {totalBookings}
              </span>
              <button
                onClick={handleNext}
                className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-4 mb-4 space-y-2`}>
          <div className="flex justify-between">
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>User:</span>
            <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{currentBooking.user_email}</span>
          </div>
          <div className="flex justify-between">
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Station:</span>
            <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{currentBooking.station}</span>
          </div>
          <div className="flex justify-between">
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Slot:</span>
            <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{currentBooking.slot}</span>
          </div>
          <div className="flex justify-between">
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Time:</span>
            <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{formatDateTime(currentBooking.start_time)}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleConfirm}
            className="flex-1 bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-emerald-700 flex items-center justify-center gap-2 transition-all transform hover:scale-105"
          >
            <CheckCircle className="w-4 h-4" />
            Confirm
          </button>
          <button
            onClick={handleReject}
            className="flex-1 bg-red-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-red-700 flex items-center justify-center gap-2 transition-all transform hover:scale-105"
          >
            <XCircle className="w-4 h-4" />
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
