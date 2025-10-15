import { useEffect, useState } from 'react'
import ProfessionalLogin from './components/login.jsx'
import ProfessionalSignup from './components/signup.jsx'
import AdminDashboard from './components/AdminDashboard.jsx'

function RoleGate({ role }) {
  if (role === 'admin') return <AdminDashboard />
  if (role === 'station_manager') return <div className="p-6">Manager Dashboard (coming soon)</div>
  if (role === 'app_user') return <div className="p-6">User Dashboard (coming soon)</div>
  return <div className="p-6">Unauthorized</div>
}

function App() {
  const [view, setView] = useState('login')
  const [role, setRole] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('access_token') || localStorage.getItem('token') || ''
    // console.log(token)
    if (!token) return
    ;(async () => {
      try {
        const res = await fetch('/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
        console.log(res)
        if (!res.ok) throw new Error('Failed to fetch me')
        const me = await res.json()
        if (me?.role) {
          setRole(me.role)
          setView('dashboard')
        }
      } catch {}
    })()
  }, [])

  return (
    <div className="min-h-screen">
      {view === 'login' && (
        <ProfessionalLogin
          onSwitchToSignup={() => setView('signup')}
          onLoggedIn={async () => {
            const token = localStorage.getItem('access_token') || localStorage.getItem('token') || ''
            try {
              const res = await fetch('/auth/me', {
                headers: { Authorization: `Bearer ${token}` },
              })
              if (!res.ok) throw new Error('Failed to fetch me')
              const me = await res.json()
              setRole(me?.role || '')
              setView('dashboard')
            } catch (e) {
              console.error(e)
            }
          }}
        />
      )}
      {view === 'signup' && <ProfessionalSignup onSwitchToLogin={() => setView('login')} />}
      {view === 'dashboard' && <RoleGate role={role} />}
    </div>
  )
}

export default App;
