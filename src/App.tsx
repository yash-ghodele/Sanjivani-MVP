import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Camera from './pages/Camera'
import History from './pages/History'
import Auth from './pages/Auth'
import MobileNav from './components/layout/MobileNav'
import PageTransition from './components/layout/PageTransition'
import ChatAssistant from './components/ui/ChatAssistant'
import { LanguageProvider } from './context/LanguageContext'

function AppContent() {
    const location = useLocation()
    // Show nav only on main app pages
    const showNav = !['/', '/auth'].includes(location.pathname)

    return (
        <div className="min-h-screen pb-24">
            <PageTransition>
                <Routes location={location}>
                    <Route path="/" element={<Landing />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/camera" element={<Camera />} />
                    <Route path="/history" element={<History />} />
                </Routes>
            </PageTransition>

            {showNav && <MobileNav />}
            <ChatAssistant />
        </div>
    )
}

function App() {
    return (
        <LanguageProvider>
            <BrowserRouter>
                <AppContent />
            </BrowserRouter>
        </LanguageProvider>
    )
}

export default App
