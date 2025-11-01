import React, { useState } from 'react';
import { Users, Search } from 'lucide-react';

export default function UsersTab({
  users,
  searchQuery,
  setSearchQuery
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">User</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Total Bookings</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(users || []).filter(user =>
              (user?.name || user?.email || '').toLowerCase().includes(searchQuery.toLowerCase())
            ).map((user) => {
               const displayName = user?.name || user?.name || user?.email || 'Unknown';
               const initial = displayName ? displayName.charAt(0) : '?';
               const email = user?.email || '—';
               const totalBookings = (user && (user.total_bookings ?? user.totalBookings ?? user.bookings_count)) || 0;

              return (
                <tr key={user?.id || displayName} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                        {initial}
                      </div>
                      <span className="font-medium text-gray-900">{displayName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{email}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{totalBookings}</td>
                  <td className="px-6 py-4">
                    <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">View Details</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
