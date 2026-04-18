import React from 'react';
import { Car, Zap, CheckCircle } from 'lucide-react';

/**
 * VehicleCardInChat
 * Rendered inside an agent chat bubble when the backend returns
 * { type: "vehicle_selection", data: [...] }
 *
 * Props:
 *   vehicles   — array of vehicle objects from the backend
 *   darkMode   — boolean
 *   onSelect   — callback(vehicle) called when user picks a vehicle
 */
function VehicleCardInChat({ vehicles, darkMode, onSelect }) {
  if (!vehicles || vehicles.length === 0) return null;

  // Connector badge colour map
  const connectorColour = (type = '') => {
    const t = type.toLowerCase();
    if (t.includes('ccs')) return { bg: '#1a3a5c', text: '#60c8ff', border: '#2a5a8c' };
    if (t.includes('type 2') || t.includes('type2') || t.includes('j1772'))
      return { bg: '#1a3a2a', text: '#4ade80', border: '#2a6a3a' };
    if (t.includes('chademo')) return { bg: '#3a2a1a', text: '#fb923c', border: '#6a4a2a' };
    return { bg: '#2a2a3a', text: '#a78bfa', border: '#4a4a6a' };
  };

  return (
    <div className="mt-3 flex flex-col gap-2">
      {vehicles.map((v) => {
        const cc = connectorColour(v.connector_type);
        return (
          <div
            key={v.id}
            className={`
              group relative flex items-center gap-4 px-4 py-3 rounded-xl border
              transition-all duration-200 cursor-pointer
              hover:scale-[1.02] hover:shadow-lg
              ${darkMode
                ? 'bg-gray-800/80 border-gray-700 hover:border-emerald-500'
                : 'bg-white border-gray-200 hover:border-emerald-500 shadow-sm'}
            `}
            onClick={() => onSelect(v)}
          >
            {/* Car Icon */}
            <div className={`
              flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
              ${darkMode ? 'bg-gray-700' : 'bg-emerald-50'}
            `}>
              <Car className={`w-5 h-5 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className={`font-semibold text-sm truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {v.brand} {v.model}
                {v.year ? <span className={`ml-1 font-normal text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>({v.year})</span> : null}
              </p>
              {v.license_plate && (
                <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {v.license_plate}
                </p>
              )}
            </div>

            {/* Connector badge */}
            <div
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold flex-shrink-0 border"
              style={{ background: cc.bg, color: cc.text, borderColor: cc.border }}
            >
              <Zap className="w-3 h-3" />
              {v.connector_type || 'Unknown'}
            </div>

            {/* CTA button */}
            <button
              className={`
                flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                transition-all duration-150
                bg-emerald-600 text-white hover:bg-emerald-500
                group-hover:shadow-md group-hover:shadow-emerald-900/30
              `}
              onClick={(e) => { e.stopPropagation(); onSelect(v); }}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Select
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default VehicleCardInChat;
