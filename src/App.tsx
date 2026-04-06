import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import AnalyticsPage from './pages/AnalyticsPage'
import ProposalsPage from './pages/ProposalsPage'
import RfpInboxPage from './pages/RfpInboxPage'
import ProposalViewPage from './pages/ProposalViewPage'
import ContentPage from './pages/ContentPage'

/** Inner app wrapped by sidebar + topbar */
function AppRoutes() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<AnalyticsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/proposals" element={<ProposalsPage />} />
        <Route path="/inbox" element={<RfpInboxPage />} />
        <Route path="/content" element={<ContentPage />} />
      </Routes>
    </AppLayout>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Standalone full-page viewer — no sidebar */}
        <Route path="/proposal/view" element={<ProposalViewPage />} />

        {/* All other routes rendered inside the app shell */}
        <Route path="*" element={<AppRoutes />} />
      </Routes>
    </BrowserRouter>
  )
}
