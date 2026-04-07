import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import AnalyticsPage from './pages/AnalyticsPage'
import ProposalsPage from './pages/ProposalsPage'
import RfpInboxPage from './pages/RfpInboxPage'
import ProposalViewPage from './pages/ProposalViewPage'
import ContentPage from './pages/ContentPage'
import ClientsPage from './pages/ClientsPage'
import SettingsPage from './pages/SettingsPage'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'

/** Inner app wrapped by sidebar + topbar */
function AppRoutes() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/dashboard" element={<AnalyticsPage />} />
        <Route path="/proposals" element={<ProposalsPage />} />
        <Route path="/inbox" element={<RfpInboxPage />} />
        <Route path="/content" element={<ContentPage />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </AppLayout>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Standalone pages — no sidebar */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/proposal/view" element={<ProposalViewPage />} />

        {/* All other routes rendered inside the app shell */}
        <Route path="*" element={<AppRoutes />} />
      </Routes>
    </BrowserRouter>
  )
}
