const API_BASE_URL = import.meta.env.VITE_API_URL? import.meta.env.VITE_API_URL : 'http://localhost:8000';

class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    async apiCall(url, options = {}) {
        const {
            method = "GET",
            body = null,
      requiresAuth = true
        } = options;

        const headers = {
            "Content-Type": "application/json"
        };

        let token = null;
        // Add auth token if needed
        if (requiresAuth) {
            token = localStorage.getItem("access_token");
            if (!token) {
                // Redirect to login if no token
                window.location.href = "/login";
                return;
            }
            headers["Authorization"] = `Bearer ${token}`;
        }

    try {
      let res = await fetch(`${this.baseURL}${url}`, {
        method,
        headers,
        body,
      });

      // If access token expired → try refresh (only for requests requiring auth)
      if (!res.ok) {
                if (res.status === 401 && requiresAuth) {
                    // Try refresh token flow
                    try {
                        const newToken = await this.refreshToken();
                        if (newToken) {
                            // Retry original request with new token
                            headers["Authorization"] = `Bearer ${newToken}`;
                            const retry = await fetch(`${this.baseURL}${url}`, {
                                method,
                                headers,
                                body,
                            });
                            if (retry.ok) return await retry.json();
                        }
                    } catch (e) {
                        console.warn('Token refresh failed', e);
                    }

                    // If refresh failed or not available, clear and redirect
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("refresh_token");
                    localStorage.removeItem("user_role");
                    window.location.href = "/login";
                    return;
                }

                const error = await res.json().catch(() => ({}));
                throw new Error(error.detail || `Request failed: ${res.statusText}`);
            }

            return await res.json();
        } catch (error) {
            console.error("API Error:", error);
            throw error;
        }

  }

  // Try to refresh access token using refresh_token stored in localStorage
  async refreshToken() {
    const refresh_token = localStorage.getItem('refresh_token');
    if (!refresh_token) return null;

    try {
      const res = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token }),
      });

      if (!res.ok) return null;
      const data = await res.json();
      if (data && data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        if (data.refresh_token) localStorage.setItem('refresh_token', data.refresh_token);
        if (data.user && data.user.role) localStorage.setItem('user_role', data.user.role);
        return data.access_token;
      }
      return null;
    } catch (e) {
      console.warn('refreshToken failed', e);
      return null;
    }
  }
  // Authentication APIs
  async login(email, password) {
        try {
            const response = await this.apiCall('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ 
                    email: email.trim(),
                    password: password 
                }),
                requiresAuth: false
            });

            if (!response || !response.access_token) {
                throw new Error('Invalid login response');
            }

      // store tokens so subsequent calls can use them
      localStorage.setItem('access_token', response.access_token);
      if (response.refresh_token) localStorage.setItem('refresh_token', response.refresh_token);

      // Try to fetch normalized current user (role, station_ids, etc.) from /auth/me
      let normalizedUser = null;
      try {
        // this.getCurrentUser will call apiCall and include the just-stored token
        normalizedUser = await this.getCurrentUser();
      } catch (err) {
        // If fetching /auth/me fails, fall back to user in login response
        console.warn('Failed to fetch normalized user after login:', err);
      }

      const role = (normalizedUser && normalizedUser.role) || (response.user && response.user.role) || 'app_user';
      localStorage.setItem('user_role', role);

      // Return merged response so callers can get normalized user as well
      return Object.assign({}, response, { user: normalizedUser || response.user });
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

  async signup(userData) {
    return this.apiCall('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
      requiresAuth: false,
    });
  }

  async logout() {
        try {
            await this.apiCall('/auth/logout', { method: 'POST' });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('access_token');
            localStorage.removeItem('user_role');
            window.location.href = "/login";
        }
    }

  async getCurrentUser() {
        return await this.apiCall('/auth/me');
  }

  // Station Management APIs
  async getStations() {
    return this.apiCall('/stations/');
  }

  async createStation(stationData) {
    return this.apiCall('/stations/', {
      method: 'POST',
      body: JSON.stringify(stationData),
    });
  }

  async updateStation(stationId, updateData) {
    return this.apiCall(`/stations/${stationId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async deleteStation(stationId) {
    return this.apiCall(`/stations/${stationId}`, {
      method: 'DELETE',
    });
  }

  async getStationManagers(stationId) {
    return this.apiCall(`/stations/${stationId}/managers`);
  }

  async assignManagerToStation(stationId, userId) {
    return this.apiCall(`/stations/${stationId}/assign_manager`, {
      method: 'POST',
      body: JSON.stringify({ user_id: userId }),
    });
  }

  // Admin Dashboard APIs
  async getAdminStatistics() {
    return this.apiCall('/admin/statistics');
  }

  async getStationsWithManagers() {
    return this.apiCall('/admin/stations-with-managers');
  }

  async getAllUsers() {
    return this.apiCall('/admin/users');
  }

  async getAllManagers() {
    return this.apiCall('/station_managers/admin/all-with-stations');
  }

  // Station Manager APIs
  async getManagerStations() {
    return this.apiCall('/station_managers/my-stations');
  }

  async getManagerBookings() {
    return this.apiCall('/station_managers/my-bookings');
  }

  async getManagerSessions() {
    return this.apiCall('/station_managers/my-sessions');
  }

  // Booking APIs
  async getBookings() {
    return this.apiCall('/bookings/');
  }

  async getUserBookings() {
    return this.apiCall('/bookings/');
  }

  async createBooking(bookingData) {
    return this.apiCall('/bookings/', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async updateBooking(bookingId, updateData) {
    return this.apiCall(`/bookings/${bookingId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async cancelBooking(bookingId) {
    return this.apiCall(`/bookings/${bookingId}/cancel`, {
      method: 'POST',
    });
  }

  // Charging Session APIs
  async getChargingSessions() {
    return this.apiCall('/charging_sessions/');
  }

  async createChargingSession(sessionData) {
    return this.apiCall('/charging_sessions/', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  }

  async updateChargingSession(sessionId, updateData) {
    return this.apiCall(`/charging_sessions/${sessionId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async endChargingSession(sessionId) {
    return this.apiCall(`/charging_sessions/${sessionId}/end`, {
      method: 'POST',
    });
  }

  async getConsumptionAnalytics(startDate, endDate) {
    return this.apiCall(`/charging_sessions/analytics/consumption?start=${startDate}&end=${endDate}`);
  }

  // Analytics APIs for Dashboard Charts
  async getUserGrowthAnalytics(days = 30) {
    return this.apiCall(`/analytics/user-growth?days=${days}`);
  }

  async getEnergyConsumptionAnalytics(days = 30) {
    return this.apiCall(`/analytics/energy-consumption?days=${days}`);
  }

  async getRevenueAnalytics(days = 30) {
    return this.apiCall(`/analytics/revenue?days=${days}`);
  }

  async getBookingsAnalytics(days = 30) {
    return this.apiCall(`/analytics/bookings?days=${days}`);
  }

  async getStationUtilizationAnalytics() {
    return this.apiCall('/analytics/station-utilization');
  }

  async getChargingTypeAnalytics(days = 30) {
    return this.apiCall(`/analytics/charging-types?days=${days}`);
  }

  async getPeakHoursAnalytics(hours = 24) {
    return this.apiCall(`/analytics/peak-hours?hours=${hours}`);
  }

  async getActiveSessionsCount() {
    return this.apiCall('/analytics/active-sessions');
  }

  async getAverageSessionDuration() {
    return this.apiCall('/analytics/avg-session-duration');
  }

  async getCO2Saved() {
    return this.apiCall('/analytics/co2-saved');
  }

  async getUserStatistics() {
    return this.apiCall('/analytics/user-statistics');
  }

  async getRecentActivity(limit = 10) {
    return this.apiCall(`/analytics/recent-activity?limit=${limit}`);
  }

  // User Profile APIs
  async getMyProfile() {
    return this.apiCall('/profiles/me');
  }

  async getProfile() {
    return this.apiCall('/profiles/');
  }

  async updateMyProfile(profileData) {
    return this.apiCall('/profiles/me', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async changePassword(passwordData) {
    return this.apiCall('/profiles/me/change-password', {
      method: 'POST',
      body: JSON.stringify(passwordData),
    });
  }

  async updateProfile(profileData) {
    return this.apiCall('/profiles/', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Admin: update any user profile by ID
  async updateUserProfile(profileId, updateData) {
    return this.apiCall(`/profiles/${profileId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  // Vehicle APIs
  async getVehicles() {
    return this.apiCall('/vehicles/');
  }

  async createVehicle(vehicleData) {
    return this.apiCall('/vehicles/', {
      method: 'POST',
      body: JSON.stringify(vehicleData),
    });
  }

  async updateVehicle(vehicleId, updateData) {
    return this.apiCall(`/vehicles/${vehicleId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async deleteVehicle(vehicleId) {
    return this.apiCall(`/vehicles/${vehicleId}`, {
      method: 'DELETE',
    });
  }

  // Slot APIs
  async getSlots(stationId) {
    return this.apiCall(`/slots/?station_id=${stationId}`);
  }

  async createSlot(slotData) {
    return this.apiCall('/slots/', {
      method: 'POST',
      body: JSON.stringify(slotData),
    });
  }

  async updateSlot(slotId, updateData) {
    return this.apiCall(`/slots/${slotId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async deleteSlot(slotId) {
    return this.apiCall(`/slots/${slotId}`, {
      method: 'DELETE',
    });
  }

  // Station Manager Management APIs
  async createStationManager(managerData) {
    return this.apiCall('/station_managers/', {
      method: 'POST',
      body: JSON.stringify(managerData),
    });
  }

  async updateStationManager(managerId, updateData) {
    return this.apiCall(`/station_managers/${managerId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async deleteStationManager(managerId) {
    return this.apiCall(`/station_managers/${managerId}`, {
      method: 'DELETE',
    });
  }

  // Feedback APIs
  async getFeedback() {
    return this.apiCall('/feedback/');
  }

  async createFeedback(feedbackData) {
    return this.apiCall('/feedback/', {
      method: 'POST',
      body: JSON.stringify(feedbackData),
    });
  }

  async updateFeedback(feedbackId, updateData) {
    return this.apiCall(`/feedback/${feedbackId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async deleteFeedback(feedbackId) {
    return this.apiCall(`/feedback/${feedbackId}`, {
      method: 'DELETE',
    });
  }

  async getManagersWithStations() {
    return this.apiCall('/station_managers/admin/all-with-stations', { method: 'GET' });
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
