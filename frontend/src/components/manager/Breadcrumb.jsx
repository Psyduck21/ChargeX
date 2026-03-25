import React from 'react';
import { Home, ChevronRight } from 'lucide-react';

export default function Breadcrumb({ breadcrumbs, onNavigate, darkMode = false }) {
  return (
    <nav className="flex items-center space-x-2 text-sm mb-4">
      <Home className="w-4 h-4 text-gray-400" />
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <button
            onClick={() => onNavigate && onNavigate(crumb.path)}
            className={`${
              index === breadcrumbs.length - 1
                ? darkMode ? 'text-emerald-400 font-semibold' : 'text-emerald-600 font-semibold'
                : darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
            } transition-colors`}
          >
            {crumb.name}
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
}
