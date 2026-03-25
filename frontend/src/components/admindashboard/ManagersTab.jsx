import React, { useState } from 'react';
import { Users, Plus, Edit2, Trash2, Search, ChevronRight, EvCharger } from 'lucide-react';

export default function ManagersTab({
  managers,
  searchQuery,
  setSearchQuery,
  onCreateManager,
  onEditManager,
  onDeleteManager,
  onAssignStations,
  stations
}) {
  const [assigningManager, setAssigningManager] = useState(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search managers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
        <button
          onClick={onCreateManager}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl hover:bg-emerald-700 font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Manager
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(managers || []).map((manager) => (
          <div key={manager?.id || manager?.email || manager?.name} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                {((manager && (manager.name || manager.name)) || (manager && manager.email) || 'U')[0]}
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    onClick={() => setAssigningManager(assigningManager === manager.id ? null : manager.id)}
                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    title="Assign Stations"
                  >
                    <EvCharger className="w-4 h-4" />
                  </button>
                  {assigningManager === manager.id && (
                    <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-48 max-h-64 overflow-y-auto">
                      <div className="p-2">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Assign Stations</h4>
                        <div className="space-y-1">
                          {stations.map((station) => {
                            const isAssigned = manager.stations && manager.stations.some(s =>
                              s.id === station.station_id || s.station_id === station.station_id
                            );
                            return (
                              <button
                                key={station.station_id}
                                onClick={() => {
                                  onAssignStations(manager.id, station.station_id, isAssigned);
                                  setAssigningManager(null);
                                }}
                                className={`w-full text-left px-2 py-1 text-sm rounded ${
                                  isAssigned
                                    ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                                    : 'text-gray-700 hover:bg-gray-100'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span>{station.name}</span>
                                  {isAssigned && <span className="text-emerald-600 text-xs">✓</span>}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => onEditManager(manager)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => onDeleteManager(manager)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-1">{manager.name || manager.name || manager.email || 'Unnamed'}</h3>
            <p className="text-sm text-gray-500 mb-4">{manager.email || '—'}</p>

            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2">Assigned Stations</p>
              <div className="space-y-1">
                {((manager.stations || []).length > 0 ? manager.stations : [{ name: 'No stations assigned' }]).map((station, i) => (
                  <div key={i} className="text-sm text-gray-900 flex items-center gap-1">
                    <ChevronRight className="w-3 h-3 text-gray-400" />
                    {station?.name || station?.station_name || station?.id || station?.station_id || 'Unknown'}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
