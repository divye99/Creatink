import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Splash from './components/shared/Splash'
import AuthLayout from './components/layout/AuthLayout'
import AppLayout from './components/layout/AppLayout'
import RequireAuth from './components/layout/RequireAuth'

import Login from './pages/auth/Login'
import OnboardingRoot from './pages/onboarding/OnboardingRoot'
import OnboardingCreator from './pages/onboarding/OnboardingCreator'
import OnboardingBrand from './pages/onboarding/OnboardingBrand'

import Home from './pages/Home'
import Discover from './pages/Discover'
import Campaigns from './pages/Campaigns'
import CampaignDetail from './pages/CampaignDetail'
import CreateCampaign from './pages/CreateCampaign'
import Messages from './pages/Messages'
import ChatRoom from './pages/ChatRoom'
import Profile from './pages/Profile'
import EditProfile from './pages/EditProfile'
import Settings from './pages/Settings'
import PitchBuilder from './pages/PitchBuilder'
import KPIDashboard from './pages/KPIDashboard'
import PaymentTracker from './pages/PaymentTracker'
import WhosLooking from './pages/WhosLooking'
import MissedOpportunities from './pages/MissedOpportunities'
import Notifications from './pages/Notifications'
import Admin from './pages/admin/Admin'
import NotFound from './pages/NotFound'

export default function App() {
  const [showSplash, setShowSplash] = useState(true)
  useEffect(() => { const t = setTimeout(() => setShowSplash(false), 1700); return () => clearTimeout(t) }, [])
  if (showSplash) return <Splash />

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />

      {/* Auth (public) */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Login signupMode />} />
      </Route>

      {/* Onboarding (auth required, no profile yet) */}
      <Route element={<AuthLayout />}>
        <Route
          path="/onboarding"
          element={<RequireAuth requireProfile={false}><OnboardingRoot /></RequireAuth>}
        />
        <Route
          path="/onboarding/creator"
          element={<RequireAuth requireProfile={false}><OnboardingCreator /></RequireAuth>}
        />
        <Route
          path="/onboarding/brand"
          element={<RequireAuth requireProfile={false}><OnboardingBrand /></RequireAuth>}
        />
      </Route>

      {/* App (full auth) */}
      <Route element={<RequireAuth><AppLayout /></RequireAuth>}>
        <Route path="/home"                element={<Home />} />
        <Route path="/discover"            element={<Discover />} />
        <Route path="/campaigns"           element={<Campaigns />} />
        <Route path="/campaigns/new"       element={<CreateCampaign />} />
        <Route path="/campaigns/:id"       element={<CampaignDetail />} />
        <Route path="/messages"            element={<Messages />} />
        <Route path="/messages/:dealId"    element={<ChatRoom />} />
        <Route path="/profile"             element={<Profile />} />
        <Route path="/profile/edit"        element={<EditProfile />} />
        <Route path="/settings"            element={<Settings />} />
        <Route path="/pitch/:targetId"     element={<PitchBuilder />} />
        <Route path="/deals/:dealId/kpis"  element={<KPIDashboard />} />
        <Route path="/deals/:dealId/pay"   element={<PaymentTracker />} />
        <Route path="/whos-looking"        element={<WhosLooking />} />
        <Route path="/missed-opportunities" element={<MissedOpportunities />} />
        <Route path="/notifications"       element={<Notifications />} />
      </Route>

      {/* Admin (separate, password-gated) */}
      <Route path="/admin" element={<Admin />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
