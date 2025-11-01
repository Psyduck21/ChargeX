import React from 'react';
import { BarChart3, Calendar, MapPin, Zap, Users, User, EvCharger } from 'lucide-react';

export default function ManagerSidebar({
  activeTab,
  onTabChange,
  onToggle,
  isOpen,
  stations,
  darkMode = false
}) {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'slots', label: 'Slots', icon: EvCharger },
    { id: 'stations', label: 'My Stations', icon: MapPin },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const activeBookings = stations.reduce((sum, s) => sum + (Number(s.occupied_slots) || 0), 0);

  return (
    <aside className={`fixed left-0 top-0 h-screen w-64 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r p-6 transition-transform duration-300 z-40 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    } lg:translate-x-0`}>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>ChargeX</span>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                onToggle && onToggle();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                activeTab === item.id
                  ? 'bg-emerald-600 text-white'
                  : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="absolute bottom-6 left-6 right-6">
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl p-4 text-white mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5" />
            <p className="text-sm font-medium">Active Users</p>
          </div>
          <p className="text-2xl font-bold mb-1">{activeBookings}</p>
          <p className="text-xs text-emerald-100">Charging now</p>
        </div>
      </div>
    </aside>
  );
}
