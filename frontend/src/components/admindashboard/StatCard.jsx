import React from 'react';
import { TrendingUp, HelpCircle } from 'lucide-react';

const Tooltip = ({ text, children }) => {
  const [show, setShow] = React.useState(false);
  return (
    <div className="relative inline-block">
      <div onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
        {children}
      </div>
      {show && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-50">
          {text}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};

export default function StatCard({ title, value, change, icon: Icon, color, subtitle, tooltip, darkMode = false }) {
  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl p-4 md:p-6 border hover:shadow-lg transition-shadow`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>{title}</p>
            {tooltip && (
              <Tooltip text={tooltip}>
                <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
              </Tooltip>
            )}
          </div>
          <h3 className={`text-2xl md:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{value}</h3>
          {subtitle && <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-600'} mt-1`}>{subtitle}</p>}
          {change && (
            <p className="text-sm text-emerald-600 mt-2 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              {change}
            </p>
          )}
        </div>
        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </div>
      </div>
    </div>
  );
}
