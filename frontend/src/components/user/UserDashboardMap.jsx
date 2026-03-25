import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Zap, Navigation, Star, Clock, Battery } from 'lucide-react';
import Button from './ui/Button';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;

// Custom EV station map icon
const createStationIcon = (isAvailable, size = 32) => {
  const color = isAvailable ? '#10b981' : '#f59e0b';
  
  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="${size}" height="${size}">
      <path fill="${color}" d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0z"/>
      <path fill="#ffffff" d="M213.3 160h-48V64l-64 128h48v96l64-128z"/>
    </svg>
  `;
  
  return L.divIcon({
    className: 'custom-div-icon',
    html: svgIcon,
    iconSize: [size, size],
    iconAnchor: [size/2, size]
  });
};

// Component to dynamically set map center
function MapViewUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center.lat && center.lng) {
      map.setView([center.lat, center.lng], map.getZoom(), { animate: true });
    }
  }, [center, map]);
  return null;
}

export default function UserDashboardMap({ 
  stations, 
  userLocation, 
  onBookStation, 
  onGetDirections,
  darkMode 
}) {
  const [mapCenter, setMapCenter] = useState({ lat: 28.6139, lng: 77.2090 }); // Default
  const [activeStation, setActiveStation] = useState(null);

  useEffect(() => {
    if (userLocation && userLocation.lat && userLocation.lng) {
      setMapCenter(userLocation);
    } else if (stations && stations.length > 0) {
      // Find first station with valid coordinates as fallback
      const validStation = stations.find(s => s.lat && s.lng);
      if (validStation) {
        setMapCenter({ lat: validStation.lat, lng: validStation.lng });
      }
    }
  }, [userLocation, stations]);

  return (
    <div className={`relative w-full h-[calc(100vh-180px)] rounded-2xl overflow-hidden border ${darkMode ? 'border-gray-700' : 'border-gray-200'} shadow-lg`}>
      <MapContainer 
        center={[mapCenter.lat, mapCenter.lng]} 
        zoom={12} 
        style={{ height: '100%', width: '100%', zIndex: 10 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={darkMode 
            ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          }
        />
        <MapViewUpdater center={mapCenter} />

        {userLocation && userLocation.lat && (
          <Marker 
            position={[userLocation.lat, userLocation.lng]}
            icon={L.divIcon({
              className: 'user-location-marker',
              html: `<div style="width:16px;height:16px;background-color:#3b82f6;border-radius:50%;border:3px solid white;box-shadow:0 0 10px rgba(0,0,0,0.3)"></div>`,
              iconSize: [16, 16],
              iconAnchor: [8, 8]
            })}
          >
            <Popup>
              <div className="font-semibold">Your Location</div>
            </Popup>
          </Marker>
        )}

        {(stations || []).map(station => {
          if (!station.lat || !station.lng) return null;
          const isAvailable = station.availableSlots > 0 && station.isOpen;
          
          return (
            <Marker
              key={station.id}
              position={[station.lat, station.lng]}
              icon={createStationIcon(isAvailable, activeStation?.id === station.id ? 44 : 36)}
              eventHandlers={{
                click: () => setActiveStation(station),
              }}
            >
              <Popup className="station-popup" closeButton={false}>
                <div className={`p-1 min-w-[240px]`}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900 text-lg leading-tight">{station.name}</h3>
                    <div className="flex items-center gap-1 bg-yellow-100 px-1.5 py-0.5 rounded text-xs font-bold text-yellow-700">
                      <Star className="w-3 h-3 fill-current" />
                      {station.rating || 'N/A'}
                    </div>
                  </div>
                  
                  <p className="text-gray-500 text-xs mb-3 truncate" title={station.address}>
                    {station.address}
                  </p>
                  
                  <div className="flex gap-2 mb-3">
                    <div className="flex-1 bg-gray-50 p-2 rounded relative overflow-hidden flex flex-col justify-center">
                      <div className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold flex items-center gap-1 mb-0.5">
                        <Battery className="w-3 h-3" /> available
                      </div>
                      <div className="font-bold text-gray-900 text-sm">
                        <span className={isAvailable ? "text-emerald-600" : "text-gray-400"}>
                          {station.availableSlots}
                        </span>
                        <span className="text-gray-400 text-xs font-normal"> / {station.totalSlots}</span>
                      </div>
                    </div>
                    
                    <div className="flex-1 bg-gray-50 p-2 rounded relative overflow-hidden flex flex-col justify-center">
                      <div className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold flex items-center gap-1 mb-0.5">
                        <Clock className="w-3 h-3" /> speed
                      </div>
                      <div className="font-bold text-gray-900 text-sm">
                        {station.chargerTypes?.[0] || 'Standard'}
                      </div>
                    </div>
                  </div>
                  
                  <p className="font-bold text-gray-900 mb-3 text-sm">₹{station.pricePerHour}<span className="text-gray-400 text-xs font-normal">/hr</span></p>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => onGetDirections(station)}
                      variant="outline"
                      className="flex-1 text-xs py-1.5 px-0 h-auto flex flex-row items-center justify-center gap-1"
                    >
                      <Navigation className="w-3 h-3" /> Dir
                    </Button>
                    <Button 
                      onClick={() => onBookStation(station)}
                      variant="primary"
                      className={`flex-[2] text-xs py-1.5 px-0 h-auto ${isAvailable ? 'bg-emerald-600' : 'bg-gray-400 cursor-not-allowed border-none text-white'}`}
                      disabled={!isAvailable}
                    >
                      {isAvailable ? 'Book Now' : 'Full'}
                    </Button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      
      <div className={`absolute bottom-6 right-6 z-[1000] p-3 rounded-xl shadow-xl ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div dangerouslySetInnerHTML={{__html: createStationIcon(true, 20).options.html}} />
            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div dangerouslySetInnerHTML={{__html: createStationIcon(false, 20).options.html}} />
            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Full / Offline</span>
          </div>
        </div>
      </div>
    </div>
  );
}
