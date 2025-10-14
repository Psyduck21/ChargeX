import { useState } from 'react'
import ProfessionalLogin from './components/login.jsx'
import ProfessionalSignup from './components/signup.jsx'

function App() {
  const [view, setView] = useState('login')

  return (
    <div className="min-h-screen">
      {view === 'login' ? (
        <ProfessionalLogin onSwitchToSignup={() => setView('signup')} />
      ) : (
        <ProfessionalSignup onSwitchToLogin={() => setView('login')} />
      )}
    </div>
  )
}

export default App;
