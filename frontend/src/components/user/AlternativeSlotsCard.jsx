import React from 'react';
import { MapPin, Zap, Navigation, ChevronRight, Plug, Clock } from 'lucide-react';

/**
 * AlternativeSlotsCard
 * Rendered inside an agent chat bubble when the backend returns
 * { type: "alternative_slots", data: [...] }
 *
 * Props:
 *   stations   — array of station objects with distance and availability
 *   darkMode   — boolean
 *   onSelect   — callback(station) called when user picks an alternative
 */
function AlternativeSlotsCard({ stations, darkMode, onSelect }) {
  if (!stations || stations.length === 0) return null;

  return (
    <div className="mt-3 flex flex-col gap-3">
      <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
        Recommended Alternatives
      </div>
      
      {stations.map((station, idx) => (
        <div
          key={station.id || idx}
          className={`
            group relative flex flex-col gap-2 p-4 rounded-2xl border
            transition-all duration-200 cursor-pointer
            hover:scale-[1.01] hover:shadow-md
            ${darkMode
              ? 'bg-gray-800/80 border-gray-700 hover:border-emerald-500'
              : 'bg-white border-gray-200 hover:border-emerald-500 shadow-sm'}
          `}
          onClick={() => onSelect(station)}
        >
          {/* Station Name & Distance */}
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1 min-w-0">
              <h4 className={`font-bold text-sm truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {station.is_time_suggestion ? station.name : station.name}
              </h4>
              <p className={`text-xs flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {station.is_time_suggestion ? (
                  <>
                    <Clock className="w-3 h-3" />
                    Available at {station.suggested_time} today
                  </>
                ) : (
                  <>
                    <MapPin className="w-3 h-3" />
                    {station.address || `${station.city}, ${station.country}`}
                  </>
                )}
              </p>
            </div>
            {station.is_time_suggestion ? (
              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold ${darkMode ? 'bg-amber-900/40 text-amber-400' : 'bg-amber-50 text-amber-600'}`}>
                <Zap className="w-3 h-3" />
                Next Best Fit
              </div>
            ) : (
              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold ${darkMode ? 'bg-emerald-900/40 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
                <Navigation className="w-3 h-3" />
                {station.distance_km ? `${station.distance_km} km` : 'Near'}
              </div>
            )}
          </div>

          {/* Availability & Power */}
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-2">
               <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                 <Plug className="w-3 h-3" />
                 {station.available_slots || 0} Slots
               </div>
               {station.max_power_kw > 0 && (
                 <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] ${darkMode ? 'bg-amber-900/30 text-amber-500' : 'bg-amber-50 text-amber-600'}`}>
                   <Zap className="w-3 h-3" />
                   {station.max_power_kw}kW
                 </div>
               )}
            </div>
            
            <button
              className={`
                flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold
                transition-all duration-150
                bg-emerald-600 text-white hover:bg-emerald-500
                group-hover:translate-x-1 shadow-sm
              `}
              onClick={(e) => { e.stopPropagation(); onSelect(station); }}
            >
              Select
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AlternativeSlotsCard;
