import React from 'react';

export default function EmptyState({ message, icon: Icon, darkMode = false }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <p className={`text-gray-500 text-center ${darkMode ? 'text-gray-400' : ''}`}>{message}</p>
    </div>
  );
}
