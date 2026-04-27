import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase, SUPABASE_LIVE } from '@/lib/supabase'

const AuthCtx = createContext(null)

const LS_KEY = 'creatink:session'

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    if (SUPABASE_LIVE) return null
    try { return JSON.parse(localStorage.getItem(LS_KEY) || 'null') } catch { return null }
  })
  const [profile, setProfile] = useState(null)
  const [userType, setUserType] = useState(null) // 'creator' | 'brand'
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      const s = data?.session ?? session
      setSession(s)
      hydrateProfile(s).finally(() => setLoading(false))
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s)
      hydrateProfile(s)
    })
    return () => { mounted = false; sub?.subscription?.unsubscribe?.() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const hydrateProfile = useCallback(async (s) => {
    if (!s?.user?.id) { setProfile(null); setUserType(null); return }
    if (!SUPABASE_LIVE) {
      const cached = JSON.parse(localStorage.getItem('creatink:profile') || 'null')
      if (cached) { setProfile(cached); setUserType(cached.user_type) }
      return
    }
    const { data: u } = await supabase.from('users').select('*').eq('id', s.user.id).maybeSingle()
    if (u?.user_type === 'creator') {
      const { data } = await supabase.from('creator_profiles').select('*').eq('user_id', u.id).maybeSingle()
      setProfile({ ...u, ...(data || {}) })
    } else if (u?.user_type === 'brand') {
      const { data } = await supabase.from('brand_profiles').select('*').eq('user_id', u.id).maybeSingle()
      setProfile({ ...u, ...(data || {}) })
    } else {
      setProfile(u || null)
    }
    setUserType(u?.user_type || null)
  }, [])

  const sendOtp = async (phoneE164) => {
    return supabase.auth.signInWithOtp({ phone: phoneE164 })
  }

  const verifyOtp = async (phoneE164, token) => {
    const { data, error } = await supabase.auth.verifyOtp({ phone: phoneE164, token, type: 'sms' })
    if (error) return { error }
    if (!SUPABASE_LIVE) localStorage.setItem(LS_KEY, JSON.stringify(data.session))
    setSession(data.session)
    return { data }
  }

  const completeSignup = async ({ phone, user_type, ...rest }) => {
    const id = session?.user?.id || ('dev-' + phone)
    const userRow = { id, phone, user_type, verified: false }

    if (SUPABASE_LIVE) {
      await supabase.from('users').upsert(userRow)
      if (user_type === 'creator') {
        await supabase.from('creator_profiles').upsert({ user_id: id, ...rest })
      } else {
        await supabase.from('brand_profiles').upsert({ user_id: id, ...rest })
      }
    } else {
      const merged = { ...userRow, ...rest }
      localStorage.setItem('creatink:profile', JSON.stringify(merged))
      setProfile(merged)
    }
    setUserType(user_type)
  }

  const updateProfile = async (patch) => {
    const next = { ...(profile || {}), ...patch }
    setProfile(next)
    if (!SUPABASE_LIVE) {
      localStorage.setItem('creatink:profile', JSON.stringify(next))
      return
    }
    const id = session?.user?.id
    if (userType === 'creator') {
      await supabase.from('creator_profiles').update(patch).eq('user_id', id)
    } else if (userType === 'brand') {
      await supabase.from('brand_profiles').update(patch).eq('user_id', id)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    if (!SUPABASE_LIVE) {
      localStorage.removeItem(LS_KEY)
      localStorage.removeItem('creatink:profile')
    }
    setSession(null); setProfile(null); setUserType(null)
  }

  return (
    <AuthCtx.Provider
      value={{
        session, profile, userType, loading,
        sendOtp, verifyOtp, completeSignup, updateProfile, signOut,
      }}
    >
      {children}
    </AuthCtx.Provider>
  )
}

export const useAuth = () => useContext(AuthCtx)
