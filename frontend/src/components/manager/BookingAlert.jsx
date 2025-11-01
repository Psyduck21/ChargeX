import React from 'react';
import { Bell, CheckCircle, XCircle } from 'lucide-react';

export default function BookingAlert({
  showBookingAlert,
  newBooking,
  onConfirm,
  onReject,
  darkMode = false
}) {
  if (!showBookingAlert || !newBooking) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slideIn">
      <div className={`${darkMode ? 'bg-gray-800 border-emerald-400' : 'bg-white border-emerald-500'} rounded-2xl shadow-2xl border-2 p-4 md:p-6 w-80 md:w-96`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center animate-bounce">
            <Bell className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>New Booking Alert!</h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Requires confirmation</p>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-4 mb-4 space-y-2`}>
          <div className="flex justify-between">
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>User:</span>
            <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{newBooking.user_name}</span>
          </div>
          <div className="flex justify-between">
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Station:</span>
            <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{newBooking.station}</span>
          </div>
          <div className="flex justify-between">
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Slot:</span>
            <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{newBooking.slot}</span>
          </div>
          <div className="flex justify-between">
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Time:</span>
            <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{newBooking.start_time}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-emerald-700 flex items-center justify-center gap-2 transition-all transform hover:scale-105"
          >
            <CheckCircle className="w-4 h-4" />
            Confirm
          </button>
          <button
            onClick={onReject}
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
