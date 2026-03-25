import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster position="top-right" toastOptions={{
      duration: 4000,
      success: { style: { background: '#10b981', color: 'white' } },
      error: { style: { background: '#dc2626', color: 'white' } }
    }} />
  </React.StrictMode>
)
