import React, { useState } from 'react';
import { MapPin, Plus, Edit2, Trash2, Search, ChevronRight, UserPlus } from 'lucide-react';

export default function StationsTab({
  stations,
  searchQuery,
  setSearchQuery,
  onCreateStation,
  onEditStation,
  onDeleteStation,
  managers = [],
  onAssignManager
}) {
  const [assigningStation, setAssigningStation] = useState(null);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search stations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
        <button
          onClick={onCreateStation}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl hover:bg-emerald-700 font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Station
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {stations.filter(s => (s?.name || '').toLowerCase().includes(searchQuery.toLowerCase())).map((station) => (
          <div key={station.station_id} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{station.name}</h3>
                <p className="text-sm text-gray-500 flex items-center gap-1 mb-1">
                  <MapPin className="w-4 h-4" />
                  {station.address}, {station.city}{station.country && `, ${station.country}`}{station.state && `, ${station.state}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    onClick={() => setAssigningStation(assigningStation === station.station_id ? null : station.station_id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Assign Manager"
                  >
                    <UserPlus className="w-4 h-4" />
                  </button>
                  {assigningStation === station.station_id && (
                    <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-48">
                      <div className="p-2">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Assign Manager</h4>
                        <div className="space-y-1">
                          {managers.map((manager) => (
                            <button
                              key={manager.id}
                              onClick={() => {
                                onAssignManager(station.station_id, manager.id);
                                setAssigningStation(null);
                              }}
                              className="w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded"
                            >
                              {manager.email || manager.name}
                            </button>
                          ))}
                          {(station.managers && station.managers[0]) && (
                            <div className="border-t pt-1 mt-1">
                              <button
                                onClick={() => {
                                  onAssignManager(station.station_id, null); // Unassign
                                  setAssigningStation(null);
                                }}
                                className="w-full text-left px-2 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                              >
                                Unassign Manager
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => onEditStation(station)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => onDeleteStation(station)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Capacity</p>
                <p className="text-xl font-bold text-gray-900">{station.capacity || 'N/A'}</p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-3">
                <p className="text-xs text-emerald-700 mb-1">Available</p>
                <p className="text-xl font-bold text-emerald-600">{station.available_slots}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2">Manager</p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-semibold text-sm">
                  {(station.managers && station.managers[0] && (station.managers[0].name || station.managers[0].email) ? (station.managers[0].name || station.managers[0].email)[0] : 'U')}
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {(station.managers && station.managers[0] && (station.managers[0].name || station.managers[0].email)) || 'Unassigned'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
