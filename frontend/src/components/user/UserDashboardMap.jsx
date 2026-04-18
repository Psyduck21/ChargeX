import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { MapPin, Navigation, X, Zap, Star, DollarSign, Users, Phone, Clock } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
// We'll hide the native routing instructions panel since it can be bulky
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

// Component to handle map centering when user location changes
const mapStyles = `
  .leaflet-container .leaflet-popup-pane { z-index: 10 !important; }
  .leaflet-container .leaflet-tooltip-pane { z-index: 15 !important; }
  .leaflet-container .leaflet-marker-pane { z-index: 20 !important; }
  .leaflet-container .leaflet-shadow-pane { z-index: 25 !important; }
  .leaflet-container .leaflet-overlay-pane { z-index: 30 !important; }
  .leaflet-container .leaflet-control-container .leaflet-control { z-index: 35 !important; }
  .leaflet-container .leaflet-map-pane canvas { z-index: 5 !important; }
  .leaflet-container .leaflet-map-pane svg { z-index: 10 !important; }
`;

// Inject custom styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = mapStyles;
  document.head.appendChild(styleSheet);
}

// Component to handle map centering when user location changes
function MapCenterHandler({ center, zoom }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);

  return null;
}

// Map Routing Controller Hook
function RoutingControl({ source, destination, darkMode }) {
  const map = useMap();

  useEffect(() => {
    if (!source || !destination || !map) return;
    
    // Clear old routing controls if they exist
    if (map.routingControl) {
      map.removeControl(map.routingControl);
    }

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(source.lat, source.lng),
        L.latLng(destination.lat || destination.latitude, destination.lng || destination.longitude)
      ],
      routeWhileDragging: false,
      addWaypoints: false,
      fitSelectedRoutes: true,
      lineOptions: {
        styles: [{ color: '#10b981', weight: 6, opacity: 0.8 }]
      },
      show: false, // Don't show the clunky itinerary table
      createMarker: () => null // Hide default ugly markers
    }).addTo(map);
    
    map.routingControl = routingControl;

    return () => {
      try {
        if (map.routingControl) {
           map.removeControl(map.routingControl);
           map.routingControl = null;
        }
      } catch (e) {}
    };
  }, [source, destination, map]);

  return null;
}

/**
 * UserDashboardMap Component
 * Displays charging stations on an interactive Leaflet map
 * Shows user location and allows interaction with stations
 */
export default function UserDashboardMap({
  stations = [],
  userLocation = null,
  onBookStation = null,
  onOpenBookingModal = null,
  onGetDirections = null,
  darkMode = false,
  showBookingModal = false,
  selectedStationForBooking = null,
  onCloseBookingModal = null
}) {
  const [selectedStation, setSelectedStation] = useState(null);
  const [routeDestination, setRouteDestination] = useState(null);
  const [mapCenter, setMapCenter] = useState([40.7128, -74.0060]); // Default to NYC
  const [mapZoom, setMapZoom] = useState(13);

  // Set map center based on user location (highest priority) or first station
  useEffect(() => {
    if (userLocation && userLocation.lat && userLocation.lng) {
      // User location has highest priority
      setMapCenter([userLocation.lat, userLocation.lng]);
      setMapZoom(15); // Higher zoom for user location
    } else if (stations && stations.length > 0) {
      // Fallback to first station if no user location
      const firstStation = stations[0];
      if (firstStation.latitude && firstStation.longitude) {
        setMapCenter([firstStation.latitude, firstStation.longitude]);
        setMapZoom(13);
      }
    } else {
      // Ultimate fallback to NYC
      setMapCenter([40.7128, -74.0060]);
      setMapZoom(12);
    }
  }, [userLocation, stations]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  const normalizeStation = (station) => ({
    ...station,
    latitude: station.latitude ?? station.lat,
    longitude: station.longitude ?? station.lng,
    available_slots: station.available_slots ?? station.availableSlots ?? 0,
    total_slots: station.total_slots ?? station.totalSlots ?? 0,
    price_per_hour: station.price_per_hour ?? station.pricePerHour ?? 0,
    connector_types: station.connector_types ?? station.connectorTypes ?? [],
    address: station.address ?? station.location ?? station.name ?? 'Charging Station',
    name: station.name ?? station.station_name ?? 'Charging Station'
  });

  const handleStationClick = (station) => {
    setSelectedStation(station);
  };

  const handleGetDirections = (station) => {
    if (userLocation && userLocation.lat && userLocation.lng) {
      // Toggle Route off if clicked again on same station, else show
      if (routeDestination && routeDestination.id === station.id) {
        setRouteDestination(null);
      } else {
        setRouteDestination(station);
      }
    } else {
      alert("Please enable location first to get directions.");
    }
  };

  const handleOpenBookingModal = (station) => {
    if (onOpenBookingModal) {
      onOpenBookingModal(station);
    }
  };

  // Custom marker icons
  const createStationIcon = (station) => {
    const isSelected = selectedStation && selectedStation.id === station.id;
    return L.divIcon({
      className: 'custom-station-marker',
      html: `
        <div style="
          background-color: ${isSelected ? '#ef4444' : '#10b981'};
          border: 3px solid white;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          color: white;
          font-weight: bold;
          font-size: 12px;
        ">
          ⚡
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  const createUserIcon = () => {
    return L.divIcon({
      className: 'custom-user-marker',
      html: `
        <div style="
          background-color: #3b82f6;
          border: 3px solid white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          color: white;
          font-weight: bold;
          font-size: 10px;
        ">
          📍
        </div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
  };

  if (!stations || stations.length === 0) {
    return (
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-12 text-center`}>
        <MapPin className="w-10 h-10 mx-auto mb-4 text-gray-400" />
        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>No stations available to display on map</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 relative z-0">
      {/* Map Container */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl border overflow-hidden shadow-lg relative z-0 ${showBookingModal && selectedStationForBooking ? 'hidden' : ''}`}>
        <div className="h-96 w-full relative z-0">
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            style={{ height: '100%', width: '100%', zIndex: 0 }}
            className="rounded-2xl relative z-0"
          >
            <MapCenterHandler center={mapCenter} zoom={mapZoom} />
            <TileLayer
              attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              maxZoom={20}
              subdomains="abcd"
            />
            
            {/* Native routing path */}
            {userLocation && routeDestination && (
               <RoutingControl 
                 source={userLocation} 
                 destination={{lat: routeDestination.latitude, lng: routeDestination.longitude}} 
                 darkMode={darkMode} 
               />
            )}

            {/* User Location Marker */}
            {userLocation && userLocation.lat && userLocation.lng && (
              <Marker
                position={[userLocation.lat, userLocation.lng]}
                icon={createUserIcon()}
              >
                <Popup>
                  <div className="text-center">
                    <strong>Your Location</strong>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Station Markers */}
            {stations.map((station) => {
              const normalized = normalizeStation(station);
              const lat = normalized.latitude;
              const lng = normalized.longitude;

              if (!lat || !lng) return null;

              const distance = userLocation
                ? calculateDistance(userLocation.lat, userLocation.lng, lat, lng)
                : null;

              return (
                <Marker
                  key={normalized.id}
                  position={[lat, lng]}
                  icon={createStationIcon(normalized)}
                  eventHandlers={{
                    click: () => handleStationClick(normalized),
                  }}
                >
                  <Popup>
                    <div className="min-w-72 max-w-80">
                      <h3 className="font-bold text-lg mb-2">{normalized.name || 'Charging Station'}</h3>
                      <p className="text-sm text-gray-600 mb-3">{normalized.address}</p>

                      {distance && (
                        <p className="text-sm text-blue-600 mb-3 flex items-center gap-1">
                          📍 {distance} km away
                        </p>
                      )}

                      {/* Enhanced Slots Information */}
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium">Available Slots</span>
                          </div>
                          <span className={`text-sm font-bold px-2 py-1 rounded-full ${
                            (normalized.available_slots || 0) > 0
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {normalized.available_slots || 0} / {normalized.total_slots || 'N/A'}
                          </span>
                        </div>

                        {/* Slot Status Visualization */}
                        <div className="flex gap-1 mb-2">
                          {Array.from({ length: Math.min(normalized.total_slots || 4, 8) }, (_, i) => (
                            <div
                              key={i}
                              className={`w-3 h-3 rounded-full ${
                                i < (normalized.available_slots || 0)
                                  ? 'bg-green-500'
                                  : 'bg-gray-300'
                              }`}
                              title={i < (normalized.available_slots || 0) ? 'Available' : 'Occupied'}
                            />
                          ))}
                          {(normalized.total_slots || 0) > 8 && (
                            <span className="text-xs text-gray-500 ml-1">
                              +{(normalized.total_slots || 0) - 8} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Pricing Information */}
                      {normalized.price_per_hour && (
                        <div className="flex items-center gap-2 mb-3 p-2 bg-blue-50 rounded-lg">
                          <DollarSign className="w-4 h-4 text-blue-600" />
                          <div>
                            <span className="text-sm font-medium">₹{normalized.price_per_hour}/hour</span>
                            <span className="text-xs text-gray-600 ml-2">
                              Est. ₹{(normalized.price_per_hour * 2).toFixed(0)} for 2hrs
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Connector Types */}
                      {normalized.connector_types && normalized.connector_types.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs text-gray-600 mb-1">Connector Types:</p>
                          <div className="flex flex-wrap gap-1">
                            {normalized.connector_types.slice(0, 3).map((ct, idx) => (
                              <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                                {ct.connector_type || ct.type || ct}
                              </span>
                            ))}
                            {normalized.connector_types.length > 3 && (
                              <span className="text-xs text-gray-500">+{normalized.connector_types.length - 3} more</span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleGetDirections(normalized)}
                          className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                        >
                          <Navigation className="w-4 h-4" />
                          {routeDestination?.id === normalized.id ? 'Clear Route' : 'Directions'}
                        </button>
                        <button
                          onClick={() => handleOpenBookingModal(normalized)}
                          className="flex-1 bg-emerald-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1"
                        >
                          <Zap className="w-4 h-4" />
                          Book Now
                        </button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>

        {/* Map Legend */}
        <div className={`p-4 border-t ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"/>
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Charging Stations</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full"/>
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Your Location</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"/>
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Selected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stations List Below Map */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 relative z-10 ${showBookingModal && selectedStationForBooking ? 'hidden' : ''}`}>
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Stations ({stations.length})
        </h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {stations.map((station) => {
            const normalized = normalizeStation(station);
            const distance = userLocation
              ? calculateDistance(userLocation.lat, userLocation.lng, normalized.latitude, normalized.longitude)
              : null;

            return (
              <div
                key={normalized.id}
                onClick={() => handleStationClick(normalized)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedStation?.id === normalized.id
                    ? darkMode
                      ? 'bg-emerald-900 border-emerald-500'
                      : 'bg-emerald-50 border-emerald-500'
                    : darkMode
                    ? 'bg-gray-700 border-gray-600 hover:border-emerald-500'
                    : 'bg-gray-50 border-gray-200 hover:border-emerald-500'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {normalized.name || 'Charging Station'}
                    </h4>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                      {normalized.address}
                    </p>

                    {/* Enhanced Slot Status */}
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-2 h-2 rounded-full ${
                        (normalized.available_slots || 0) > 0 ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <span className={`text-sm font-medium ${
                        (normalized.available_slots || 0) > 0
                          ? (darkMode ? 'text-green-400' : 'text-green-600')
                          : (darkMode ? 'text-red-400' : 'text-red-600')
                      }`}>
                        {normalized.available_slots || 0} of {normalized.total_slots || 'N/A'} slots free
                      </span>
                    </div>

                    {distance && (
                      <p className={`text-sm font-medium ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        📍 {distance} km away
                      </p>
                    )}
                  </div>

                  <div className="text-right ml-4">
                    {/* Price Display */}
                    {normalized.price_per_hour && (
                      <div className={`text-sm font-bold ${darkMode ? 'text-green-400' : 'text-green-600'} mb-1`}>
                        ₹{normalized.price_per_hour}/hr
                      </div>
                    )}

                    {/* Connector Types */}
                    {normalized.connector_types && normalized.connector_types.length > 0 && (
                      <div className="flex flex-wrap gap-1 justify-end">
                        {normalized.connector_types.slice(0, 2).map((ct, idx) => (
                          <span key={idx} className={`text-xs px-2 py-1 rounded-full ${
                            darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {ct.connector_type || ct.type || ct}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleOpenBookingModal(normalized)}
                    className="flex-1 bg-emerald-600 text-white py-2 rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
                  >
                    Book Now
                  </button>
                  <button
                    onClick={() => handleGetDirections(normalized)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    {routeDestination?.id === normalized.id ? 'Clear Route' : 'Directions'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
