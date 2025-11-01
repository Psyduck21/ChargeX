import React, { useState, useEffect } from 'react';
import { MapPin, Battery, Plus, Edit2, Trash2, Settings, Zap } from 'lucide-react';
import EmptyState from './EmptyState';
import { useToast } from '../ui/Toast';
import apiService from '../../services/api';

export default function SlotsTab({
  stations,
  darkMode = false
}) {
  const toast = useToast();
  const [slots, setSlots] = useState({});
  const [loading, setLoading] = useState(false);
  const [showAddSlotModal, setShowAddSlotModal] = useState(false);
  const [showEditSlotModal, setShowEditSlotModal] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slotForm, setSlotForm] = useState();

  const connectorTypes = ['Type 1', 'Type 2', 'CCS', 'CHAdeMO', 'Tesla SC'];
  const chargerTypes = ['Fast', 'Normal', 'Slow'];
  const statusOptions = ['available', 'occupied', 'under_maintenance'];

  useEffect(() => {
    if (stations.length > 0) {
      fetchAllSlots();
    }
  }, [stations]);

  const fetchAllSlots = async () => {
    setLoading(true);
    try {
      const slotsData = {};
      for (const station of stations) {
        try {
          const stationSlots = await apiService.getSlots(station.id);
          slotsData[station.id] = stationSlots || [];
        } catch (error) {
          console.error(`Failed to fetch slots for station ${station.id}:`, error);
          slotsData[station.id] = [];
        }
      }
      setSlots(slotsData);
    } catch (error) {
      console.error('Failed to fetch slots:', error);
      toast.error('Failed to load slots');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    if (!selectedStation) return;

    try {
      const newSlot = {
        ...slotForm,
        station_id: selectedStation.id
      };
      console.log("Adding slot:", newSlot);
      await apiService.createSlot(newSlot);
      toast.success('Slot added successfully!');
      setShowAddSlotModal(false);
      setSlotForm({ slot_number: 1, charger_type: 'Fast', status: 'available', connector_type: 'Type 2', max_power_kw: 22, is_available: true });
      fetchAllSlots();
    } catch (error) {
      console.error('Failed to add slot:', error);
      toast.error('Failed to add slot');
    }
  };

  const handleEditSlot = async (e) => {
    e.preventDefault();
    if (!selectedSlot) return;

    try {
      await apiService.updateSlot(selectedSlot.id, slotForm);
      toast.success('Slot updated successfully!');
      setShowEditSlotModal(false);
      setSelectedSlot(null);
      setSlotForm({ slot_number: 1, charger_type: 'Fast', status: 'available', connector_type: 'Type 2', max_power_kw: 22, is_available: true });
      fetchAllSlots();
    } catch (error) {
      console.error('Failed to update slot:', error);
      toast.error('Failed to update slot');
    }
  };

  const handleDeleteSlot = async (slot) => {
    if (!confirm('Are you sure you want to delete this slot?')) return;

    try {
      await apiService.deleteSlot(slot.id);
      toast.success('Slot deleted successfully!');
      fetchAllSlots();
    } catch (error) {
      console.error('Failed to delete slot:', error);
      toast.error('Failed to delete slot');
    }
  };

  const openAddSlotModal = (station) => {
    setSelectedStation(station);
    setSlotForm({ slot_number: 1, charger_type: 'Fast', status: 'available', connector_type: 'Type 2', max_power_kw: 22, is_available: true });
    setShowAddSlotModal(true);
  };

  const openEditSlotModal = (slot) => {
    setSelectedSlot(slot);
    setSlotForm({
      slot_number: slot.slot_number || 1,
      charger_type: slot.charger_type || 'Fast',
      status: slot.status || 'available',
      connector_type: slot.connector_type,
      max_power_kw: slot.max_power_kw,
      is_available: slot.is_available
    });
    setShowEditSlotModal(true);
  };

  const getSlotStatus = (slot) => {
    if (slot.status === 'under_maintenance') {
      return { status: 'Under Maintenance', color: 'red' };
    }
    if (slot.status === 'occupied') {
      return { status: 'Occupied', color: 'orange' };
    }
    if (slot.status === 'available' && slot.is_available) {
      return { status: 'Available', color: 'emerald' };
    }
    return { status: 'Unavailable', color: 'gray' };
  };

  return (
    <div className="space-y-6">

      {stations.length === 0 ? (
        <EmptyState message="No stations available" icon={MapPin} darkMode={darkMode} />
      ) : (
        stations.map((station) => {
          const stationSlots = slots[station.id] || [];
          const availableSlots = stationSlots.filter(slot => slot.status === 'available').length;
          const occupiedSlots = stationSlots.filter(slot => slot.status === 'occupied').length;
          const underMaintenanceSlots = stationSlots.filter(slot => slot.status === 'under_maintenance').length;

          return (
            <div key={station.id} className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl p-4 md:p-6 border`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div>
                  <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{station.name}</h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{station.address}, {station.city}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Available: {availableSlots}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Occupied: {occupiedSlots}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Maintenance: {underMaintenanceSlots}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Slots</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      {stationSlots.length}
                    </p>
                  </div>
                  <button
                    onClick={() => openAddSlotModal(station)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Slot
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                </div>
              ) : stationSlots.length === 0 ? (
                <div className="text-center py-12">
                  <Battery className={`w-12 h-12 ${darkMode ? 'text-gray-600' : 'text-gray-400'} mx-auto mb-4`} />
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>No slots configured yet</p>
                  <button
                    onClick={() => openAddSlotModal(station)}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
                  >
                    Add First Slot
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {stationSlots.map((slot) => {
                    const { status, color } = getSlotStatus(slot);
                    return (
                      <div
                        key={slot.id}
                        className={`relative ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} rounded-xl border p-4 transition-all hover:shadow-md`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Battery className={`w-5 h-5 text-${color}-600`} />
                            <div>
                              <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'} block`}>
                                {slot.connector_type}
                              </span>
                              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {slot.charger_type} Charger
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openEditSlotModal(slot)}
                              className={`p-1 rounded-lg ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'} transition-colors`}
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteSlot(slot)}
                              className="p-1 rounded-lg hover:bg-red-100 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Power</span>
                            <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {slot.max_power_kw} kW
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Status</span>
                            <span className={`text-xs px-2 py-1 rounded-full bg-${color}-100 text-${color}-700 font-medium`}>
                              {status}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })
      )}

      {/* Add Slot Modal */}
      {showAddSlotModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl max-w-md w-full p-6`}>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
              Add New Slot
            </h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-6`}>
              Station: {selectedStation?.name}
            </p>

            <form onSubmit={handleAddSlot} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Slot Number
                </label>
                <input
                  type="number"
                  value={slotForm.slot_number}
                  onChange={(e) => setSlotForm({ ...slotForm, slot_number: parseInt(e.target.value) })}
                  className={`w-full px-4 py-2.5 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                  min="1"
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Charger Type
                </label>
                <select
                  value={slotForm.charger_type}
                  onChange={(e) => setSlotForm({ ...slotForm, charger_type: e.target.value })}
                  className={`w-full px-4 py-2.5 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                >
                  {chargerTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Status
                </label>
                <select
                  value={slotForm.status}
                  onChange={(e) => setSlotForm({ ...slotForm, status: e.target.value })}
                  className={`w-full px-4 py-2.5 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Connector Type
                </label>
                <select
                  value={slotForm.connector_type}
                  onChange={(e) => setSlotForm({ ...slotForm, connector_type: e.target.value })}
                  className={`w-full px-4 py-2.5 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                >
                  {connectorTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Max Power (kW)
                </label>
                <input
                  type="number"
                  value={slotForm.max_power_kw}
                  onChange={(e) => setSlotForm({ ...slotForm, max_power_kw: parseFloat(e.target.value) })}
                  className={`w-full px-4 py-2.5 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                  min="1"
                  max="350"
                  step="0.1"
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddSlotModal(false)}
                  className={`flex-1 px-4 py-2.5 border ${darkMode ? 'border-gray-600 text-gray-300' : 'border-gray-200 text-gray-700'} rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700"
                >
                  Add Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Slot Modal */}
      {showEditSlotModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl max-w-md w-full p-6`}>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
              Edit Slot
            </h3>

            <form onSubmit={handleEditSlot} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Slot Number
                </label>
                <input
                  type="number"
                  value={slotForm.slot_number}
                  onChange={(e) => setSlotForm({ ...slotForm, slot_number: parseInt(e.target.value) })}
                  className={`w-full px-4 py-2.5 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                  min="1"
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Charger Type
                </label>
                <select
                  value={slotForm.charger_type}
                  onChange={(e) => setSlotForm({ ...slotForm, charger_type: e.target.value })}
                  className={`w-full px-4 py-2.5 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                >
                  {chargerTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Status
                </label>
                <select
                  value={slotForm.status}
                  onChange={(e) => setSlotForm({ ...slotForm, status: e.target.value })}
                  className={`w-full px-4 py-2.5 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Connector Type
                </label>
                <select
                  value={slotForm.connector_type}
                  onChange={(e) => setSlotForm({ ...slotForm, connector_type: e.target.value })}
                  className={`w-full px-4 py-2.5 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                >
                  {connectorTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Max Power (kW)
                </label>
                <input
                  type="number"
                  value={slotForm.max_power_kw}
                  onChange={(e) => setSlotForm({ ...slotForm, max_power_kw: parseFloat(e.target.value) })}
                  className={`w-full px-4 py-2.5 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                  min="1"
                  max="350"
                  step="0.1"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_available"
                  checked={slotForm.is_available}
                  onChange={(e) => setSlotForm({ ...slotForm, is_available: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="is_available" className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Available for use
                </label>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditSlotModal(false)}
                  className={`flex-1 px-4 py-2.5 border ${darkMode ? 'border-gray-600 text-gray-300' : 'border-gray-200 text-gray-700'} rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700"
                >
                  Update Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
