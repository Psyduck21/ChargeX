import React from 'react';
import { BarChart3, Users, MapPin, Download, Zap, LogOut, User, Settings } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, adminProfile, onLogout, onProfileClick }) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold text-gray-900">ChargeX</span>
      </div>

      <nav className="space-y-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
            activeTab === 'overview'
              ? 'bg-emerald-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          Overview
        </button>

        <button
          onClick={() => setActiveTab('stations')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
            activeTab === 'stations'
              ? 'bg-emerald-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <MapPin className="w-5 h-5" />
          Stations
        </button>

        <button
          onClick={() => setActiveTab('managers')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
            activeTab === 'managers'
              ? 'bg-emerald-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Users className="w-5 h-5" />
          Managers
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
            activeTab === 'users'
              ? 'bg-emerald-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Users className="w-5 h-5" />
          Users
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
            activeTab === 'reports'
              ? 'bg-emerald-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Download className="w-5 h-5" />
          Reports
        </button>
      </nav>

      <div className="absolute bottom-6 left-6 right-6 space-y-2">
        <button
          onClick={onProfileClick}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <Settings className="w-5 h-5" />
          Profile
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <User className="w-5 h-5" />
          <div className="flex-1 text-left">{adminProfile.name}</div>
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
}
