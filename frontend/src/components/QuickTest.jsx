import React, { useState } from 'react';
import apiService from '../services/api';

const QuickTest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [results, setResults] = useState({});

  const runTest = async (testName, testFunction) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await testFunction();
      setResults(prev => ({ ...prev, [testName]: result }));
      setSuccess(`${testName} completed successfully!`);
    } catch (err) {
      setError(`${testName} failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const tests = {
    'Get Current User': () => apiService.getCurrentUser(),
    'Get All Stations': () => apiService.getStations(),
    'Get Admin Statistics': () => apiService.getAdminStatistics(),
    'Get User Bookings': () => apiService.getBookings(),
    'Get Charging Sessions': () => apiService.getChargingSessions(),
    'Get User Profile': () => apiService.getProfile(),
    'Get User Vehicles': () => apiService.getVehicles(),
    'Get Feedback': () => apiService.getFeedback(),
  };

  const adminTests = {
    'Get All Users': () => apiService.getAllUsers(),
    'Get All Managers': () => apiService.getAllManagers(),
    'Get Stations with Managers': () => apiService.getStationsWithManagers(),
  };

  const managerTests = {
    'Get Manager Stations': () => apiService.getManagerStations(),
    'Get Manager Bookings': () => apiService.getManagerBookings(),
    'Get Manager Sessions': () => apiService.getManagerSessions(),
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Quick API Test</h1>

      {/* Status Messages */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {/* Basic Tests */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Basic API Tests</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(tests).map(([name, test]) => (
            <button
              key={name}
              onClick={() => runTest(name, test)}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Admin Tests */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Admin API Tests</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(adminTests).map(([name, test]) => (
            <button
              key={name}
              onClick={() => runTest(name, test)}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 text-sm"
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Manager Tests */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Manager API Tests</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(managerTests).map(([name, test]) => (
            <button
              key={name}
              onClick={() => runTest(name, test)}
              disabled={loading}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50 text-sm"
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {Object.keys(results).length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          <div className="space-y-4">
            {Object.entries(results).map(([testName, result]) => (
              <div key={testName} className="border rounded p-4">
                <h3 className="font-medium mb-2">{testName}</h3>
                <pre className="text-sm bg-gray-100 p-3 rounded overflow-auto max-h-40">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickTest;
