import React, { useState, useEffect } from 'react';
import { Edit2 } from 'lucide-react';

export default function ManagerProfileModal({
  showProfileModal,
  managerProfile,
  setShowProfileModal,
  setManagerProfile,
  darkMode = false
}) {
  const [profileForm, setProfileForm] = useState(managerProfile);
  const [activeProfileTab, setActiveProfileTab] = useState('personal');

  useEffect(() => {
    setProfileForm(managerProfile);
  }, [managerProfile]);

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setManagerProfile(profileForm);
    alert('Profile updated successfully!');
    setShowProfileModal(false);
  };

  if (!showProfileModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto`}>
        <div className="relative">
          <div className="h-32 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-t-2xl"></div>
          <div className="px-4 md:px-8 pb-6">
            <div className="relative -mt-16 mb-6">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                {managerProfile.full_name[0]}
              </div>
              <button className="absolute bottom-2 right-2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-emerald-600 hover:bg-emerald-50">
                <Edit2 className="w-4 h-4" />
              </button>
            </div>

            <div className="mb-6">
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{managerProfile.full_name}</h2>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{managerProfile.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                  {managerProfile.role}
                </span>
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Managing {managerProfile.stations_managed} stations</span>
              </div>
            </div>

            <div className={`flex gap-2 mb-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <button
                onClick={() => setActiveProfileTab('personal')}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeProfileTab === 'personal'
                    ? 'text-emerald-600 border-b-2 border-emerald-600'
                    : darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Personal Info
              </button>
              <button
                onClick={() => setActiveProfileTab('stations')}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeProfileTab === 'stations'
                    ? 'text-emerald-600 border-b-2 border-emerald-600'
                    : darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                My Stations
              </button>
            </div>

            {activeProfileTab === 'personal' && (
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Full Name</label>
                    <input
                      type="text"
                      value={profileForm.full_name}
                      onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                      className={`w-full px-4 py-2.5 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Email</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className={`w-full px-4 py-2.5 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Phone</label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className={`w-full px-4 py-2.5 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowProfileModal(false)}
                    className={`px-6 py-2.5 border ${darkMode ? 'border-gray-600 text-gray-300' : 'border-gray-200 text-gray-700'} rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}

            {activeProfileTab === 'stations' && (
              <div className="space-y-4">
                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Assigned Stations</h3>
                <div className="grid gap-4">
                  {/* This would be populated with actual station data */}
                  <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-4`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Downtown Charging Hub</h4>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>123 Main St, New York</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Slots</p>
                        <p className="text-2xl font-bold text-emerald-600">10</p>
                      </div>
                    </div>
                  </div>
                  <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-4`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Airport Station</h4>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>456 Airport Rd, New York</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Slots</p>
                        <p className="text-2xl font-bold text-emerald-600">15</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowProfileModal(false)}
                    className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
