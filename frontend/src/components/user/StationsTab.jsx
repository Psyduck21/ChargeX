import React, { useState, useEffect } from 'react';
import { MapPin, Search, Filter, Navigation, Star, Clock, Battery, DollarSign, Calendar, ChevronRight, Heart, User, Bell, Settings, LogOut, Menu, X, Bookmark, History, CreditCard, Phone, Mail, AlertCircle, Car, Plus, Edit2, Trash2, BarChart3, TrendingUp, Leaf, ChevronDown, Zap } from 'lucide-react';
import StationCard from './StationCard';
import apiService from '../../services/api';

function StationsTab({
  stations,
  filteredStations,
  searchQuery,
  setSearchQuery,
  filters,
  setFilters,
  sortBy,
  setSortBy,
  userProfile,
  vehicles,
  onBookStation,
  onGetDirections,
  locationPermission,
  requestLocationPermission,
  darkMode = false
}) {
  const [showFilters, setShowFilters] = useState(false);
  const [userStats, setUserStats] = useState({
    totalBookings: 0,
    totalEnergy: 0,
    totalSpent: 0,
    co2Saved: '0 kg'
  });

  // Fetch user statistics on component mount
  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const stats = await apiService.getUserStatistics();
        if (stats) {
          setUserStats({
            totalBookings: stats.totalBookings || 0,
            totalEnergy: stats.totalEnergy || 0,
            totalSpent: stats.totalSpent || 0,
            co2Saved: stats.co2Saved || '0 kg'
          });
        }
      } catch (error) {
        console.error('Error fetching user statistics:', error);
        // Keep default values if fetch fails
      }
    };

    fetchUserStats();
  }, []);

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

  return (
    <>
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-8 h-8" />
            <span className="text-white/80 text-sm">Total Bookings</span>
          </div>
          <div className="text-3xl font-bold mb-1">{userProfile.totalBookings || 0}</div>
          <div className="text-white/80 text-sm">Lifetime bookings</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-4">
            <Zap className="w-8 h-8" />
            <span className="text-white/80 text-sm">Energy Used</span>
          </div>
          <div className="text-3xl font-bold mb-1">{userStats.totalEnergy} kWh</div>
          <div className="text-white/80 text-sm">Total energy consumed</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8" />
            <span className="text-white/80 text-sm">Total Spent</span>
          </div>
          <div className="text-3xl font-bold mb-1">₹{userStats.totalSpent}</div>
          <div className="text-white/80 text-sm">On charging</div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-4">
            <Leaf className="w-8 h-8" />
            <span className="text-white/80 text-sm">CO₂ Saved</span>
          </div>
          <div className="text-3xl font-bold mb-1">{userStats.co2Saved}</div>
          <div className="text-white/80 text-sm">Environmental impact</div>
        </div>
      </div>

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Find Charging Stations</h1>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Discover nearby EV charging stations and book your slot</p>
          </div>
          <div className="flex items-center gap-3">
            {locationPermission === 'granted' && (
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
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-4 shadow-lg mb-8`}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or location..."
              className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200'}`}
            />
          </div>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200'}`}
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
          <div className={`flex flex-wrap gap-2 mt-4 pt-4 border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Active filters:</span>
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
        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
          Found <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{filteredStations.length}</span> stations near you
        </p>
      </div>

      {/* Stations Grid */}
      {filteredStations.length === 0 ? (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-12 text-center`}>
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <AlertCircle className={`w-10 h-10 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          </div>
          <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>No stations found</h3>
          <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Try adjusting your filters or search query</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStations.map((station) => (
            <StationCard
              key={station.id}
              station={station}
              userProfile={userProfile}
              vehicles={vehicles}
              onBook={(s) => onBookStation(s)}
              onGetDirections={onGetDirections}
            />
          ))}
        </div>
      )}

      <FilterPanel />
    </>
  );
}

export default StationsTab;
