import React, { useState, useEffect } from 'react';
import { Zap, MapPin, Search, Filter, Navigation, Star, Clock, Battery, DollarSign, Calendar, ChevronRight, Heart, User, Bell, Settings, LogOut, Menu, X, Bookmark, History, CreditCard, Phone, Mail, AlertCircle, Car, Plus, Edit2, Trash2, BarChart3, TrendingUp, Leaf, ChevronDown } from 'lucide-react';
import ProfileModal from './admindashboard/ProfileModal';
import apiService from '../services/api';

function ChargeXUserDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('stations');
  const [stations, setStations] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStation, setSelectedStation] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [showEditVehicle, setShowEditVehicle] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedStationForMap, setSelectedStationForMap] = useState(null);
  const [sortBy, setSortBy] = useState('distance');
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showAddStationModal, setShowAddStationModal] = useState(false);

  const [bookingData, setBookingData] = useState({
    stationId: null,
    vehicleId: null,
    slotId: null,
    connectorType: '',
    currentBattery: 50,
    date: new Date().toISOString().split('T')[0],
    timeSlot: '',
    duration: 2,
    estimatedCost: 0
  });

  const [filters, setFilters] = useState({
    connectorType: 'all',
    availability: 'all',
    priceRange: [0, 100],
    rating: 0,
    amenities: []
  });

  const [userStats, setUserStats] = useState({
    totalBookings: 0,
    totalEnergy: 0,
    totalSpent: 0,
    co2Saved: 0
  });

  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    zipCode: '',
    totalBookings: 0,
    favoriteStations: [],
    joined: '',
    role: 'app_user'
  });

  const [bookings, setBookings] = useState([]);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState('unknown');

  // Load user data on component mount
  useEffect(() => {
    loadUserData();
    requestLocationPermission();
  }, []);

  // Update distances when both stations and user location are available
  useEffect(() => {
    if (stations.length > 0 && userLocation && !stations.some(s => s.distance > 0)) {
      console.log('📍 Both stations and location available, updating distances');
      updateStationDistances(userLocation);
    }
  }, [stations, userLocation]);

  // Request location permission and get user location
  const requestLocationPermission = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLoc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          console.log('✅ User location granted:', userLoc);
          setUserLocation(userLoc);
          setLocationPermission('granted');
          updateStationDistances(userLoc);
        },
        (error) => {
          console.log('❌ User location denied, using fallback');
          setLocationPermission('denied');
          const defaultLocation = { lat: 28.6139, lng: 77.2090 };
          console.log('📍 User location (fallback):', defaultLocation);
          setUserLocation(defaultLocation);
          updateStationDistances(defaultLocation);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    } else {
      console.log('❌ Geolocation not supported, using fallback');
      setLocationPermission('denied');
      const defaultLocation = { lat: 28.6139, lng: 77.2090 };
      console.log('📍 User location (fallback):', defaultLocation);
      setUserLocation(defaultLocation);
      updateStationDistances(defaultLocation);
    }
  };

  // Calculate driving distance using Haversine formula
  const calculateDrivingDistance = async (origin, destination) => {
    console.log(`🗺️ Calculating distance from ${origin.lat},${origin.lng} to ${destination.lat},${destination.lng}`);
    const distance = calculateHaversineDistance(origin.lat, origin.lng, destination.lat, destination.lng);
    console.log('📏 Distance (Haversine):', distance, 'km');
    return distance;
  };

  // Fallback: Calculate distance between two points using Haversine formula
  const calculateHaversineDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return Math.round(distance * 10) / 10;
  };

  // Update distances for all stations
  const updateStationDistances = async (userLoc) => {
    if (!userLoc) return;
    console.log('🔄 Updating distances for', stations.length, 'stations');

    const distancePromises = stations.map(async (station) => {
      if (!station.lat || !station.lng) {
        console.log(`⚠️ Station ${station.name} missing coordinates`);
        return { ...station, distance: 0 };
      }

      try {
        const distance = await calculateDrivingDistance(
          { lat: userLoc.lat, lng: userLoc.lng },
          { lat: station.lat, lng: station.lng }
        );
        console.log(`✅ Station ${station.name}: distance = ${distance} km`);
        return { ...station, distance: distance };
      } catch (error) {
        console.error('❌ Error calculating distance for station:', station.name, error);
        const distance = calculateHaversineDistance(userLoc.lat, userLoc.lng, station.lat, station.lng);
        console.log(`📏 Station ${station.name}: fallback distance = ${distance} km`);
        return { ...station, distance: distance };
      }
    });

    try {
      const updatedStations = await Promise.all(distancePromises);
      console.log('📊 Updated stations with distances:', updatedStations.map(s => ({ name: s.name, distance: s.distance })));
      setStations(updatedStations);
      console.log('✅ Stations state updated');
    } catch (error) {
      console.error('❌ Error updating station distances:', error);
      const updatedStations = stations.map(station => ({
        ...station,
        distance: station.lat && station.lng
          ? calculateHaversineDistance(userLoc.lat, userLoc.lng, station.lat, station.lng)
          : 0
      }));
      console.log('📏 Using fallback distances for all stations');
      setStations(updatedStations);
    }
  };

  // Get directions to station - only available after location permission is granted
  const getDirections = (station) => {
    if (locationPermission !== 'granted' || !userLocation) {
      alert('Please enable location services first to get directions');
      return;
    }

    setSelectedStationForMap(station);
    setShowMapModal(true);
  };

  const loadUserData = async () => {
    try {
      const profile = await apiService.getMyProfile();
      if (profile) {
        setUserProfile({
          name: profile.name || 'User',
          email: profile.email || '',
          phone: profile.phone || '',
          city: profile.city || '',
          zipCode: profile.zip_code || '',
          totalBookings: profile.totalBookings || 0,
          favoriteStations: profile.favoriteStations || [],
          joined: profile.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'January 2024',
          role: 'app_user'
        });
      }

      const vehiclesData = await apiService.getVehicles();
      if (vehiclesData && vehiclesData.length > 0) {
        setVehicles(vehiclesData.map(v => ({
          id: v.id,
          name: `${v.brand} ${v.model}`,
          brand: v.brand,
          model: v.model,
          plateNumber: v.plate_number,
          vehicleType: v.vehicle_type,
          color: v.color,
          connectorType: v.charging_connector || 'CCS',
          batteryCapacity: v.battery_capacity_kwh,
          range: v.range_km,
          lastServiceDate: v.last_service_date,
          image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop'
        })));
      }

      const stationsData = await apiService.getStations();
      if (stationsData && stationsData.length > 0) {
        const transformedStations = stationsData.map(s => ({
          id: s.id,
          name: s.name,
          address: s.address,
          distance: s.distance || 0,
          rating: s.rating || 0,
          reviews: s.reviews || 0,
          availableSlots: s.available_slots || 0,
          totalSlots: s.total_slots || 0,
          pricePerHour: s.price_per_hour || 0,
          chargerTypes: s.charger_types || [],
          connectorTypes: s.connector_types || [],
          amenities: s.amenities || [],
          lat: s.latitude,
          lng: s.longitude,
          image: s.image || 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&h=300&fit=crop',
          isOpen: s.is_open !== false,
          openHours: s.open_hours || '24/7',
          photos: s.photos || []
        }));

        transformedStations.forEach(station => {
          console.log(`Station ${station.name}: {lat: ${station.lat}, lng: ${station.lng}}`);
        });

        setStations(transformedStations);
        setFilteredStations(transformedStations);

        if (userLocation) {
          console.log('📍 User location already available, updating distances for loaded stations');
          updateStationDistances(userLocation);
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  useEffect(() => {
    let result = [...stations];

    if (searchQuery) {
      result = result.filter(station =>
        station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        station.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filters.connectorType !== 'all') {
      result = result.filter(station =>
        station.chargerTypes.includes(filters.connectorType)
      );
    }

    if (filters.availability === 'available') {
      result = result.filter(station => station.availableSlots > 0 && station.isOpen);
    }

    result = result.filter(station =>
      station.pricePerHour >= filters.priceRange[0] &&
      station.pricePerHour <= filters.priceRange[1]
    );

    if (filters.rating > 0) {
      result = result.filter(station => station.rating >= filters.rating);
    }

    if (sortBy === 'distance') {
      result.sort((a, b) => a.distance - b.distance);
    } else if (sortBy === 'price') {
      result.sort((a, b) => a.pricePerHour - b.pricePerHour);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    setFilteredStations(result);
  }, [searchQuery, filters, sortBy, stations]);

  const calculateEstimatedCost = (connector, duration) => {
    return connector.price * duration;
  };

  const calculateChargingTime = (vehicle, targetPercentage = 80) => {
    if (!vehicle) return 0;
    const neededCharge = (targetPercentage - vehicle.currentBattery) / 100;
    const neededEnergy = vehicle.batteryCapacity * neededCharge;
    return Math.ceil(neededEnergy / 50);
  };

  const StatsCard = ({ icon: Icon, title, value, subtitle, color }) => (
    <div className={`bg-gradient-to-br ${color} rounded-2xl p-6 text-white transform hover:scale-105 transition-all`}>
      <div className="flex items-center justify-between mb-4">
        <Icon className="w-8 h-8" />
        <span className="text-white/80 text-sm">{title}</span>
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-white/80 text-sm">{subtitle}</div>
    </div>
  );

  const StationCard = ({ station }) => {
    const isFavorite = userProfile.favoriteStations.includes(station.id);
    const primaryVehicle = vehicles.find(v => v.isPrimary);
    const compatibleConnectors = station.connectorTypes.filter(c =>
      !primaryVehicle || c.type === primaryVehicle.connectorType
    );

    return (
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden group">
        <div className="relative">
          <img
            src={station.image}
            alt={station.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <button className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
          </button>
          <div className="absolute top-3 left-3 flex gap-2">
            {station.isOpen ? (
              <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-semibold rounded-full">
                Open Now
              </span>
            ) : (
              <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                Closed
              </span>
            )}
            {station.availableSlots === 0 && station.isOpen && (
              <span className="px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full">
                Full
              </span>
            )}
            {compatibleConnectors.length > 0 && (
              <span className="px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
                Compatible
              </span>
            )}
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-1">{station.name}</h3>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {station.address}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold text-gray-900">{station.rating || 'N/A'}</span>
              <span className="text-sm text-gray-500">({station.reviews || 0})</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Navigation className="w-4 h-4" />
              {station.distance && station.distance > 0 ? `${station.distance} km` : 'Distance unavailable'}
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              {station.openHours || 'Hours unavailable'}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Battery className={`w-4 h-4 ${station.availableSlots > 0 ? 'text-emerald-600' : 'text-red-600'}`} />
              <span className="text-gray-700">
                {station.availableSlots} slot{station.availableSlots !== 1 ? 's' : ''} available
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="w-4 h-4 text-gray-600" />
              <span className="text-gray-700">
                {station.connectorTypes && station.connectorTypes.length > 0
                  ? `From ₹${Math.min(...station.connectorTypes.map(c => c.price || 0))}/hr`
                  : 'Price unavailable'
                }
              </span>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Available Connectors:</p>
            <div className="flex flex-wrap gap-2">
              {station.connectorTypes && station.connectorTypes.length > 0 ? (
                station.connectorTypes.map((connector, idx) => (
                  <span
                    key={idx}
                    className={`px-2 py-1 text-xs font-medium rounded-lg ${
                      compatibleConnectors.some(c => c.type === connector.type)
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {connector.type} ({connector.power || 'N/A'})
                  </span>
                ))
              ) : (
                <span className="px-2 py-1 text-xs font-medium rounded-lg bg-gray-100 text-gray-700">
                  No connectors available
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setSelectedStation(station);
                setShowBookingModal(true);
              }}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-2.5 rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all"
            >
              Book Now
            </button>
            <button
              onClick={() => getDirections(station)}
              className="px-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              title="Get Directions"
            >
              <Navigation className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Modal Components
  const BookingModal = () => {
    if (!selectedStation) return null;

    // Get available slots for this station (simplified - in real app would fetch from API)
    const availableSlots = [
      { id: 'slot-1', connectorType: 'CCS', power: '50kW' },
      { id: 'slot-2', connectorType: 'Type 2', power: '22kW' },
      { id: 'slot-3', connectorType: 'CHAdeMO', power: '100kW' }
    ];

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Book Charging Station</h2>
              <button
                onClick={() => {
                  setSelectedStation(null);
                  setShowBookingModal(false);
                  setBookingData({
                    stationId: null,
                    vehicleId: null,
                    slotId: null,
                    connectorType: '',
                    currentBattery: 50,
                    date: new Date().toISOString().split('T')[0],
                    timeSlot: '',
                    duration: 2,
                    estimatedCost: 0
                  });
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedStation.name}</h3>
                <p className="text-gray-600">{selectedStation.address}</p>
              </div>

              {/* Current Battery Level */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Current Battery Level: {bookingData.currentBattery}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={bookingData.currentBattery}
                  onChange={(e) => setBookingData({ ...bookingData, currentBattery: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Vehicle Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Vehicle</label>
                <select
                  value={bookingData.vehicleId || ''}
                  onChange={(e) => setBookingData({ ...bookingData, vehicleId: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Select a vehicle</option>
                  {vehicles.map(vehicle => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.name} ({vehicle.connectorType})
                    </option>
                  ))}
                </select>
              </div>

              {/* Slot Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Charging Slot</label>
                <select
                  value={bookingData.slotId || ''}
                  onChange={(e) => {
                    const selectedSlot = availableSlots.find(slot => slot.id === e.target.value);
                    setBookingData({
                      ...bookingData,
                      slotId: e.target.value,
                      connectorType: selectedSlot ? selectedSlot.connectorType : ''
                    });
                  }}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Select a slot</option>
                  {availableSlots.map(slot => (
                    <option key={slot.id} value={slot.id}>
                      {slot.connectorType} - {slot.power}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={bookingData.date}
                    onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Time Slot</label>
                  <select
                    value={bookingData.timeSlot}
                    onChange={(e) => setBookingData({ ...bookingData, timeSlot: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Select time</option>
                    <option value="09:00">09:00 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="15:00">03:00 PM</option>
                    <option value="18:00">06:00 PM</option>
                    <option value="21:00">09:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Duration: {bookingData.duration} hours
                </label>
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={bookingData.duration}
                  onChange={(e) => setBookingData({ ...bookingData, duration: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 hour</span>
                  <span>8 hours</span>
                </div>
              </div>

              {/* Booking Summary */}
              {bookingData.vehicleId && bookingData.slotId && bookingData.timeSlot && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Booking Summary</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><strong>Vehicle:</strong> {vehicles.find(v => v.id === bookingData.vehicleId)?.name}</p>
                    <p><strong>Connector:</strong> {bookingData.connectorType}</p>
                    <p><strong>Date & Time:</strong> {bookingData.date} at {bookingData.timeSlot}</p>
                    <p><strong>Duration:</strong> {bookingData.duration} hours</p>
                    <p><strong>Current Battery:</strong> {bookingData.currentBattery}%</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={async () => {
                    // Validation
                    if (!bookingData.vehicleId) {
                      alert('Please select a vehicle');
                      return;
                    }
                    if (!bookingData.slotId) {
                      alert('Please select a charging slot');
                      return;
                    }
                    if (!bookingData.timeSlot) {
                      alert('Please select a time slot');
                      return;
                    }

                    try {
                      // Calculate start and end times
                      const startDateTime = new Date(`${bookingData.date}T${bookingData.timeSlot}`);
                      const endDateTime = new Date(startDateTime.getTime() + bookingData.duration * 60 * 60 * 1000);

                      // Create booking data according to actual database schema
                      const bookingPayload = {
                        vehicle_id: bookingData.vehicleId,
                        station_id: selectedStation.id,
                        start_time: startDateTime.toISOString(),
                        end_time: endDateTime.toISOString(),
                        status: 'pending'
                      };

                      // Call the API to create the booking
                      console.log('Creating booking:', bookingPayload);
                      const createdBooking = await apiService.createBooking(bookingPayload);

                      console.log('Booking created successfully:', createdBooking);
                      alert('Booking created successfully! Status: Pending');
                      setSelectedStation(null);
                      setShowBookingModal(false);
                      setBookingData({
                        stationId: null,
                        vehicleId: null,
                        slotId: null,
                        connectorType: '',
                        currentBattery: 50,
                        date: new Date().toISOString().split('T')[0],
                        timeSlot: '',
                        duration: 2,
                        estimatedCost: 0
                      });
                    } catch (error) {
                      console.error('Error creating booking:', error);
                      alert('Failed to create booking. Please try again.');
                    }
                  }}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all"
                >
                  Create Booking
                </button>
                <button
                  onClick={() => {
                    setSelectedStation(null);
                    setShowBookingModal(false);
                    setBookingData({
                      stationId: null,
                      vehicleId: null,
                      slotId: null,
                      connectorType: '',
                      currentBattery: 50,
                      date: new Date().toISOString().split('T')[0],
                      timeSlot: '',
                      duration: 2,
                      estimatedCost: 0
                    });
                  }}
                  className="px-6 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
                      alert('Please fill in all required fields');
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
                      alert('Vehicle added successfully!');
                    } catch (error) {
                      console.error('Error adding vehicle:', error);
                      alert('Failed to add vehicle. Please try again.');
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
                      alert('Please fill in all required fields');
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
                      alert('Vehicle updated successfully!');
                    } catch (error) {
                      console.error('Error updating vehicle:', error);
                      alert('Failed to update vehicle. Please try again.');
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

  const FilterPanel = () => {
    if (!showFilters) return null;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl max-w-md w-full max-h-[80vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Connector Type</label>
                <div className="space-y-2">
                  {['all', 'CCS', 'CHAdeMO', 'Type 2'].map(type => (
                    <label key={type} className="flex items-center">
                      <input
                        type="radio"
                        name="connectorType"
                        value={type}
                        checked={filters.connectorType === type}
                        onChange={(e) => setFilters({ ...filters, connectorType: e.target.value })}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="ml-3 text-gray-700">{type === 'all' ? 'All Types' : type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Availability</label>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'All Stations' },
                    { value: 'available', label: 'Available Only' }
                  ].map(option => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        name="availability"
                        value={option.value}
                        checked={filters.availability === option.value}
                        onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="ml-3 text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Price Range: ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}/hr
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  step="10"
                  value={filters.priceRange[1]}
                  onChange={(e) => setFilters({ ...filters, priceRange: [filters.priceRange[0], parseInt(e.target.value)] })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Minimum Rating: {filters.rating > 0 ? `${filters.rating}+ Stars` : 'Any Rating'}
                </label>
                <div className="flex gap-2">
                  {[0, 3, 4, 4.5].map(rating => (
                    <button
                      key={rating}
                      onClick={() => setFilters({ ...filters, rating: rating })}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        filters.rating === rating
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {rating === 0 ? 'Any' : `${rating}+`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setFilters({
                      connectorType: 'all',
                      availability: 'all',
                      priceRange: [0, 100],
                      rating: 0,
                      amenities: []
                    });
                  }}
                  className="flex-1 border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const MapModal = () => {
    if (!showMapModal || !selectedStationForMap || !userLocation) return null;

    const origin = `${userLocation.lat},${userLocation.lng}`;
    const destination = `${selectedStationForMap.lat},${selectedStationForMap.lng}`;
    const directionsUrl = `https://www.google.com/maps/dir/${origin}/${destination}`;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl max-w-lg w-full max-h-[80vh] overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Get Directions</h2>
                <p className="text-gray-600">Navigate to {selectedStationForMap.name}</p>
              </div>
              <button
                onClick={() => {
                  setShowMapModal(false);
                  setSelectedStationForMap(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">From</p>
                  <p className="text-sm text-gray-600">Your current location</p>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                  <ChevronRight className="w-4 h-4 text-white" />
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-lg">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Zap className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">To</p>
                  <p className="text-sm text-gray-600">{selectedStationForMap.name}</p>
                  <p className="text-xs text-gray-500">{selectedStationForMap.address}</p>
                </div>
              </div>
            </div>

            {selectedStationForMap.distance && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Estimated distance: {selectedStationForMap.distance} km</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-6">
            <div className="space-y-3">
              <button
                onClick={() => window.open(directionsUrl, '_blank')}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-4 rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all flex items-center justify-center gap-3"
              >
                <Navigation className="w-5 h-5" />
                Open in Google Maps
              </button>

              <button
                onClick={() => window.open(`https://maps.apple.com/?daddr=${destination}&dirflg=d`, '_blank')}
                className="w-full border-2 border-gray-200 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-3"
              >
                <Navigation className="w-5 h-5" />
                Open in Apple Maps
              </button>

              <button
                onClick={() => {
                  setShowMapModal(false);
                  setSelectedStationForMap(null);
                }}
                className="w-full text-gray-500 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 p-6 z-40 transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">ChargeX</span>
        </div>

        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab('stations')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium ${
              activeTab === 'stations' ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <MapPin className="w-5 h-5" />
            Find Stations
          </button>
          <button
            onClick={() => setActiveTab('vehicles')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium ${
              activeTab === 'vehicles' ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Car className="w-5 h-5" />
            My Vehicles
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium ${
              activeTab === 'bookings' ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Calendar className="w-5 h-5" />
            My Bookings
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium ${
              activeTab === 'history' ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <History className="w-5 h-5" />
            History
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-100">
            <CreditCard className="w-5 h-5" />
            Payments
          </button>
        </nav>

        <div className="absolute bottom-6 left-6 right-6 space-y-3">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
          <button
            onClick={() => setShowProfile(true)}
            className="w-full flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">
              {userProfile.name[0]}
            </div>
            <div className="text-left flex-1">
              <p className="text-sm font-semibold text-gray-900">{userProfile.name.split(' ')[0]}</p>
              <p className="text-xs text-gray-500">View Profile</p>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-4 md:p-8">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-xl shadow-lg"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Stations Tab */}
        {activeTab === 'stations' && (
          <>
            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard
                icon={Calendar}
                title="Total Bookings"
                value={userStats.totalBookings}
                subtitle="Lifetime bookings"
                color="from-blue-500 to-blue-600"
              />
              <StatsCard
                icon={Zap}
                title="Energy Used"
                value={`${userStats.totalEnergy} kWh`}
                subtitle="Total energy consumed"
                color="from-purple-500 to-purple-600"
              />
              <StatsCard
                icon={DollarSign}
                title="Total Spent"
                value={`₹${userStats.totalSpent}`}
                subtitle="On charging"
                color="from-orange-500 to-orange-600"
              />
              <StatsCard
                icon={Leaf}
                title="CO₂ Saved"
                value={`${userStats.co2Saved} kg`}
                subtitle="Environmental impact"
                color="from-emerald-500 to-emerald-600"
              />
            </div>

            {/* Header */}
            <header className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Charging Stations</h1>
                  <p className="text-gray-600">Discover nearby EV charging stations and book your slot</p>
                </div>
                <div className="flex items-center gap-3">
                  {locationPermission === 'granted' && userLocation && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm">
                      <Navigation className="w-4 h-4" />
                      <span>Location enabled</span>
                    </div>
                  )}
                  {locationPermission === 'denied' && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 text-orange-700 rounded-lg text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>Location disabled</span>
                      <button
                        onClick={requestLocationPermission}
                        className="ml-2 px-2 py-1 bg-orange-600 text-white text-xs rounded hover:bg-orange-700 transition-colors"
                      >
                        Enable
                      </button>
                    </div>
                  )}
                  {locationPermission === 'unknown' && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg text-sm">
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                      <span>Getting location...</span>
                    </div>
                  )}
                </div>
              </div>
            </header>

            {/* Search and Filters */}
            <div className="bg-white rounded-2xl p-4 shadow-lg mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name or location..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="distance">Sort by Distance</option>
                    <option value="price">Sort by Price</option>
                    <option value="rating">Sort by Rating</option>
                  </select>
                  <button
                    onClick={() => setShowFilters(true)}
                    className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-2"
                  >
                    <Filter className="w-5 h-5" />
                    Filters
                  </button>
                </div>
              </div>

              {/* Active Filters */}
              {(filters.connectorType !== 'all' || filters.availability !== 'all' || filters.rating > 0) && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
                  <span className="text-sm text-gray-600">Active filters:</span>
                  {filters.connectorType !== 'all' && (
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full flex items-center gap-1">
                      {filters.connectorType}
                      <button onClick={() => setFilters({ ...filters, connectorType: 'all' })}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filters.availability !== 'all' && (
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full flex items-center gap-1">
                      Available Only
                      <button onClick={() => setFilters({ ...filters, availability: 'all' })}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filters.rating > 0 && (
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full flex items-center gap-1">
                      {filters.rating}+ Stars
                      <button onClick={() => setFilters({ ...filters, rating: 0 })}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Found <span className="font-semibold text-gray-900">{filteredStations.length}</span> stations near you
              </p>
            </div>

            {/* Stations Grid */}
            {filteredStations.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No stations found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters or search query</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStations.map((station) => (
                  <StationCard key={station.id} station={station} />
                ))}
              </div>
            )}
          </>
        )}

        {/* Vehicles Tab */}
        {activeTab === 'vehicles' && (
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
                                alert('Vehicle deleted successfully!');
                              } catch (error) {
                                console.error('Error deleting vehicle:', error);
                                alert('Failed to delete vehicle. Please try again.');
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
          </>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <>
            <header className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
                  <p className="text-gray-600">View and manage your charging reservations</p>
                </div>
              </div>
            </header>

            {bookings.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No bookings found</h3>
                <p className="text-gray-600 mb-6">You haven't made any charging reservations yet</p>
                <button
                  onClick={() => setActiveTab('stations')}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all"
                >
                  Find Stations
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{booking.station_name}</h3>
                          <p className="text-gray-600 flex items-center gap-2 mb-2">
                            <MapPin className="w-4 h-4" />
                            {booking.station_address}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(booking.booking_date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {booking.time_slot}
                            </span>
                            <span className="flex items-center gap-1">
                              <Zap className="w-4 h-4" />
                              {booking.connector_type}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`px-3 py-1 rounded-full text-sm font-semibold mb-2 ${
                            booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            booking.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </div>
                          <p className="text-2xl font-bold text-emerald-600">₹{booking.total_cost}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2">
                          <Car className="w-5 h-5 text-gray-600" />
                          <span className="text-sm text-gray-600">{booking.vehicle_name}</span>
                        </div>
                        <div className="flex gap-2">
                          {booking.status === 'pending' && (
                            <>
                              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
                                Confirm
                              </button>
                              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                                Cancel
                              </button>
                            </>
                          )}
                          {booking.status === 'confirmed' && (
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                              View Details
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
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <>
            <header className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Charging History</h1>
                  <p className="text-gray-600">View your past charging sessions and usage statistics</p>
                </div>
                <div className="flex gap-2">
                  <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option value="all">All Time</option>
                    <option value="month">This Month</option>
                    <option value="week">This Week</option>
                    <option value="today">Today</option>
                  </select>
                </div>
              </div>
            </header>

            {/* History Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Sessions</p>
                    <p className="text-2xl font-bold text-gray-900">{bookingHistory.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Battery className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Energy Used</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {bookingHistory.reduce((sum, session) => sum + (session.energy_used || 0), 0).toFixed(1)} kWh
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Cost</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ₹{bookingHistory.reduce((sum, session) => sum + (session.cost || 0), 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">CO₂ Saved</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {(bookingHistory.reduce((sum, session) => sum + (session.energy_used || 0), 0) * 0.4).toFixed(1)} kg
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {bookingHistory.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <History className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No charging history</h3>
                <p className="text-gray-600 mb-6">Your completed charging sessions will appear here</p>
                <button
                  onClick={() => setActiveTab('stations')}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all"
                >
                  Start Charging
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookingHistory.map((session) => (
                  <div key={session.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{session.station_name}</h3>
                          <p className="text-gray-600 flex items-center gap-2 mb-2">
                            <MapPin className="w-4 h-4" />
                            {session.station_address}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(session.session_date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {session.start_time} - {session.end_time}
                            </span>
                            <span className="flex items-center gap-1">
                              <Zap className="w-4 h-4" />
                              {session.connector_type}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-2">
                            Completed
                          </div>
                          <p className="text-2xl font-bold text-emerald-600">₹{session.cost}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600">{session.energy_used} kWh</p>
                          <p className="text-sm text-gray-600">Energy Used</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-purple-600">{session.duration}h</p>
                          <p className="text-sm text-gray-600">Duration</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">
                            {(session.energy_used * 0.4).toFixed(1)} kg
                          </p>
                          <p className="text-sm text-gray-600">CO₂ Saved</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-4">
                        <div className="flex items-center gap-2">
                          <Car className="w-5 h-5 text-gray-600" />
                          <span className="text-sm text-gray-600">{session.vehicle_name}</span>
                        </div>
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                          View Receipt
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <BookingModal />
      <AddVehicleModal />
      <EditVehicleModal />
      <FilterPanel />
      <MapModal />
      <ProfileModal
        showProfileModal={showProfile}
        adminProfile={userProfile}
        setShowProfileModal={setShowProfile}
        setAdminProfile={setUserProfile}
      />

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="p-8">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <LogOut className="w-8 h-8 text-red-600" />
                </div>
              </div>

              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Logout</h2>
                <p className="text-gray-600">Are you sure you want to logout from your account?</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowLogoutModal(false);
                    onLogout();
                  }}
                  className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition-all"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}

export default ChargeXUserDashboard;
