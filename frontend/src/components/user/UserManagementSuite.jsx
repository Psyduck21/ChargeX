import React, { useState, useEffect, useRef } from 'react';
import { X, User, Car, Calendar, LogOut, ChevronRight, Zap, Mail, Phone, MapPin, Edit3, Lock } from 'lucide-react';
import VehiclesTab from './VehiclesTab';
import BookingsTab from './BookingsTab';
import toast from 'react-hot-toast';
import apiService from '../../services/api';
import Button from '../ui/Button';

export default function UserManagementSuite({
  isOpen,
  onClose,
  initialTab = 'profile',
  userProfile,
  setUserProfile,
  vehicles,
  setVehicles,
  bookings,
  userSessions,
  stations,
  darkMode,
  loadUserData,
  onLogout
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const overlayRef = useRef(null);

  // Profile forms
  const [profileForm, setProfileForm] = useState(userProfile);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

  useEffect(() => {
    setProfileForm(userProfile);
  }, [userProfile]);

  // Jump to the right tab whenever the overlay is (re-)opened with a specific initialTab
  useEffect(() => {
    if (isOpen) setActiveTab(initialTab);
  }, [isOpen, initialTab]);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileSubmitting(true);
    try {
      const res = await apiService.updateMyProfile(profileForm);
      setUserProfile(res || profileForm);
      toast.success('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile');
    } finally {
      setProfileSubmitting(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    setPasswordSubmitting(true);
    try {
      await apiService.changePassword({
        current_password: passwordForm.currentPassword,
        new_password: passwordForm.newPassword
      });
      toast.success('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error(err);
      toast.error('Failed to change password');
    } finally {
      setPasswordSubmitting(false);
    }
  };

  const inputClass = `w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all ${darkMode
    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
    : 'bg-white border-gray-200 text-gray-900'
    }`;

  const labelClass = `block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`;

  const renderProfileContent = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Personal Details */}
      <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
        <div className="flex items-center gap-2 mb-5">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${darkMode ? 'bg-emerald-900/50 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}`}>
            <Edit3 className="w-4 h-4" />
          </div>
          <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Personal Details</h3>
        </div>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label className={labelClass}>Full Name</label>
            <input
              type="text"
              value={profileForm.name || ''}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              className={inputClass}
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input
              type="tel"
              value={profileForm.phone || ''}
              onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
              className={inputClass}
              placeholder="+91 00000 00000"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>City</label>
              <input
                type="text"
                value={profileForm.city || ''}
                onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                className={inputClass}
                placeholder="City"
              />
            </div>
            <div>
              <label className={labelClass}>Zip Code</label>
              <input
                type="text"
                value={profileForm.zipCode || ''}
                onChange={(e) => setProfileForm({ ...profileForm, zipCode: e.target.value })}
                className={inputClass}
                placeholder="000000"
              />
            </div>
          </div>
          <Button
            type="submit"
            loading={profileSubmitting}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-semibold transition-all"
          >
            Save Changes
          </Button>
        </form>
      </div>

      {/* Security */}
      <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
        <div className="flex items-center gap-2 mb-5">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${darkMode ? 'bg-violet-900/50 text-violet-400' : 'bg-violet-100 text-violet-600'}`}>
            <Lock className="w-4 h-4" />
          </div>
          <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Security</h3>
        </div>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className={labelClass}>Current Password</label>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              required
              className={inputClass}
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className={labelClass}>New Password</label>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              required
              className={inputClass}
              placeholder="Min. 8 characters"
            />
          </div>
          <div>
            <label className={labelClass}>Confirm New Password</label>
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              required
              className={inputClass}
              placeholder="Repeat new password"
            />
          </div>
          <Button
            type="submit"
            loading={passwordSubmitting}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2.5 rounded-xl font-semibold transition-all"
          >
            Update Password
          </Button>
        </form>
      </div>
    </div>
  );

  const navItems = [
    { id: 'profile', label: 'My Profile', icon: User, accent: 'emerald' },
    { id: 'vehicles', label: 'My Vehicles', icon: Car, accent: 'blue' },
    { id: 'bookings', label: 'My Bookings', icon: Calendar, accent: 'violet' },
  ];

  const accentMap = {
    emerald: { active: 'bg-emerald-600', dot: 'bg-emerald-400' },
    blue: { active: 'bg-blue-600', dot: 'bg-blue-400' },
    violet: { active: 'bg-violet-600', dot: 'bg-violet-400' },
  };

  return (
    // Full-screen fixed overlay
    <div className="fixed inset-0 z-[60] flex" aria-modal="true" role="dialog">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Panel — full-screen, slides in from right */}
      <div
        ref={overlayRef}
        className={`relative w-full h-full flex flex-col md:flex-row shadow-2xl
          animate-in slide-in-from-right duration-300
          ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
      >
        {/* ── LEFT SIDEBAR ── */}
        <aside className={`w-full md:w-72 lg:w-80 flex flex-col shrink-0 border-r
          ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>

          {/* Hero / User Identity */}
          <div className={`relative p-8 pb-6 ${darkMode ? 'bg-gradient-to-b from-gray-800 to-gray-900' : 'bg-gradient-to-b from-emerald-50 to-white'}`}>
            {/* Close button */}
            <button
              onClick={onClose}
              className={`absolute top-5 right-5 p-2 rounded-full transition-colors
                ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
            >
              <X className="w-5 h-5" />
            </button>

            {/* ChargeX Brand */}
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className={`text-sm font-bold tracking-wide ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
                ChargeX
              </span>
            </div>

            {/* Avatar */}
            <div className="flex flex-col items-center text-center gap-3">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl ring-4 ring-emerald-500/20">
                  {(userProfile.name?.[0] || 'U').toUpperCase()}
                </div>
                <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {userProfile.name || 'User'}
                </h2>
                {userProfile.email && (
                  <p className={`text-sm mt-0.5 flex items-center justify-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <Mail className="w-3 h-3" />
                    {userProfile.email}
                  </p>
                )}
                {userProfile.phone && (
                  <p className={`text-xs mt-0.5 flex items-center justify-center gap-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    <Phone className="w-3 h-3" />
                    {userProfile.phone}
                  </p>
                )}
                {userProfile.city && (
                  <p className={`text-xs mt-0.5 flex items-center justify-center gap-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    <MapPin className="w-3 h-3" />
                    {userProfile.city}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
            {navItems.map(({ id, label, icon: Icon, accent }) => {
              const isActive = activeTab === id;
              const colors = accentMap[accent];
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl font-medium transition-all duration-200
                    ${isActive
                      ? `${colors.active} text-white shadow-lg shadow-${accent}-500/25`
                      : darkMode
                        ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 shrink-0" />
                    <span>{label}</span>
                  </div>
                  {isActive
                    ? <ChevronRight className="w-4 h-4 opacity-70" />
                    : <div className={`w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />
                  }
                </button>
              );
            })}
          </nav>

          {/* Sign Out */}
          <div className="p-4 border-t shrink-0" style={{ borderColor: darkMode ? '#1f2937' : '#f3f4f6' }}>
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* ── RIGHT CONTENT AREA ── */}
        <div className="flex-1 overflow-y-auto">
          {/* Content Header */}
          <div className={`sticky top-0 z-10 px-8 py-5 border-b flex items-center gap-4
            ${darkMode ? 'bg-gray-900/95 border-gray-800' : 'bg-gray-50/95 border-gray-200'} backdrop-blur-sm`}>
            {(() => {
              const current = navItems.find(n => n.id === activeTab);
              const Icon = current?.icon || User;
              const accentColors = {
                emerald: darkMode ? 'bg-emerald-900/40 text-emerald-400' : 'bg-emerald-100 text-emerald-600',
                blue: darkMode ? 'bg-blue-900/40 text-blue-400' : 'bg-blue-100 text-blue-600',
                violet: darkMode ? 'bg-violet-900/40 text-violet-400' : 'bg-violet-100 text-violet-600',
              };
              return (
                <>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accentColors[current?.accent]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {current?.label}
                    </h1>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {activeTab === 'profile' && 'Manage your personal information and security'}
                      {activeTab === 'vehicles' && 'Manage your registered electric vehicles'}
                      {activeTab === 'bookings' && 'View and manage your charging bookings'}
                    </p>
                  </div>
                </>
              );
            })()}
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'profile' && renderProfileContent()}

            {activeTab === 'vehicles' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <VehiclesTab
                  vehicles={vehicles}
                  setVehicles={setVehicles}
                  toast={toast}
                  darkMode={darkMode}
                />
              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <BookingsTab
                  bookings={bookings}
                  userSessions={userSessions}
                  stations={stations}
                  vehicles={vehicles}
                  setActiveTab={() => { }}
                  onBookingUpdate={loadUserData}
                  darkMode={darkMode}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
