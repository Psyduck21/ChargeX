import React from 'react';
import { BarChart3, Download } from 'lucide-react';

export default function ReportsTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">System Reports</h2>
        <button className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl hover:bg-emerald-700 font-medium transition-colors">
          <Download className="w-5 h-5" />
          Export All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { title: 'Monthly Revenue Report', desc: 'Detailed revenue analysis for the current month', date: 'October 2025' },
          { title: 'Station Utilization Report', desc: 'Usage statistics and availability metrics', date: 'Last 30 days' },
          { title: 'User Activity Report', desc: 'User engagement and booking patterns', date: 'Last 90 days' },
          { title: 'Energy Consumption Report', desc: 'Total energy delivered across all stations', date: 'Year to date' },
        ].map((report, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-emerald-600" />
              </div>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Download className="w-4 h-4" />
              </button>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{report.title}</h3>
            <p className="text-sm text-gray-500 mb-4">{report.desc}</p>
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-400">{report.date}</span>
              <button className="text-sm text-emerald-600 font-medium hover:text-emerald-700">View Report</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
