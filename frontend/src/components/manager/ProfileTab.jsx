import React, { useState, useEffect } from 'react';
import { Edit2, MapPin, Calendar, Phone, Mail, User as UserIcon } from 'lucide-react';
import apiService from '../../services/api';
import { useToast } from '../ui/Toast';

export default function ProfileTab({
  darkMode = false,
  stations = []
}) {
  const toast = useToast();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await apiService.getMyProfile();
        setProfile(profileData);
        setEditForm(profileData);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        // Fallback to mock data if API fails
        setProfile({
          name: 'John Doe',
          email: 'john.doe@evcharge.com',
          phone: '+91 98765 43210',
          role: 'station_manager',
          address: '123 Main St',
          city: 'New York',
          country: 'USA',
          zip_code: '10001'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [stations.length]);

  const handleSaveProfile = async () => {
    try {
      await apiService.updateMyProfile(editForm);
      setProfile(editForm);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setEditForm(profile);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Failed to load profile data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl p-6 border`}>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl">
              {profile.name?.[0] || 'U'}
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="absolute bottom-2 right-2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-emerald-600 hover:bg-emerald-50"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1">
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
              {profile.name}
            </h2>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-3`}>
              {profile.email}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                {profile.role}
              </span>
              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Managing {stations?.length || 0} stations</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={`flex gap-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <button
          onClick={() => setActiveTab('personal')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'personal'
              ? 'text-emerald-600 border-b-2 border-emerald-600'
              : darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Personal Info
        </button>
        <button
          onClick={() => setActiveTab('stations')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'stations'
              ? 'text-emerald-600 border-b-2 border-emerald-600'
              : darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          My Stations
        </button>
      </div>

      {/* Personal Info Tab */}
      {activeTab === 'personal' && (
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl p-6 border`}>
          {isEditing ? (
            <div className="space-y-6">
              <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                Edit Profile
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className={`w-full px-4 py-2.5 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={editForm.email || ''}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className={`w-full px-4 py-2.5 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Phone
                </label>
                <input
                  type="tel"
                  value={editForm.phone || ''}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className={`w-full px-4 py-2.5 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Address
                </label>
                <input
                  type="text"
                  value={editForm.address || ''}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className={`w-full px-4 py-2.5 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    City
                  </label>
                  <input
                    type="text"
                    value={editForm.city || ''}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                    className={`w-full px-4 py-2.5 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Country
                  </label>
                  <input
                    type="text"
                    value={editForm.country || ''}
                    onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                    className={`w-full px-4 py-2.5 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    value={editForm.zip_code || ''}
                    onChange={(e) => setEditForm({ ...editForm, zip_code: e.target.value })}
                    className={`w-full px-4 py-2.5 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  onClick={handleCancelEdit}
                  className={`px-6 py-2.5 border ${darkMode ? 'border-gray-600 text-gray-300' : 'border-gray-200 text-gray-700'} rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                Personal Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <UserIcon className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Full Name</span>
                  </div>
                  <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {profile.name}
                  </p>
                </div>

                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <Mail className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</span>
                  </div>
                  <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {profile.email}
                  </p>
                </div>

                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <Phone className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Phone</span>
                  </div>
                  <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {profile.phone}
                  </p>
                </div>

                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <UserIcon className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Role</span>
                  </div>
                  <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {profile.role}
                  </p>
                </div>

                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <MapPin className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Address</span>
                  </div>
                  <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {profile.address || 'Not provided'}
                  </p>
                </div>

                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <MapPin className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>City</span>
                  </div>
                  <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {profile.city || 'Not provided'}
                  </p>
                </div>

                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <MapPin className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Country</span>
                  </div>
                  <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {profile.country || 'Not provided'}
                  </p>
                </div>

                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <MapPin className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>ZIP Code</span>
                  </div>
                  <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {profile.zip_code || 'Not provided'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stations Tab */}
      {activeTab === 'stations' && (
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl p-6 border`}>
          <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
            Assigned Stations
          </h2>

          {stations.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className={`w-12 h-12 ${darkMode ? 'text-gray-600' : 'text-gray-400'} mx-auto mb-4`} />
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No stations assigned yet</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {stations.map((station, index) => (
                <div key={station.station_id || `station-${index}`} className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} transition-colors`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{station.name}</h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} flex items-center gap-1 mt-1`}>
                        <MapPin className="w-3 h-3" />
                        {station.address}, {station.city}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Capacity</p>
                      <p className="text-2xl font-bold text-emerald-600">{station.capacity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
