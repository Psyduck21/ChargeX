import React, { useState, useEffect } from 'react';

export default function LocationSearch({ onLocationSelect }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchLocations = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5&countrycodes=in&addressdetails=1&extratags=1`
      );
      const data = await response.json();

      const formattedSuggestions = data.map(item => ({
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        label: item.display_name,
        type: item.type,
        address: {
          city: item.address?.city || item.address?.town || item.address?.village || '',
          state: item.address?.state || '',
          country: item.address?.country || '',
          postcode: item.address?.postcode || '',
          formatted: item.display_name || ''
        }
      }));

      setSuggestions(formattedSuggestions);
    } catch (error) {
      console.error('Location search error:', error);
      setSuggestions([]);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchLocations(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSuggestionClick = (suggestion) => {
    onLocationSelect({
      lat: suggestion.lat,
      lng: suggestion.lng,
      address: suggestion.address.formatted,
      city: suggestion.address.city,
      state: suggestion.address.state,
      country: suggestion.address.country,
      postcode: suggestion.address.postcode
    });
    setQuery(suggestion.label);
    setShowSuggestions(false);
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search for a location (e.g., Delhi, Mumbai)..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => {
          // Delay hiding suggestions to allow clicks
          setTimeout(() => setShowSuggestions(false), 200);
        }}
        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-xl mt-1 shadow-lg max-h-48 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <div className="font-medium text-gray-900 text-sm">{suggestion.label}</div>
              <div className="text-xs text-gray-500 mt-1">
                {suggestion.address.city && `${suggestion.address.city}, `}
                {suggestion.address.state && `${suggestion.address.state}, `}
                {suggestion.address.country}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
