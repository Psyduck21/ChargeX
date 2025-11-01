import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import apiService from '../services/api';
import AdminOperations from './AdminOperations';
import ManagerOperations from './ManagerOperations';
import UserOperations from './UserOperations';

const OperationsApp = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('operations');

  // Load user data on component mount
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await apiService.getCurrentUser();
      setUser(userData);
    } catch (err) {
      setError(`Failed to load user data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token');
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-xl">Error: {error}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Not Authenticated</h1>
          <p className="text-gray-600 mb-4">Please log in to access operations.</p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const renderOperations = () => {
    switch (user.role) {
      case 'admin':
        return <AdminOperations />;
      case 'station_manager':
        return <ManagerOperations />;
      case 'app_user':
        return <UserOperations />;
      default:
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Unauthorized</h1>
            <p className="text-gray-600">You don't have permission to access operations.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-950">
      {/* Modern Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative overflow-hidden border-b border-white/20 dark:border-slate-700/50"
      >
        {/* Background decorations */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 flex justify-between items-center py-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                ChargeX Operations
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                Welcome, {user.role === 'admin' ? 'Administrator' :
                          user.role === 'station_manager' ? 'Station Manager' : 'User'}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center space-x-6"
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-white/20 dark:border-slate-600/30">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {user.role.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <motion.button
                onClick={handleLogout}
                className="px-6 py-3 border-0 rounded-2xl bg-gradient-to-r from-danger-500 to-red-600 hover:from-danger-600 hover:to-red-700 text-white font-semibold shadow-xl hover:shadow-2xl backdrop-blur-sm flex items-center gap-2 transition-all duration-300 transform hover:-translate-y-0.5"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Glass-morphism gradient line */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />
      </motion.div>

      {/* Modern Navigation Tabs */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
      >
        <div className="flex flex-wrap gap-2 p-1 bg-secondary/20 dark:bg-dark-surface/50 rounded-2xl backdrop-blur-glass">
          {[
            { id: "operations", name: "Operations", icon: "⚡" },
            { id: "profile", name: "Profile", icon: "👤" },
            { id: "help", name: "Help", icon: "ℹ️" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  relative flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-200
                  ${isActive
                    ? 'text-white bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 shadow-2xl shadow-blue-500/25 border-2 border-white/20'
                    : 'text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-purple-50/80 dark:hover:from-blue-900/80 dark:hover:to-purple-900/80 hover:shadow-xl hover:shadow-blue-200/30 dark:hover:shadow-purple-900/30'
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-lg">{tab.icon}</span>
                {tab.name}
                {isActive && (
                  <motion.div
                    layoutId="activeTabOps"
                    className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-accent-500/10 rounded-xl border border-primary-500/20"
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {activeTab === 'operations' && renderOperations()}
        
        <AnimatePresence mode="wait">
          {activeTab === 'operations' && (
            <motion.div
              key="operations"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {renderOperations()}
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <motion.div
                className="relative overflow-hidden border border-white/20 dark:border-slate-700/30 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl shadow-xl shadow-slate-200/20 dark:shadow-slate-900/20 rounded-3xl p-8"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                {/* Background decorations */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-blue-400/5 to-purple-500/5 rounded-full blur-2xl" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-cyan-400/5 to-blue-500/5 rounded-full blur-2xl" />

                <motion.h2
                  className="text-2xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-8 flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.div
                    className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg"
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.05 }}
                    transition={{ duration: 0.6 }}
                  >
                    <span className="text-2xl">👤</span>
                  </motion.div>
                  User Profile
                </motion.h2>

                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200/30 dark:border-blue-700/30">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-2xl text-white font-bold">{(user.role === 'admin' ? 'A' : user.role === 'station_manager' ? 'M' : 'U').charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Profile Information</h3>
                      <p className="text-slate-600 dark:text-slate-400">Your account details and permissions</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-50/80 to-slate-100/80 dark:from-slate-700/50 dark:to-slate-600/50 border border-slate-200/30 dark:border-slate-600/30">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">User ID</label>
                      <p className="text-lg font-black text-slate-900 dark:text-white">{user.id}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-50/80 to-slate-100/80 dark:from-slate-700/50 dark:to-slate-600/50 border border-slate-200/30 dark:border-slate-600/30">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Role</label>
                      <p className="text-lg font-black text-slate-900 dark:text-white capitalize">{user.role.replace('_', ' ')}</p>
                    </div>
                    {user.station_ids && user.station_ids.length > 0 && (
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-50/80 to-slate-100/80 dark:from-slate-700/50 dark:to-slate-600/50 border border-slate-200/30 dark:border-slate-600/30">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Assigned Stations</label>
                        <div className="flex flex-wrap gap-2">
                          {user.station_ids.map((stationId, index) => (
                            <span key={index} className="px-3 py-1 bg-primary-500/20 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium">
                              Station {stationId}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Animated border gradient */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 opacity-0 hover:opacity-20 transition-opacity duration-300 p-[1px]">
                  <div className="w-full h-full rounded-3xl bg-gradient-to-br from-white/90 via-white/70 to-slate-50/80 dark:from-slate-800/90 dark:via-slate-800/70 dark:to-slate-900/80" />
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'help' && (
            <motion.div
              key="help"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <motion.div
                className="relative overflow-hidden border border-white/20 dark:border-slate-700/30 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl shadow-xl shadow-slate-200/20 dark:shadow-slate-900/20 rounded-3xl p-8"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                {/* Background decorations */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-purple-400/5 to-pink-500/5 rounded-full blur-2xl" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-cyan-400/5 to-blue-500/5 rounded-full blur-2xl" />

                <motion.h2
                  className="text-2xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent mb-8 flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.div
                    className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg"
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.05 }}
                    transition={{ duration: 0.6 }}
                  >
                    <span className="text-2xl">📚</span>
                  </motion.div>
                  Help & Documentation
                </motion.h2>

                <div className="relative z-10 space-y-8">
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-50/80 to-teal-50/80 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200/30 dark:border-emerald-700/30">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                      <span className="text-green-600">⚡</span>
                      Available Operations
                    </h3>
                    {user.role === 'admin' && (
                      <ul className="space-y-2">
                        {[
                          "Manage charging stations (create, update, delete)",
                          "Manage station managers (assign, create, update)",
                          "View system statistics and analytics",
                          "Manage all users and bookings",
                          "Access consumption analytics"
                        ].map((item, index) => (
                          <li key={index} className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                            <span className="text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {user.role === 'station_manager' && (
                      <ul className="space-y-2">
                        {[
                          "Manage assigned charging stations",
                          "Create and manage charging slots",
                          "View and manage bookings for your stations",
                          "Create and monitor charging sessions",
                          "View feedback for your stations"
                        ].map((item, index) => (
                          <li key={index} className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                            <span className="text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {user.role === 'app_user' && (
                      <ul className="space-y-2">
                        {[
                          "Manage your profile information",
                          "Add and manage your vehicles",
                          "Create and manage charging bookings",
                          "View your charging session history",
                          "Submit feedback for stations"
                        ].map((item, index) => (
                          <li key={index} className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                            <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
                            <span className="text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200/30 dark:border-blue-700/30">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">API Endpoints</h3>
                      <div className="space-y-2">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Base URL: <code className="bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded text-xs font-mono">http://localhost:8000</code>
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Documentation: <code className="bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded text-xs font-mono">http://localhost:8000/docs</code>
                        </p>
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-50/80 to-orange-50/80 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200/30 dark:border-amber-700/30">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Authentication</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        All API calls require a Bearer token in the Authorization header. The token is automatically included in all requests.
                      </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-50/80 to-pink-50/80 dark:from-rose-900/20 dark:to-pink-900/20 border border-rose-200/30 dark:border-rose-700/30">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Error Handling</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        All operations include comprehensive error handling. Check status messages at the top of each section for feedback.
                      </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-50/80 to-teal-50/80 dark:from-cyan-900/20 dark:to-teal-900/20 border border-cyan-200/30 dark:border-cyan-700/30">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Support</h3>
                      <div className="space-y-2">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Need help? Check our comprehensive documentation or contact our support team.
                        </p>
                        <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white text-sm font-medium rounded-xl transition-all duration-200 transform hover:scale-105">
                          Contact Support
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Animated border gradient */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 opacity-0 hover:opacity-20 transition-opacity duration-300 p-[1px]">
                  <div className="w-full h-full rounded-3xl bg-gradient-to-br from-white/90 via-white/70 to-slate-50/80 dark:from-slate-800/90 dark:via-slate-800/70 dark:to-slate-900/80" />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OperationsApp;
