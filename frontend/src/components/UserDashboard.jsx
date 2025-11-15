import React, { useState, useEffect } from 'react';
import { Zap, MapPin, Search, Filter, Navigation, Star, Clock, Battery, DollarSign, Calendar, ChevronRight, Heart, User, Bell, Settings, LogOut, Menu, X, Bookmark, History, CreditCard, Phone, Mail, AlertCircle, Car, Plus, Edit2, Trash2, BarChart3, TrendingUp, Leaf, ChevronDown, Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import ProfileModal from './admindashboard/ProfileModal';
import apiService from '../services/api';
// import StationCard from './user/StationCard';
import BookingModal from './user/BookingModal';
import { useToast } from './ui/Toast';
import StationsTab from './user/StationsTab';
import VehiclesTab from './user/VehiclesTab';
import BookingsTab from './user/BookingsTab';
import HistoryTab from './user/HistoryTab';

function ChargeXUserDashboard({ onLogout }) {
  const { theme, toggleTheme, themeType, isSystem } = useTheme();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState('stations');
  const [stations, setStations] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStation, setSelectedStation] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
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

  // Slots state: loaded when booking modal opens for a station
  const [slotOptions, setSlotOptions] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotFetchError, setSlotFetchError] = useState(null);

  // Toast (use global provider)
  const toast = useToast();

  const [filters, setFilters] = useState({
    connectorType: 'all',
    availability: 'all',
    priceRange: [0, 100],
    rating: 0,
    distance: 50,
    amenities: []
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
  const [userSessions, setUserSessions] = useState([]);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState('unknown');

  const [userStats, setUserStats] = useState({
    totalBookings: 0,
    totalEnergy: 0,
    totalSpent: 0,
    co2Saved: 0
  });

  // Load user data on component mount
  useEffect(() => {
    loadUserData();
    requestLocationPermission();
  }, []);

  // Load user statistics
  const loadUserStats = async () => {
    try {
      const stats = await apiService.getUserStatistics();
      if (stats) {
        setUserStats({
          totalBookings: stats.total_bookings || 0,
          totalEnergy: stats.total_energy || 0,
          totalSpent: stats.total_spent || 0,
          co2Saved: stats.co2_saved || 0
        });
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  // Load user stats when component mounts
  useEffect(() => {
    loadUserStats();
  }, []);

  // Update booking names when stations/vehicles data is loaded
  useEffect(() => {
    if (bookings.length > 0 && stations.length > 0 && vehicles.length > 0) {
      const updatedBookings = bookings.map(b => {
        // Find station name from loaded stations data
        let stationName = b.station_name || 'Unknown Station';
        let stationAddress = b.station_address || 'Address not available';

        if (b.station_id) {
          const station = stations.find(s => {
            const match = String(s.id) === String(b.station_id);
            return match;
          });
          if (station) {
            stationName = station.name;
            stationAddress = station.address;
          }
        }

        // Find vehicle name from loaded vehicles data
        let vehicleName = b.vehicle_name || 'Unknown Vehicle';

        if (b.vehicle_id) {
          const vehicle = vehicles.find(v => {
            const match = String(v.id) === String(b.vehicle_id);
            return match;
          });
          if (vehicle) {
            vehicleName = `${vehicle.brand} ${vehicle.model}`;
          }
        }

        // Format timestamps properly
        const startTime = new Date(b.start_time);
        const endTime = b.end_time ? new Date(b.end_time) : null;

        return {
          ...b,
          station_name: stationName,
          station_address: stationAddress,
          vehicle_name: vehicleName,
          booking_date: startTime.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }),
          time_slot: `${startTime.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          })}${endTime ? ` - ${endTime.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          })}` : ''}`,
          formatted_start_time: startTime.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          }),
          formatted_end_time: endTime ? endTime.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          }) : null
        };
      });

      setBookings(updatedBookings);
    }
  }, [stations, vehicles]);

  // Update distances when both stations and user location are available
  useEffect(() => {
    if (stations.length > 0 && userLocation && !stations.some(s => s.distance > 0)) {
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
          setUserLocation(userLoc);
          setLocationPermission('granted');
          updateStationDistances(userLoc);
        },
        (error) => {
          setLocationPermission('denied');
          const defaultLocation = { lat: 28.6139, lng: 77.2090 };
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
      setLocationPermission('denied');
      const defaultLocation = { lat: 28.6139, lng: 77.2090 };
      setUserLocation(defaultLocation);
      updateStationDistances(defaultLocation);
    }
  };

  // Calculate driving distance using Haversine formula
  const calculateDrivingDistance = async (origin, destination) => {
    const distance = calculateHaversineDistance(origin.lat, origin.lng, destination.lat, destination.lng);
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

    const distancePromises = stations.map(async (station) => {
      if (!station.lat || !station.lng) {
        return { ...station, distance: 0 };
      }

      try {
        const distance = await calculateDrivingDistance(
          { lat: userLoc.lat, lng: userLoc.lng },
          { lat: station.lat, lng: station.lng }
        );
        return { ...station, distance: distance };
      } catch (error) {
        console.error('❌ Error calculating distance for station:', station.name, error);
        const distance = calculateHaversineDistance(userLoc.lat, userLoc.lng, station.lat, station.lng);
        return { ...station, distance: distance };
      }
    });

    try {
      const updatedStations = await Promise.all(distancePromises);
      setStations(updatedStations);
    } catch (error) {
      console.error('❌ Error updating station distances:', error);
      const updatedStations = stations.map(station => ({
        ...station,
        distance: station.lat && station.lng
          ? calculateHaversineDistance(userLoc.lat, userLoc.lng, station.lat, station.lng)
          : 0
      }));
      setStations(updatedStations);
    }
  };

  // Get directions to station - only available after location permission is granted
  const getDirections = (station) => {
    if (locationPermission !== 'granted' || !userLocation) {
      toast.error('Please enable location services first to get directions');
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

      // Fetch user bookings (store raw data, transformation happens in useEffect)
      const bookingsData = await apiService.getUserBookings();
      if (bookingsData && bookingsData.length > 0) {
        setBookings(bookingsData); // Store raw booking data
      } else {
        setBookings([]);
      }

      // Fetch user charging sessions (with costs)
      try {
        const sessionsData = await apiService.getUserChargingSessions();
        if (sessionsData && sessionsData.length > 0) {
          setUserSessions(sessionsData);
          // For backward compatibility with HistoryTab, set bookingHistory too
          setBookingHistory(sessionsData);
        } else {
          setUserSessions([]);
          setBookingHistory([]);
        }
      } catch (error) {
        console.error('Error loading user charging sessions:', error);
        setUserSessions([]);
        setBookingHistory([]);
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
          image: s.image || 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop',
          isOpen: s.is_open !== false,
          openHours: s.open_hours || '24/7',
          photos: s.photos || []
        }));

        setStations(transformedStations);
        setFilteredStations(transformedStations);

        if (userLocation) {
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

    // Distance filter - show stations within the specified distance
    result = result.filter(station => station.distance <= filters.distance);

    if (sortBy === 'distance') {
      result.sort((a, b) => a.distance - b.distance);
    } else if (sortBy === 'price') {
      result.sort((a, b) => a.pricePerHour - b.pricePerHour);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    setFilteredStations(result);
  }, [searchQuery, filters, sortBy, stations]);

  // Fetch slots for the selected station when booking modal opens or when date/time/duration changes
  useEffect(() => {
    const fetchSlotsAndFilter = async () => {
      if (!showBookingModal || !selectedStation) return;
      setSlotsLoading(true);
      try {
        const slotsResp = await apiService.getSlots(selectedStation.id);
        const slots = slotsResp || [];
        const bookingsResp = await apiService.getBookings();
        const bookings = bookingsResp || [];


        // Filter bookings for this station and sensible statuses
        const stationBookings = bookings.filter(b => String(b.station_id) === String(selectedStation.id) && b.status !== 'rejected' && b.status !== 'cancelled');

        const requestedStart = bookingData.timeSlot ? new Date(`${bookingData.date}T${bookingData.timeSlot}`) : null;
        const requestedEnd = requestedStart ? new Date(requestedStart.getTime() + bookingData.duration * 60 * 60 * 1000) : null;

        const rangesOverlap = (aStart, aEnd, bStart, bEnd) => aStart < bEnd && bStart < aEnd;

        const available = slots.filter(slot => {
          // normalize common slot fields (some APIs return different shapes)
          const slotId = slot.id || slot.slot_id || slot.slotId;
          const status = slot.status || (slot.is_available === false ? 'unavailable' : 'available');
          const is_available = typeof slot.is_available === 'boolean' ? slot.is_available : (slot.available !== undefined ? slot.available : true);

          // Only consider slots that are marked available
          if (String(status) !== 'available' || is_available === false) return false;

          // If user hasn't chosen a time yet, include physically available slots
          if (!requestedStart) return true;

          // If any booking for this slot overlaps the requested range, mark as unavailable
          const hasConflict = stationBookings.some(b => {
            const bSlotId = b.slot_id || b.slotId || b.slot;
            if (!bSlotId || String(bSlotId) !== String(slotId)) return false;
            try {
              const bStart = new Date(b.start_time || b.startTime);
              const bEnd = new Date(b.end_time || b.endTime);
              return rangesOverlap(requestedStart, requestedEnd, bStart, bEnd);
            } catch (e) {
              return false;
            }
          });

          return !hasConflict;
        }).map(s => {
          const slotId = s.id || s.slot_id || s.slotId;
          return {
            id: String(slotId),
            label: `${s.connector_type || s.connectorType || s.connector || 'Unknown'} - ${s.max_power_kw ? s.max_power_kw + ' kW' : (s.max_power || s.power || 'N/A')}`,
            connectorType: s.connector_type || s.connectorType || s.connector || '',
            raw: s
          };
        });

        setSlotOptions(available);
        setSlotFetchError(null);

        // If current selected slot is no longer available, clear it
        if (bookingData.slotId && !available.some(a => a.id === bookingData.slotId)) {
          setBookingData(prev => ({ ...prev, slotId: null, connectorType: '' }));
        }
      } catch (e) {
        console.error('Failed to load slots or bookings', e);
        setSlotFetchError(e.message || String(e));
        setSlotOptions([]);
      } finally {
        setSlotsLoading(false);
      }
    };

    fetchSlotsAndFilter();
  }, [showBookingModal, selectedStation, bookingData.date, bookingData.timeSlot, bookingData.duration]);

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
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen w-64 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r p-6 z-40 transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>ChargeX</span>
        </div>

        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab('stations')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium ${
              activeTab === 'stations' ? 'bg-emerald-600 text-white' : `${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`
            }`}
          >
            <MapPin className="w-5 h-5" />
            Find Stations
          </button>
          <button
            onClick={() => setActiveTab('vehicles')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium ${
              activeTab === 'vehicles' ? 'bg-emerald-600 text-white' : `${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`
            }`}
          >
            <Car className="w-5 h-5" />
            My Vehicles
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium ${
              activeTab === 'bookings' ? 'bg-emerald-600 text-white' : `${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`
            }`}
          >
            <Calendar className="w-5 h-5" />
            My Bookings
          </button>
          {/* <button
            onClick={() => setActiveTab('history')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium ${
              activeTab === 'history' ? 'bg-emerald-600 text-white' : `${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`
            }`}
          >
            <History className="w-5 h-5" />
            History
          </button> */}
          <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium ${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}>
            <CreditCard className="w-5 h-5" />
            Payments
          </button>
        </nav>

        <div className="absolute bottom-6 left-6 right-6 space-y-3">
          <button
            onClick={() => setShowLogoutModal(true)}
            className={`w-full flex items-center gap-3 p-4 ${isDark ? 'bg-red-900/20 text-red-400 hover:bg-red-900/30' : 'bg-red-50 text-red-700 hover:bg-red-100'} rounded-xl transition-colors`}
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
          <button
            onClick={() => setShowProfile(true)}
            className={`w-full flex items-center gap-3 p-4 ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} rounded-xl transition-colors`}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">
              {userProfile.name[0]}
            </div>
            <div className="text-left flex-1">
              <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{userProfile.name.split(' ')[0]}</p>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>View Profile</p>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-4 md:p-8">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`lg:hidden fixed top-4 left-4 z-50 p-2 ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg`}
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Stations Tab */}
        {activeTab === 'stations' && (
          <StationsTab
            stations={stations}
            filteredStations={filteredStations}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filters={filters}
            setFilters={setFilters}
            sortBy={sortBy}
            setSortBy={setSortBy}
            userProfile={userProfile}
            vehicles={vehicles}
            onBookStation={(s) => { setSelectedStation(s); setShowBookingModal(true); }}
            onGetDirections={getDirections}
            locationPermission={locationPermission}
            requestLocationPermission={requestLocationPermission}
            darkMode={isDark}
          />
        )}

        {/* Vehicles Tab */}
        {activeTab === 'vehicles' && (
          <VehiclesTab
            vehicles={vehicles}
            setVehicles={setVehicles}
            toast={toast}
            darkMode={isDark}
          />
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <BookingsTab
            bookings={bookings}
            userSessions={userSessions}
            stations={stations}
            vehicles={vehicles}
            setActiveTab={setActiveTab}
            onBookingUpdate={loadUserData}
            darkMode={isDark}
          />
        )}

        {/* History Tab */}
        {/* {activeTab === 'history' && (
          <HistoryTab
            bookingHistory={bookingHistory}
            setActiveTab={setActiveTab}
            darkMode={isDark}
          />
        )} */}
      </main>

      <BookingModal
        selectedStation={selectedStation}
        bookingData={bookingData}
        setBookingData={setBookingData}
        setSelectedStation={setSelectedStation}
        setShowBookingModal={setShowBookingModal}
        vehicles={vehicles}
        slotOptions={slotOptions}
        slotsLoading={slotsLoading}
        slotFetchError={slotFetchError}
      />

  {/* toasts provided by ToastProvider at App root */}
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
