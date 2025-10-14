import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/auth': { target: 'http://127.0.0.1:8000', changeOrigin: true, secure: false },
      '/profiles': { target: 'http://127.0.0.1:8000', changeOrigin: true, secure: false },
      '/vehicles': { target: 'http://127.0.0.1:8000', changeOrigin: true, secure: false },
      '/stations': { target: 'http://127.0.0.1:8000', changeOrigin: true, secure: false },
      '/slots': { target: 'http://127.0.0.1:8000', changeOrigin: true, secure: false },
      '/bookings': { target: 'http://127.0.0.1:8000', changeOrigin: true, secure: false },
      '/charging_sessions': { target: 'http://127.0.0.1:8000', changeOrigin: true, secure: false },
      '/station_managers': { target: 'http://127.0.0.1:8000', changeOrigin: true, secure: false },
      '/feedback': { target: 'http://127.0.0.1:8000', changeOrigin: true, secure: false },
      '/docs': { target: 'http://127.0.0.1:8000', changeOrigin: true, secure: false },
      '/openapi.json': { target: 'http://127.0.0.1:8000', changeOrigin: true, secure: false },
    },
  },
})
