import React from 'react';
import { MapPin, Battery } from 'lucide-react';
import EmptyState from './EmptyState';

export default function SlotsTab({
  stations,
  darkMode = false
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Slot Management</h2>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Monitor and manage charging slots</p>
      </div>

      {stations.length === 0 ? (
        <EmptyState message="No stations available" icon={MapPin} darkMode={darkMode} />
      ) : (
        stations.map((station) => (
          <div key={station.station_id} className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl p-4 md:p-6 border`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <div>
                <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{station.name}</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{station.address}, {station.city}</p>
              </div>
              <div className="text-right">
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Availability</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {station.available_slots}/{station.total_slots}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {Array.from({ length: station.total_slots }, (_, i) => {
                const isOccupied = i < station.occupied_slots;
                return (
                  <div
                    key={i}
                    className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center p-2 md:p-4 transition-all cursor-pointer ${
                      isOccupied
                        ? 'bg-orange-50 border-orange-300 hover:bg-orange-100 dark:bg-orange-900/20 dark:border-orange-800'
                        : 'bg-emerald-50 border-emerald-300 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800'
                    }`}
                  >
                    <Battery className={`w-6 h-6 md:w-8 md:h-8 mb-2 ${isOccupied ? 'text-orange-600' : 'text-emerald-600'}`} />
                    <p className={`font-bold text-xs md:text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>Slot {String.fromCharCode(65 + i)}{i + 1}</p>
                    <p className={`text-xs font-semibold mt-1 ${isOccupied ? 'text-orange-600' : 'text-emerald-600'}`}>
                      {isOccupied ? 'Occupied' : 'Available'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
