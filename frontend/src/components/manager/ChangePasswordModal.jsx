import React, { useState } from 'react';
import { useToast } from '../ui/Toast';
import apiService from '../../services/api';

export default function ChangePasswordModal({ isOpen, onClose, darkMode = false, onLogout }) {
  const toast = useToast();
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.current_password || !formData.new_password || !formData.confirm_password) {
      setError('All fields are required');
      return;
    }

    if (formData.new_password !== formData.confirm_password) {
      setError('New passwords do not match');
      return;
    }

    if (formData.new_password.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await apiService.changePassword({
        current_password: formData.current_password,
        new_password: formData.new_password
      });

      // Success - close modal and reset form
      setFormData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
      onClose();

      // Show success message and logout
      toast.success('Password changed successfully! You will be logged out for security.');

      // Logout user after password change for security
      if (onLogout) {
        setTimeout(() => {
          onLogout();
        }, 1000); // Small delay to show the alert
      }

    } catch (error) {
      console.error('Password change error:', error);
      setError(error.message || 'Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl max-w-md w-full p-6`}>
        <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
          Change Password
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Current Password
            </label>
            <input
              type="password"
              name="current_password"
              value={formData.current_password}
              onChange={handleInputChange}
              className={`w-full px-4 py-2.5 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500`}
              placeholder="Enter your current password"
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              New Password
            </label>
            <input
              type="password"
              name="new_password"
              value={formData.new_password}
              onChange={handleInputChange}
              className={`w-full px-4 py-2.5 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500`}
              placeholder="Enter your new password"
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleInputChange}
              className={`w-full px-4 py-2.5 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500`}
              placeholder="Confirm your new password"
              required
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex items-center gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  current_password: '',
                  new_password: '',
                  confirm_password: ''
                });
                setError('');
                onClose();
              }}
              className={`flex-1 px-4 py-2.5 border ${darkMode ? 'border-gray-600 text-gray-300' : 'border-gray-200 text-gray-700'} rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700`}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                </div>
              ) : (
                'Change Password'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
