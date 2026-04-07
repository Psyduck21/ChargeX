import React, { useEffect, useState } from 'react';
import { X, MapPin, Navigation, Zap, Plug, Clock, ChevronRight } from 'lucide-react';
import apiService from '../services/api';

export default function AlternativeSlotsModal({
  isOpen,
  onClose,
  stations = [],
  userLocation = null,
  darkMode = false,
  onSelectSlot = null,
  bookingDetails = null,
  lowBattery = false,
  title = "Available Charging Stations",
  message = null
}) {
  const [sortedStations, setSortedStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (stations && stations.length > 0) {
      // Sort by power (descending) if battery is low, otherwise by distance (ascending)
      const sorted = [...stations].sort((a, b) => {
        if (lowBattery) {
          // Sort by max power descending (fastest chargers first)
          const powerA = a.max_power_kw || 0;
          const powerB = b.max_power_kw || 0;
          return powerB - powerA;
        } else {
          // Default: sort by distance ascending
          return (a.distance_km || Infinity) - (b.distance_km || Infinity);
        }
      });
      setSortedStations(sorted);
      if (sorted.length > 0) {
        setSelectedStation(sorted[0]);
      }
    }
  }, [stations, lowBattery]);

  if (!isOpen) return null;

  const getChargerBadgeColor = (chargerType) => {
    switch ((chargerType || '').toLowerCase()) {
      case 'fast':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200';
      case 'normal':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200';
      case 'slow':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const handleSelectStation = (station) => {
    setSelectedStation(station);
  };

  const handleConfirmSelection = async () => {
    if (!selectedStation || !onSelectSlot) return;
    
    try {
      setLoading(true);
      // Invoke the callback - typically this would navigate or open a booking modal
      await onSelectSlot(selectedStation);
      onClose();
    } catch (error) {
      console.error('Error selecting alternative slot:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenInMaps = (station) => {
    if (station.latitude && station.longitude) {
      const mapsUrl = `https://www.google.com/maps/search/${station.latitude},${station.longitude}`;
      window.open(mapsUrl, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
      <div
        className={`w-full max-w-2xl rounded-t-3xl shadow-2xl max-h-[90vh] overflow-y-auto ${
          darkMode ? 'bg-gray-900' : 'bg-white'
        }`}
      >
        {/* Header */}
        <div
          className={`sticky top-0 flex items-center justify-between p-6 border-b ${
            darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
          }`}
        >
          <div className="flex items-center gap-3 flex-1">
            {lowBattery ? (
              <>
                <div className="w-5 h-5 text-red-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                  </svg>
                </div>
                <div>
                  <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Low Battery - Fast Chargers Priority
                  </h2>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Showing fastest chargers first
                  </p>
                </div>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 text-emerald-600" />
                <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {title}
                </h2>
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              darkMode
                ? 'hover:bg-gray-700 text-gray-400'
                : 'hover:bg-gray-100 text-gray-500'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-4 p-6">
          {/* Station List */}
          <div className="space-y-3">
            <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {sortedStations.length} nearby station{sortedStations.length !== 1 ? 's' : ''}
            </p>
            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {sortedStations.map((station, idx) => (
                <button
                  key={station.id || idx}
                  onClick={() => handleSelectStation(station)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                    selectedStation?.id === station.id
                      ? darkMode
                        ? 'bg-emerald-900 border-emerald-500'
                        : 'bg-emerald-50 border-emerald-500'
                      : darkMode
                      ? 'bg-gray-800 border-gray-700 hover:border-emerald-500'
                      : 'bg-white border-gray-200 hover:border-emerald-500'
                  }`}
                >
                  {/* Distance/Power Badge with PIN */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {station.name || 'Charging Station'}
                      </h3>
                      <p className={`text-sm flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <MapPin className="w-4 h-4" />
                        {station.city}, {station.country}
                      </p>
                    </div>
                    {lowBattery ? (
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-red-600" />
                        <span className={`font-bold text-lg ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                          {station.max_power_kw || 0} kW
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Navigation className="w-4 h-4 text-emerald-600" />
                        <span className={`font-bold text-lg ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                          {station.distance_km ? station.distance_km.toFixed(1) : 'N/A'} km
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Charger Types */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {station.connector_types && station.connector_types.length > 0 ? (
                      station.connector_types.map((ct, i) => (
                        <span
                          key={i}
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${getChargerBadgeColor(
                            ct.charger_type
                          )}`}
                        >
                          <Plug className="w-3 h-3" />
                          {ct.connector_type} {ct.max_power_kw && `(${ct.max_power_kw}kW)`}
                        </span>
                      ))
                    ) : (
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
                          darkMode
                            ? 'bg-gray-700 text-gray-300'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        <Plug className="w-3 h-3" />
                        Standard charger
                      </span>
                    )}
                  </div>

                  {/* Available Slots & Rating */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        <strong>{station.available_slots || 0}</strong> slots available
                      </span>
                      {station.rating && (
                        <span className={`${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`}>
                          ⭐ {station.rating.toFixed(1)}
                        </span>
                      )}
                    </div>
                    <ChevronRight
                      className={`w-5 h-5 transition-transform ${
                        selectedStation?.id === station.id ? 'text-emerald-600' : 'text-gray-400'
                      }`}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Detail View */}
          {selectedStation && (
            <div
              className={`rounded-2xl p-6 flex flex-col ${
                darkMode ? 'bg-gray-800' : 'bg-gray-50'
              }`}
            >
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {selectedStation.name || 'Charging Station'}
              </h3>

              {/* Info Grid */}
              <div className="space-y-4 flex-1 mb-6">
                {/* Power - High Priority in Low Battery Mode */}
                {lowBattery && (
                  <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/30 rounded-lg border-2 border-red-200 dark:border-red-700/50">
                    <Zap className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className={`text-sm font-semibold ${darkMode ? 'text-red-300' : 'text-red-700'}`}>
                        ⚡ Fast Charging Power
                      </p>
                      <p className={`text-xl font-bold ${darkMode ? 'text-red-200' : 'text-red-600'}`}>
                        {selectedStation.max_power_kw || 0} kW
                      </p>
                      <p className={`text-xs ${darkMode ? 'text-red-300' : 'text-red-600'}`}>
                        Priority charger for low battery
                      </p>
                    </div>
                  </div>
                )}

                {/* Distance - Shown below power in low battery mode */}
                {!lowBattery && (
                  <div className="flex items-start gap-3">
                    <Navigation className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Distance
                      </p>
                      <p className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {selectedStation.distance_km ? `${selectedStation.distance_km.toFixed(1)} km away` : 'Distance not available'}
                      </p>
                    </div>
                  </div>
                )}

                {lowBattery && (
                  <div className="flex items-start gap-3">
                    <Navigation className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Distance
                      </p>
                      <p className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {selectedStation.distance_km ? `${selectedStation.distance_km.toFixed(1)} km away` : 'Distance not available'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Address */}
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Address
                    </p>
                    <p className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedStation.address}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {selectedStation.city}, {selectedStation.zip_code} {selectedStation.country}
                    </p>
                  </div>
                </div>

                {/* Slots */}
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Availability
                    </p>
                    <p className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      <strong>{selectedStation.available_slots || 0}</strong> out of{' '}
                      <strong>{selectedStation.total_slots || 'N/A'}</strong> slots available
                    </p>
                  </div>
                </div>

                {/* Price */}
                {selectedStation.price_per_hour && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Pricing
                      </p>
                      <p className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        ₹{selectedStation.price_per_hour.toFixed(2)}/hour
                      </p>
                    </div>
                  </div>
                )}

                {/* Rating */}
                {selectedStation.rating && (
                  <div className="flex items-start gap-3">
                    <span className="text-lg">⭐</span>
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Rating
                      </p>
                      <p className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {selectedStation.rating.toFixed(1)}/5.0 ({selectedStation.reviews || 0} reviews)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t" style={darkMode ? { borderColor: '#374151' } : {}}>
                <button
                  onClick={() => handleOpenInMaps(selectedStation)}
                  className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors ${
                    darkMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                  }`}
                >
                  View in Maps
                </button>
                {onSelectSlot && (
                  <button
                    onClick={handleConfirmSelection}
                    disabled={loading}
                    className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
                      loading
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {loading ? 'Loading...' : 'Book Here'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
