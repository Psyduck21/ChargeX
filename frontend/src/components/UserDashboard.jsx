import React, { useState, useEffect, useRef } from 'react';
import { Zap, MapPin, Navigation, Clock, Calendar, User, LogOut, X, Car, ChevronRight, ChevronDown, MessageSquare } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import UserManagementSuite from './user/UserManagementSuite';
import apiService from '../services/api';
// import StationCard from './user/StationCard';
import BookingModal from './user/BookingModal';
import { useToast } from './ui/Toast';
import StationsTab from './user/StationsTab';
import AgentTab from './user/AgentTab';

function ChargeXUserDashboard({ onLogout }) {
  const { theme, toggleTheme, themeType, isSystem } = useTheme();
  const isDark = theme === 'dark';

  const [activeView, setActiveView] = useState('agent'); // agent, stations
  const [showUserSuite, setShowUserSuite] = useState(false);
  const [profileInitialTab, setProfileInitialTab] = useState('profile');

  const [stations, setStations] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStation, setSelectedStation] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedStationForMap, setSelectedStationForMap] = useState(null);
  const [sortBy, setSortBy] = useState('distance');
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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

  // Transform bookings data when stations/vehicles data changes
  // This creates a new array instead of modifying existing state
  const transformedBookings = React.useMemo(() => {
    if (bookings.length === 0) return [];

    return bookings.map(b => {
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

      // Format timestamps properly with error handling
      let startTime, endTime;
      try {
        // Ensure string ends with Z if it looks like a naive timestamp but we want it treated as UTC
        // or just rely on the browser's parsing if it's already aware.
        const startStr = b.start_time;
        const endStr = b.end_time;
        
        startTime = new Date(startStr);
        endTime = endStr ? new Date(endStr) : null;
      } catch (e) {
        console.warn('Invalid date format in booking:', b);
        startTime = new Date();
        endTime = null;
      }

      // Generate a consistent time_slot if it's not provided by backend
      const timeSlotStr = b.time_slot || `${startTime.toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })}${endTime ? ` - ${endTime.toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })}` : ''}`;

      return {
        ...b,
        station_name: stationName,
        station_address: stationAddress,
        vehicle_name: vehicleName,
        booking_date: startTime.toLocaleDateString([], {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        time_slot: timeSlotStr,
        formatted_start_time: startTime.toLocaleString([], {
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
  }, [bookings, stations, vehicles]);

  // Open the full-screen profile suite pointing at a specific tab
  const openProfileSuite = (tab = 'profile') => {
    setProfileInitialTab(tab);
    setShowUserSuite(true);
  };

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
        const stationBookings = bookings.filter(b => String(b.station_id) === String(selectedStation.id) && b.status !== 'cancelled');

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
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 ${isDark ? 'bg-gray-900/95 border-gray-800' : 'bg-white/95 border-gray-200'} border-b px-6 py-3 backdrop-blur-sm`}>
        <div className="flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>ChargeX</span>
          </div>

          {/* Chat / Stations Pill Tab Bar */}
          <div className={`flex items-center gap-1 p-1 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <button
              id="tab-chat"
              onClick={() => setActiveView('agent')}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl font-semibold text-sm transition-all duration-200 ${
                activeView === 'agent'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat</span>
            </button>
            <button
              id="tab-stations"
              onClick={() => setActiveView('stations')}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl font-semibold text-sm transition-all duration-200 ${
                activeView === 'stations'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Stations</span>
            </button>
          </div>

          {/* User Avatar → opens full-screen profile suite */}
          <div className="relative group">
            <button
              id="avatar-btn"
              onClick={() => openProfileSuite('profile')}
              className={`flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl transition-all duration-200 ${
                isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm ring-2 ring-emerald-500/30">
                {(userProfile.name?.[0] || 'U').toUpperCase()}
              </div>
              <div className="hidden sm:block text-left">
                <p className={`text-sm font-semibold leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {userProfile.name?.split(' ')[0] || 'User'}
                </p>
                <p className={`text-xs leading-tight ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>My Account</p>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 ${isDark ? 'text-gray-400' : 'text-gray-400'} hidden sm:block`} />
            </button>

            {/* Hover mini-menu */}
            <div className={`absolute right-0 top-full mt-2 w-52 rounded-2xl shadow-xl border py-2 z-50
              invisible opacity-0 translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0
              transition-all duration-200
              ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
              {[
                { label: 'My Profile',  icon: User,     tab: 'profile'  },
                { label: 'My Vehicles', icon: Car,      tab: 'vehicles' },
                { label: 'My Bookings', icon: Calendar, tab: 'bookings' },
              ].map(({ label, icon: Icon, tab }) => (
                <button
                  key={tab}
                  onClick={() => openProfileSuite(tab)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors text-sm
                    ${isDark ? 'text-gray-300 hover:bg-gray-700/60' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
              <div className={`border-t mx-2 my-1 ${isDark ? 'border-gray-700' : 'border-gray-100'}`} />
              <button
                onClick={() => setShowLogoutModal(true)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-red-500 hover:bg-red-50/60 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="pt-[4.25rem] min-h-screen">
        <main className="h-[calc(100vh-4.25rem)] overflow-y-auto">

          {activeView === 'agent' && (
            <AgentTab
              userProfile={userProfile}
              userLocation={userLocation}
              stations={stations}
              vehicles={vehicles}
              darkMode={isDark}
              onBookStation={(s) => { setSelectedStation(s); setShowBookingModal(true); }}
            />
          )}

          {activeView === 'stations' && (
            <div className="p-6">
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
            </div>
          )}

        </main>
      </div>

      {/* Full-Screen Profile Suite (avatar-triggered) */}
      <UserManagementSuite
        isOpen={showUserSuite}
        onClose={() => setShowUserSuite(false)}
        initialTab={profileInitialTab}
        userProfile={userProfile}
        setUserProfile={setUserProfile}
        vehicles={vehicles}
        setVehicles={setVehicles}
        bookings={transformedBookings}
        userSessions={userSessions}
        stations={stations}
        darkMode={isDark}
        loadUserData={loadUserData}
        onLogout={() => { setShowUserSuite(false); setShowLogoutModal(true); }}
      />

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

      {/* Modals */}
      <MapModal />

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
    </div>
  );
}

export default ChargeXUserDashboard;
