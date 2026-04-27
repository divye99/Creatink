import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export default function RequireAuth({ children, requireProfile = true }) {
  const { session, profile, loading } = useAuth()
  const loc = useLocation()

  if (loading) return null

  if (!session) return <Navigate to="/login" replace state={{ from: loc }} />
  if (requireProfile && !profile?.user_type) return <Navigate to="/onboarding" replace />

  return children
}
