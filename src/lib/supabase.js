import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

// In dev without keys, fall back to a stub that resolves predictable shapes,
// so the UI runs end-to-end without a live Supabase project.
const isLive = Boolean(url && key)

export const supabase = isLive ? createClient(url, key, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
}) : makeStubClient()

export const SUPABASE_LIVE = isLive

function makeStubClient() {
  const tables = new Map()
  const get = (t) => tables.get(t) ?? []
  const set = (t, rows) => tables.set(t, rows)

  const builder = (table) => {
    let rows = get(table)
    let filters = []
    const api = {
      select() { return api },
      insert(payload) {
        const arr = Array.isArray(payload) ? payload : [payload]
        const stamped = arr.map((r) => ({ id: crypto.randomUUID(), created_at: new Date().toISOString(), ...r }))
        set(table, [...get(table), ...stamped])
        return Promise.resolve({ data: stamped, error: null })
      },
      update(patch) {
        const next = get(table).map((r) =>
          filters.every((f) => r[f.col] === f.val) ? { ...r, ...patch } : r
        )
        set(table, next)
        return Promise.resolve({ data: next, error: null })
      },
      delete() {
        set(table, get(table).filter((r) => !filters.every((f) => r[f.col] === f.val)))
        return Promise.resolve({ data: null, error: null })
      },
      eq(col, val) { filters.push({ col, val }); rows = rows.filter((r) => r[col] === val); return api },
      in() { return api },
      order() { return api },
      limit(n) { rows = rows.slice(0, n); return api },
      single() { return Promise.resolve({ data: rows[0] ?? null, error: null }) },
      maybeSingle() { return Promise.resolve({ data: rows[0] ?? null, error: null }) },
      then(resolve) { resolve({ data: rows, error: null }) },
    }
    return api
  }

  return {
    auth: {
      _session: null,
      onAuthStateChange(cb) { return { data: { subscription: { unsubscribe() {} } } } },
      getSession() { return Promise.resolve({ data: { session: this._session }, error: null }) },
      signInWithOtp() { return Promise.resolve({ data: {}, error: null }) },
      verifyOtp({ phone }) {
        const session = { user: { id: 'dev-' + phone, phone } }
        this._session = session
        return Promise.resolve({ data: { session }, error: null })
      },
      signOut() { this._session = null; return Promise.resolve({ error: null }) },
    },
    from: builder,
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: { path: 'stub' }, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
      }),
    },
  }
}
