import React from 'react';
import { Calendar, MapPin, Clock, Zap, Car } from 'lucide-react';
import { useToast } from '../ui/Toast';
import apiService from '../../services/api';

function BookingsTab({ bookings, setActiveTab, userSessions = [], stations = [], vehicles = [], onBookingUpdate }) {
  const toast = useToast();

  const handleCancelBooking = async (bookingId) => {
    try {
      await apiService.cancelBooking(bookingId);
      toast.success('Booking cancelled successfully!');
      if (onBookingUpdate) {
        onBookingUpdate();
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error(error?.message || 'Failed to cancel booking. Please try again.');
    }
  };

  // Helper function to find station by ID
  const getStationById = (stationId) => {
    return stations.find(s => String(s.id) === String(stationId));
  };

  // Helper function to find vehicle by ID
  const getVehicleById = (vehicleId) => {
    return vehicles.find(v => String(v.id) === String(vehicleId));
  };

  // Populate station and vehicle names for sessions
  const processedSessions = userSessions.map(session => {
    const processed = { ...session, type: 'session', total_cost: session.cost };

    // If backend didn't provide names, get them from available data
    if (!processed.station_name && processed.station_id) {
      const station = getStationById(processed.station_id);
      if (station) {
        processed.station_name = station.name;
        processed.station_address = station.address;
      }
    }

    if (!processed.vehicle_name && processed.vehicle_id) {
      const vehicle = getVehicleById(processed.vehicle_id);
      if (vehicle) {
        processed.vehicle_name = vehicle.name;
        processed.connector_type = vehicle.connectorType || 'Unknown';
      }
    }

    // Fallbacks
    if (!processed.station_name) processed.station_name = 'Unknown Station';
    if (!processed.station_address) processed.station_address = 'Address not available';
    if (!processed.vehicle_name) processed.vehicle_name = 'Unknown Vehicle';
    if (!processed.connector_type) processed.connector_type = 'Unknown';

    return processed;
  });

  // Combine bookings and user sessions for display
  const itemsToShow = [
    ...bookings.filter(b => b.status === 'pending' || b.status === 'accepted').map(b => ({ ...b, type: 'booking', total_cost: null })),
    ...processedSessions
  ].sort((a, b) => {
    // Sort by start time, most recent first
    const aTime = a.start_time || a.booking_start_time || new Date();
    const bTime = b.start_time || b.booking_start_time || new Date();
    return new Date(bTime) - new Date(aTime);
  });

  return (
    <>
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Charging Activities</h1>
            <p className="text-gray-600">View your bookings and completed charging sessions</p>
          </div>
        </div>
      </header>

      {itemsToShow.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No activities found</h3>
          <p className="text-gray-600 mb-6">You haven't made any bookings or completed any charging sessions yet</p>
          <button
            onClick={() => setActiveTab('stations')}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all"
          >
            Find Stations
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {itemsToShow.map((item) => (
            <div key={`${item.type}-${item.id}`} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.station_name}</h3>
                    <p className="text-gray-600 flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4" />
                      {item.station_address}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {item.type === 'session'
                          ? new Date(item.start_time).toLocaleDateString()
                          : new Date(item.booking_date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {item.type === 'session'
                          ? `${new Date(item.start_time).toLocaleTimeString()} - ${new Date(item.end_time).toLocaleTimeString()}`
                          : item.time_slot}
                      </span>
                      <span className="flex items-center gap-1">
                        <Zap className="w-4 h-4" />
                        {item.connector_type || 'Unknown'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold mb-2 ${
                      item.status === 'completed' || (item.type === 'session') ? 'bg-blue-100 text-blue-700' :
                      item.status === 'confirmed' || item.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' :
                      item.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {item.type === 'session' ? 'Completed' : item.status?.charAt(0).toUpperCase() + item.status?.slice(1)}
                    </div>
                    <p className="text-2xl font-bold text-emerald-600">
                      {item.total_cost !== null && item.total_cost !== undefined ? `₹${item.total_cost}` : 'Cost TBD'}
                    </p>
                  </div>
                </div>

                {item.type === 'session' && item.energy_used && (
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{item.energy_used} kWh</p>
                      <p className="text-sm text-gray-600">Energy Used</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">
                        {Math.round((new Date(item.end_time) - new Date(item.start_time)) / (1000 * 60 * 60) * 10) / 10}h
                      </p>
                      <p className="text-sm text-gray-600">Duration</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {(item.energy_used * 0.4).toFixed(1)} kg
                      </p>
                      <p className="text-sm text-gray-600">CO₂ Saved</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <Car className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-600">{item.vehicle_name}</span>
                  </div>
                  <div className="flex gap-2">
                    {item.type === 'booking' && item.status === 'pending' && (
                      <button
                        onClick={() => handleCancelBooking(item.id)}
                        className="px-4 py-2 border border-red-300 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors"
                      >
                        Cancel Booking
                      </button>
                    )}
                    {item.type === 'booking' && item.status === 'confirmed' && (
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                        View Details
                      </button>
                    )}
                    {item.type === 'session' && (
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                        View Receipt
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default BookingsTab;
