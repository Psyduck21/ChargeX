import React, { createContext, useContext, useState, useCallback } from 'react';

// Presentational Toast list (default export)
export function Toast({ toasts = [], onDismiss = () => {} }) {
  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-3">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`max-w-sm w-full px-4 py-3 rounded-lg shadow-lg text-sm flex flex-col gap-2 transition transform origin-top-right ${
            t.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : t.type === 'error' ? 'bg-red-50 border border-red-200 text-red-800' : 'bg-white border border-gray-200 text-gray-900'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <div className="font-semibold">{t.type === 'success' ? 'Success' : t.type === 'error' ? 'Error' : 'Info'}</div>
              <div className="text-xs mt-1 break-words">{t.message}</div>
            </div>
            <button onClick={() => onDismiss(t.id)} className="text-gray-400 hover:text-gray-600 ml-2 pl-2" aria-label="Dismiss toast">✕</button>
          </div>
          {/* progress bar */}
          <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-1 bg-current"
              style={{
                backgroundColor: t.type === 'success' ? '#059669' : t.type === 'error' ? '#dc2626' : '#374151',
                animation: `toast-progress ${t.ttl || 4000}ms linear forwards`
              }}
            />
          </div>
        </div>
      ))}
      <style>{`@keyframes toast-progress { from { width: 100%; } to { width: 0%; } }`}</style>
    </div>
  );
}

// Toast context & provider for app-wide toasts
const ToastContext = createContext(null);
let idCounter = 1;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((type, message, ttl = 4000) => {
    const id = idCounter++;
    const toast = { id, type, message, ttl };
    setToasts((t) => [...t, toast]);
    if (ttl > 0) setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), ttl);
    return id;
  }, []);

  const remove = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const value = {
    success: (msg, ttl) => push('success', msg, ttl),
    error: (msg, ttl) => push('error', msg, ttl),
    info: (msg, ttl) => push('info', msg, ttl),
    remove,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toast toasts={toasts} onDismiss={remove} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
};

export default Toast;
