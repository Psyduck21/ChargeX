import React from 'react';
import { History, Calendar, Clock, Zap, Car, DollarSign, Battery, Leaf, MapPin } from 'lucide-react';

function HistoryTab({ bookingHistory, setActiveTab }) {
  return (
    <>
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Charging History</h1>
            <p className="text-gray-600">View your past charging sessions and usage statistics</p>
          </div>
          <div className="flex gap-2">
            <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="all">All Time</option>
              <option value="month">This Month</option>
              <option value="week">This Week</option>
              <option value="today">Today</option>
            </select>
          </div>
        </div>
      </header>

      {/* History Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Sessions</p>
              <p className="text-2xl font-bold text-gray-900">{bookingHistory.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Battery className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Energy Used</p>
              <p className="text-2xl font-bold text-gray-900">
                {bookingHistory.reduce((sum, session) => sum + (session.energy_used || 0), 0).toFixed(1)} kWh
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Cost</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{bookingHistory.reduce((sum, session) => sum + (session.cost || 0), 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">CO₂ Saved</p>
              <p className="text-2xl font-bold text-gray-900">
                {(bookingHistory.reduce((sum, session) => sum + (session.energy_used || 0), 0) * 0.4).toFixed(1)} kg
              </p>
            </div>
          </div>
        </div>
      </div>

      {bookingHistory.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <History className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No charging history</h3>
          <p className="text-gray-600 mb-6">Your completed charging sessions will appear here</p>
          <button
            onClick={() => setActiveTab('stations')}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all"
          >
            Start Charging
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {bookingHistory.map((session) => (
            <div key={session.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{session.station_name}</h3>
                    <p className="text-gray-600 flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4" />
                      {session.station_address}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(session.session_date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {session.start_time} - {session.end_time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Zap className="w-4 h-4" />
                        {session.connector_type}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-2">
                      Completed
                    </div>
                    <p className="text-2xl font-bold text-emerald-600">₹{session.cost}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{session.energy_used} kWh</p>
                    <p className="text-sm text-gray-600">Energy Used</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{session.duration}h</p>
                    <p className="text-sm text-gray-600">Duration</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {(session.energy_used * 0.4).toFixed(1)} kg
                    </p>
                    <p className="text-sm text-gray-600">CO₂ Saved</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-4">
                  <div className="flex items-center gap-2">
                    <Car className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-600">{session.vehicle_name}</span>
                  </div>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                    View Receipt
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default HistoryTab;
