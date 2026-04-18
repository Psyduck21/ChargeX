import React from 'react';
import { Calendar, MapPin, Zap, Clock, Battery } from 'lucide-react';

export default function BookingCardInChat({ booking, darkMode = false }) {
  if (!booking) return null;

  const formatDateTime = (dateString, timeOnly = false) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    if (timeOnly) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`mt-3 overflow-hidden rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm`}>
      {/* Header */}
      <div className={`px-4 py-3 border-b flex items-center gap-3 ${darkMode ? 'border-gray-700 bg-emerald-900/30' : 'border-emerald-100 bg-emerald-50'}`}>
        <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0">
          <Calendar className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm font-bold truncate ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
            Booking Confirmed!
          </h4>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 space-y-4">
        {/* Station row */}
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <MapPin className={`w-4 h-4 ${darkMode ? 'text-emerald-400' : 'text-emerald-500'}`} />
          </div>
          <div>
            <p className={`text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Station</p>
            <p className={`text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
              {booking.station_name || booking.station || 'Selected Station'}
            </p>
          </div>
        </div>

        {/* Info Grid */}
        <div className={`grid grid-cols-2 gap-4 p-4 rounded-xl ${darkMode ? 'bg-gray-900/40' : 'bg-gray-50/50'}`}>
          {/* Date */}
          <div className="flex items-center gap-3">
            <Calendar className={`w-4 h-4 ${darkMode ? 'text-emerald-400' : 'text-emerald-500'}`} />
            <div>
              <p className={`text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Date</p>
              <p className={`text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                {new Date(booking.start_time).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Time */}
          <div className="flex items-center gap-3">
            <Clock className={`w-4 h-4 ${darkMode ? 'text-emerald-400' : 'text-emerald-500'}`} />
            <div>
              <p className={`text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Time</p>
              <p className={`text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                {formatDateTime(booking.start_time, true)}
              </p>
            </div>
          </div>

          {/* Connector */}
          <div className="flex items-center gap-3">
            <Zap className={`w-4 h-4 ${darkMode ? 'text-emerald-400' : 'text-emerald-500'}`} />
            <div>
              <p className={`text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Interface</p>
              <p className={`text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                {booking.connector_type || 'Standard'}
              </p>
            </div>
          </div>
          
          {booking.current_battery_level !== undefined && (
            <div className="col-span-2 mt-1 pt-2 border-t border-dashed border-gray-200 dark:border-gray-700 flex items-center gap-3">
              <Battery className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              <div className="flex-1 flex justify-between items-center">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Start Battery</span>
                <span className={`text-sm font-bold ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{booking.current_battery_level}%</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer Banner */}
      <div className={`px-4 py-2 text-xs font-medium text-center ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-600'}`}>
        Your slot is reserved. Ensure you arrive 5 minutes early.
      </div>
    </div>
  );
}
