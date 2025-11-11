import React from 'react';
import { Heart, MapPin, Star, Navigation, Clock, Battery, DollarSign } from 'lucide-react';

export default function StationCard({ station, userProfile = { favoriteStations: [] }, vehicles = [], onBook = () => {}, onGetDirections = () => {} }) {
  const isFavorite = (userProfile.favoriteStations || []).includes(station.id);
  const primaryVehicle = vehicles.find(v => v.isPrimary);
  const compatibleConnectors = (station.connectorTypes || []).filter(c =>
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
            <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-semibold rounded-full">Open Now</span>
          ) : (
            <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">Closed</span>
          )}
          {station.availableSlots === 0 && station.isOpen && (
            <span className="px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full">Full</span>
          )}
          {compatibleConnectors.length > 0 && (
            <span className="px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">Compatible</span>
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
              <span className="px-2 py-1 text-xs font-medium rounded-lg bg-gray-100 text-gray-700">No connectors available</span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onBook(station)}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-2.5 rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all"
          >
            Book Now
          </button>
          <button
            onClick={() => onGetDirections(station)}
            className="px-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
            title="Get Directions"
          >
            <Navigation className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
