import React, { useState } from 'react';
import { Car, Plus, Edit2, Trash2, AlertCircle, X } from 'lucide-react';
import apiService from '../../services/api';

function VehiclesTab({ vehicles, setVehicles, toast }) {
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [showEditVehicle, setShowEditVehicle] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const AddVehicleModal = () => {
    if (!showAddVehicle) return null;

    const [newVehicle, setNewVehicle] = useState({
      plateNumber: '',
      vehicleType: '4_wheeler',
      brand: '',
      model: '',
      color: '',
      batteryCapacityKwh: '',
      rangeKm: '',
      chargingConnector: 'CCS'
    });

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add New Vehicle</h2>
              <button
                onClick={() => setShowAddVehicle(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Plate Number *</label>
                  <input
                    type="text"
                    value={newVehicle.plateNumber}
                    onChange={(e) => setNewVehicle({ ...newVehicle, plateNumber: e.target.value.toUpperCase() })}
                    placeholder="ABC-1234"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Vehicle Type *</label>
                  <select
                    value={newVehicle.vehicleType}
                    onChange={(e) => setNewVehicle({ ...newVehicle, vehicleType: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  >
                    <option value="2_wheeler">2 Wheeler</option>
                    <option value="4_wheeler">4 Wheeler</option>
                    <option value="bus">Bus</option>
                    <option value="truck">Truck</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Brand *</label>
                  <input
                    type="text"
                    value={newVehicle.brand}
                    onChange={(e) => setNewVehicle({ ...newVehicle, brand: e.target.value })}
                    placeholder="Tesla, Nissan, BMW..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Model *</label>
                  <input
                    type="text"
                    value={newVehicle.model}
                    onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                    placeholder="Model 3, Leaf..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Color</label>
                  <input
                    type="text"
                    value={newVehicle.color}
                    onChange={(e) => setNewVehicle({ ...newVehicle, color: e.target.value })}
                    placeholder="White, Black, Blue..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Charging Connector</label>
                  <select
                    value={newVehicle.chargingConnector}
                    onChange={(e) => setNewVehicle({ ...newVehicle, chargingConnector: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="CCS">CCS</option>
                    <option value="CHAdeMO">CHAdeMO</option>
                    <option value="Type 2">Type 2</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Battery Capacity (kWh)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newVehicle.batteryCapacityKwh}
                    onChange={(e) => setNewVehicle({ ...newVehicle, batteryCapacityKwh: e.target.value })}
                    placeholder="75.00"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Range (km)</label>
                  <input
                    type="number"
                    value={newVehicle.rangeKm}
                    onChange={(e) => setNewVehicle({ ...newVehicle, rangeKm: e.target.value })}
                    placeholder="400"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={async () => {
                    if (!newVehicle.plateNumber || !newVehicle.vehicleType || !newVehicle.brand || !newVehicle.model) {
                      toast.error('Please fill in all required fields');
                      return;
                    }

                    try {
                      const vehicleData = {
                        plate_number: newVehicle.plateNumber,
                        vehicle_type: newVehicle.vehicleType,
                        brand: newVehicle.brand,
                        model: newVehicle.model,
                        color: newVehicle.color || null,
                        battery_capacity_kwh: newVehicle.batteryCapacityKwh ? parseFloat(newVehicle.batteryCapacityKwh) : null,
                        range_km: newVehicle.rangeKm ? parseInt(newVehicle.rangeKm) : null,
                        charging_connector: newVehicle.chargingConnector
                      }
                      const addedVehicle = await apiService.createVehicle(vehicleData);
                      console.log('Added vehicle:', vehicleData);

                      setVehicles([...vehicles, {
                        id: addedVehicle.id,
                        name: `${addedVehicle.brand} ${addedVehicle.model}`,
                        brand: addedVehicle.brand,
                        model: addedVehicle.model,
                        plateNumber: addedVehicle.plate_number,
                        vehicleType: addedVehicle.vehicle_type,
                        color: addedVehicle.color,
                        batteryCapacity: addedVehicle.battery_capacity_kwh,
                        range: addedVehicle.range_km,
                        connectorType: addedVehicle.charging_connector,
                        image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop'
                      }]);
                      setShowAddVehicle(false);
                      toast.success('Vehicle added successfully!');
                    } catch (error) {
                      console.error('Error adding vehicle:', error);
                      toast.error('Failed to add vehicle. Please try again.');
                    }
                  }}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all"
                >
                  Add Vehicle
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddVehicle(false)}
                  className="px-6 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const EditVehicleModal = () => {
    if (!showEditVehicle || !editingVehicle) return null;

    const [editVehicle, setEditVehicle] = useState({
      plateNumber: editingVehicle.plateNumber || '',
      vehicleType: editingVehicle.vehicleType || '4_wheeler',
      brand: editingVehicle.brand || '',
      model: editingVehicle.model || '',
      color: editingVehicle.color || '',
      batteryCapacityKwh: editingVehicle.batteryCapacity || '',
      rangeKm: editingVehicle.range || '',
      chargingConnector: editingVehicle.connectorType || 'CCS'
    });

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Edit Vehicle</h2>
              <button
                onClick={() => {
                  setShowEditVehicle(false);
                  setEditingVehicle(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Plate Number *</label>
                  <input
                    type="text"
                    value={editVehicle.plateNumber}
                    onChange={(e) => setEditVehicle({ ...editVehicle, plateNumber: e.target.value.toUpperCase() })}
                    placeholder="ABC-1234"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Vehicle Type *</label>
                  <select
                    value={editVehicle.vehicleType}
                    onChange={(e) => setEditVehicle({ ...editVehicle, vehicleType: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  >
                    <option value="2_wheeler">2 Wheeler</option>
                    <option value="4_wheeler">4 Wheeler</option>
                    <option value="bus">Bus</option>
                    <option value="truck">Truck</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Brand *</label>
                  <input
                    type="text"
                    value={editVehicle.brand}
                    onChange={(e) => setEditVehicle({ ...editVehicle, brand: e.target.value })}
                    placeholder="Tesla, Nissan, BMW..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Model *</label>
                  <input
                    type="text"
                    value={editVehicle.model}
                    onChange={(e) => setEditVehicle({ ...editVehicle, model: e.target.value })}
                    placeholder="Model 3, Leaf..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Color</label>
                  <input
                    type="text"
                    value={editVehicle.color}
                    onChange={(e) => setEditVehicle({ ...editVehicle, color: e.target.value })}
                    placeholder="White, Black, Blue..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Charging Connector</label>
                  <select
                    value={editVehicle.chargingConnector}
                    onChange={(e) => setEditVehicle({ ...editVehicle, chargingConnector: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="CCS">CCS</option>
                    <option value="CHAdeMO">CHAdeMO</option>
                    <option value="Type 2">Type 2</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Battery Capacity (kWh)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editVehicle.batteryCapacityKwh}
                    onChange={(e) => setEditVehicle({ ...editVehicle, batteryCapacityKwh: e.target.value })}
                    placeholder="75.00"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Range (km)</label>
                  <input
                    type="number"
                    value={editVehicle.rangeKm}
                    onChange={(e) => setEditVehicle({ ...editVehicle, rangeKm: e.target.value })}
                    placeholder="400"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={async () => {
                    if (!editVehicle.plateNumber || !editVehicle.vehicleType || !editVehicle.brand || !editVehicle.model) {
                      toast.error('Please fill in all required fields');
                      return;
                    }

                    try {
                      const vehicleData = {
                        plate_number: editVehicle.plateNumber,
                        vehicle_type: editVehicle.vehicleType,
                        brand: editVehicle.brand,
                        model: editVehicle.model,
                        color: editVehicle.color || null,
                        battery_capacity_kwh: editVehicle.batteryCapacityKwh ? parseFloat(editVehicle.batteryCapacityKwh) : null,
                        range_km: editVehicle.rangeKm ? parseInt(editVehicle.rangeKm) : null,
                        charging_connector: editVehicle.chargingConnector
                      }
                      const updatedVehicle = await apiService.updateVehicle(editingVehicle.id, vehicleData);
                      console.log('Updated vehicle:', vehicleData);

                      setVehicles(vehicles.map(v =>
                        v.id === editingVehicle.id ? {
                          ...v,
                          name: `${updatedVehicle.brand} ${updatedVehicle.model}`,
                          brand: updatedVehicle.brand,
                          model: updatedVehicle.model,
                          plateNumber: updatedVehicle.plate_number,
                          vehicleType: updatedVehicle.vehicle_type,
                          color: updatedVehicle.color,
                          batteryCapacity: updatedVehicle.battery_capacity_kwh,
                          range: updatedVehicle.range_km,
                          connectorType: updatedVehicle.charging_connector
                        } : v
                      ));
                      setShowEditVehicle(false);
                      setEditingVehicle(null);
                      toast.success('Vehicle updated successfully!');
                    } catch (error) {
                      console.error('Error updating vehicle:', error);
                      toast.error('Failed to update vehicle. Please try again.');
                    }
                  }}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all"
                >
                  Update Vehicle
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditVehicle(false);
                    setEditingVehicle(null);
                  }}
                  className="px-6 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Vehicles</h1>
            <p className="text-gray-600">Manage your electric vehicles</p>
          </div>
          <button
            onClick={() => setShowAddVehicle(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg shadow-emerald-500/30"
          >
            <Plus className="w-5 h-5" />
            Add Vehicle
          </button>
        </div>
      </header>

      {vehicles.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Car className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No vehicles added</h3>
          <p className="text-gray-600 mb-6">Add your first vehicle to get started</p>
          <button
            onClick={() => setShowAddVehicle(true)}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all"
          >
            Add Your First Vehicle
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
              <img src={vehicle.image} alt={vehicle.name} className="w-full h-48 object-cover" />
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{vehicle.name}</h3>
                    <p className="text-sm text-gray-600">{vehicle.brand} • {vehicle.year}</p>
                  </div>
                  {vehicle.isPrimary && (
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                      Primary
                    </span>
                  )}
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Plate Number</span>
                    <span className="font-semibold text-gray-900">{vehicle.plateNumber || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Vehicle Type</span>
                    <span className="font-semibold text-gray-900">{vehicle.vehicleType?.replace('_', ' ').toUpperCase() || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Color</span>
                    <span className="font-semibold text-gray-900">{vehicle.color || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Connector Type</span>
                    <span className="font-semibold text-gray-900">{vehicle.connectorType}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Battery Capacity</span>
                    <span className="font-semibold text-gray-900">{vehicle.batteryCapacity ? `${vehicle.batteryCapacity} kWh` : 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Range</span>
                    <span className="font-semibold text-gray-900">{vehicle.range ? `${vehicle.range} km` : 'N/A'}</span>
                  </div>
                  {vehicle.lastServiceDate && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Last Service</span>
                      <span className="font-semibold text-gray-900">{new Date(vehicle.lastServiceDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingVehicle(vehicle);
                      setShowEditVehicle(true);
                    }}
                    className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={async () => {
                      if (window.confirm(`Are you sure you want to delete ${vehicle.name}?`)) {
                        try {
                          await apiService.deleteVehicle(vehicle.id);
                          setVehicles(vehicles.filter(v => v.id !== vehicle.id));
                          toast.success('Vehicle deleted successfully!');
                        } catch (error) {
                          console.error('Error deleting vehicle:', error);
                          toast.error('Failed to delete vehicle. Please try again.');
                        }
                      }
                    }}
                    className="px-4 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddVehicleModal />
      <EditVehicleModal />
    </>
  );
}

export default VehiclesTab;
