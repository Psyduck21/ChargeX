import React, { useState, useEffect } from 'react';
import apiService from '../services/api.js';

const UserOperations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // User Data States
  const [profile, setProfile] = useState({});
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [sessions, setSessions] = useState([]);

  // Form States
  const [newVehicle, setNewVehicle] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    license_plate: '',
    battery_capacity: 0
  });

  const [newBooking, setNewBooking] = useState({
    station_id: '',
    slot_id: '',
    start_time: '',
    end_time: ''
  });

  const [newFeedback, setNewFeedback] = useState({
    station_id: '',
    rating: 5,
    comment: ''
  });

  // Available Data
  const [stations, setStations] = useState([]);
  const [slots, setSlots] = useState([]);

  // Load initial data
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const [profileData, vehiclesData, bookingsData, sessionsData, stationsData] = await Promise.all([
        apiService.getProfile(),
        apiService.getVehicles(),
        apiService.getBookings(),
        apiService.getChargingSessions(),
        apiService.getStations()
      ]);

      setProfile(profileData);
      setVehicles(vehiclesData);
      setBookings(bookingsData);
      setSessions(sessionsData);
      setStations(stationsData);
    } catch (err) {
      setError(`Failed to load user data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Profile Operations
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await apiService.updateProfile(profile);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(`Failed to update profile: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Vehicle Operations
  const handleCreateVehicle = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await apiService.createVehicle(newVehicle);
      setSuccess('Vehicle added successfully!');
      setNewVehicle({
        make: '',
        model: '',
        year: new Date().getFullYear(),
        license_plate: '',
        battery_capacity: 0
      });
      loadUserData();
    } catch (err) {
      setError(`Failed to add vehicle: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateVehicle = async (vehicleId, updateData) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await apiService.updateVehicle(vehicleId, updateData);
      setSuccess('Vehicle updated successfully!');
      loadUserData();
    } catch (err) {
      setError(`Failed to update vehicle: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVehicle = async (vehicleId) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await apiService.deleteVehicle(vehicleId);
      setSuccess('Vehicle deleted successfully!');
      loadUserData();
    } catch (err) {
      setError(`Failed to delete vehicle: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Booking Operations
  const handleGetSlots = async (stationId) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const slotsData = await apiService.getSlots(stationId);
      setSlots(slotsData.filter(slot => slot.status === 'available'));
      setSuccess('Available slots loaded!');
    } catch (err) {
      setError(`Failed to load slots: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await apiService.createBooking(newBooking);
      setSuccess('Booking created successfully!');
      setNewBooking({
        station_id: '',
        slot_id: '',
        start_time: '',
        end_time: ''
      });
      setSlots([]);
      loadUserData();
    } catch (err) {
      setError(`Failed to create booking: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await apiService.cancelBooking(bookingId);
      setSuccess('Booking cancelled successfully!');
      loadUserData();
    } catch (err) {
      setError(`Failed to cancel booking: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Feedback Operations
  const handleCreateFeedback = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await apiService.createFeedback(newFeedback);
      setSuccess('Feedback submitted successfully!');
      setNewFeedback({
        station_id: '',
        rating: 5,
        comment: ''
      });
    } catch (err) {
      setError(`Failed to submit feedback: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">User Operations</h1>

      {/* Status Messages */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {/* Profile Management */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Profile Management</h2>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Name"
              value={profile.name || ''}
              onChange={(e) => setProfile({...profile, name: e.target.value})}
              className="p-2 border rounded"
            />
            <input
              type="email"
              placeholder="Email"
              value={profile.email || ''}
              onChange={(e) => setProfile({...profile, email: e.target.value})}
              className="p-2 border rounded"
            />
            <input
              type="tel"
              placeholder="Phone"
              value={profile.phone || ''}
              onChange={(e) => setProfile({...profile, phone: e.target.value})}
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="City"
              value={profile.city || ''}
              onChange={(e) => setProfile({...profile, city: e.target.value})}
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Address"
              value={profile.address || ''}
              onChange={(e) => setProfile({...profile, address: e.target.value})}
              className="p-2 border rounded md:col-span-2"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>

      {/* Vehicle Management */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Vehicle Management</h2>
        
        {/* Add Vehicle Form */}
        <form onSubmit={handleCreateVehicle} className="mb-6 p-4 border rounded">
          <h3 className="text-lg font-medium mb-3">Add New Vehicle</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Make (e.g., Tesla)"
              value={newVehicle.make}
              onChange={(e) => setNewVehicle({...newVehicle, make: e.target.value})}
              className="p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Model (e.g., Model 3)"
              value={newVehicle.model}
              onChange={(e) => setNewVehicle({...newVehicle, model: e.target.value})}
              className="p-2 border rounded"
              required
            />
            <input
              type="number"
              placeholder="Year"
              value={newVehicle.year}
              onChange={(e) => setNewVehicle({...newVehicle, year: parseInt(e.target.value)})}
              className="p-2 border rounded"
              min="2000"
              max={new Date().getFullYear() + 1}
              required
            />
            <input
              type="text"
              placeholder="License Plate"
              value={newVehicle.license_plate}
              onChange={(e) => setNewVehicle({...newVehicle, license_plate: e.target.value})}
              className="p-2 border rounded"
              required
            />
            <input
              type="number"
              placeholder="Battery Capacity (kWh)"
              value={newVehicle.battery_capacity}
              onChange={(e) => setNewVehicle({...newVehicle, battery_capacity: parseFloat(e.target.value)})}
              className="p-2 border rounded"
              step="0.1"
              min="0"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Vehicle'}
          </button>
        </form>

        {/* Vehicles List */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium">My Vehicles ({vehicles.length})</h3>
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="p-3 border rounded flex justify-between items-center">
              <div>
                <div className="font-medium">{vehicle.make} {vehicle.model}</div>
                <div className="text-sm text-gray-600">Year: {vehicle.year}</div>
                <div className="text-sm text-gray-500">License: {vehicle.license_plate}</div>
                <div className="text-sm text-gray-500">Battery: {vehicle.battery_capacity} kWh</div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleUpdateVehicle(vehicle.id, { battery_capacity: vehicle.battery_capacity + 1 })}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDeleteVehicle(vehicle.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Management */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Booking Management</h2>
        
        {/* Create Booking Form */}
        <form onSubmit={handleCreateBooking} className="mb-6 p-4 border rounded">
          <h3 className="text-lg font-medium mb-3">Create New Booking</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={newBooking.station_id}
              onChange={(e) => {
                setNewBooking({...newBooking, station_id: e.target.value, slot_id: ''});
                if (e.target.value) handleGetSlots(e.target.value);
              }}
              className="p-2 border rounded"
              required
            >
              <option value="">Select Station</option>
              {stations.map((station) => (
                <option key={station.id} value={station.id}>
                  {station.name} - {station.city}
                </option>
              ))}
            </select>
            <select
              value={newBooking.slot_id}
              onChange={(e) => setNewBooking({...newBooking, slot_id: e.target.value})}
              className="p-2 border rounded"
              required
              disabled={!newBooking.station_id}
            >
              <option value="">Select Slot</option>
              {slots.map((slot) => (
                <option key={slot.id} value={slot.id}>
                  Slot #{slot.slot_number}
                </option>
              ))}
            </select>
            <input
              type="datetime-local"
              value={newBooking.start_time}
              onChange={(e) => setNewBooking({...newBooking, start_time: e.target.value})}
              className="p-2 border rounded"
              required
            />
            <input
              type="datetime-local"
              value={newBooking.end_time}
              onChange={(e) => setNewBooking({...newBooking, end_time: e.target.value})}
              className="p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Booking'}
          </button>
        </form>

        {/* Bookings List */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium">My Bookings ({bookings.length})</h3>
          {bookings.map((booking) => (
            <div key={booking.id} className="p-3 border rounded flex justify-between items-center">
              <div>
                <div className="font-medium">Booking #{booking.id.slice(0, 8)}</div>
                <div className="text-sm text-gray-600">
                  {new Date(booking.start_time).toLocaleString()} - {new Date(booking.end_time).toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">Status: {booking.status}</div>
              </div>
              <button
                onClick={() => handleCancelBooking(booking.id)}
                disabled={booking.status === 'cancelled' || booking.status === 'completed'}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Charging Sessions */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Charging Sessions</h2>
        <div className="space-y-2">
          <h3 className="text-lg font-medium">My Sessions ({sessions.length})</h3>
          {sessions.map((session) => (
            <div key={session.id} className="p-3 border rounded">
              <div className="font-medium">Session #{session.id.slice(0, 8)}</div>
              <div className="text-sm text-gray-600">
                Started: {new Date(session.started_at).toLocaleString()}
              </div>
              {session.ended_at && (
                <div className="text-sm text-gray-600">
                  Ended: {new Date(session.ended_at).toLocaleString()}
                </div>
              )}
              <div className="text-sm text-gray-500">
                Energy: {session.energy_consumed || 0} kWh | Cost: ${session.cost || 0}
              </div>
              <div className="text-sm text-gray-500">Status: {session.status}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Feedback */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Submit Feedback</h2>
        <form onSubmit={handleCreateFeedback} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={newFeedback.station_id}
              onChange={(e) => setNewFeedback({...newFeedback, station_id: e.target.value})}
              className="p-2 border rounded"
              required
            >
              <option value="">Select Station</option>
              {stations.map((station) => (
                <option key={station.id} value={station.id}>
                  {station.name} - {station.city}
                </option>
              ))}
            </select>
            <select
              value={newFeedback.rating}
              onChange={(e) => setNewFeedback({...newFeedback, rating: parseInt(e.target.value)})}
              className="p-2 border rounded"
              required
            >
              <option value={5}>5 Stars - Excellent</option>
              <option value={4}>4 Stars - Good</option>
              <option value={3}>3 Stars - Average</option>
              <option value={2}>2 Stars - Poor</option>
              <option value={1}>1 Star - Very Poor</option>
            </select>
          </div>
          <textarea
            placeholder="Your feedback comment..."
            value={newFeedback.comment}
            onChange={(e) => setNewFeedback({...newFeedback, comment: e.target.value})}
            className="w-full p-2 border rounded"
            rows="3"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserOperations;
