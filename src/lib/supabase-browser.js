'use client'
import { createBrowserClient } from '@supabase/ssr'

// Use this in Client Components
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

// Singleton for hooks
let client
export function getSupabaseBrowser() {
  if (!client) client = createClient()
  return client
}

// ── Auth ──────────────────────────────────────────────────────
export const signUp = (email, password) =>
  getSupabaseBrowser().auth.signUp({ email, password })

export const signIn = (email, password) =>
  getSupabaseBrowser().auth.signInWithPassword({ email, password })

export const signOut = () => getSupabaseBrowser().auth.signOut()

// ── Startups ──────────────────────────────────────────────────
export const fetchStartups = async ({ category, city } = {}) => {
  let query = getSupabaseBrowser()
    .from('startups')
    .select('*')
    .eq('approved', true)
    .order('created_at', { ascending: false })

  if (category && category !== 'all') query = query.eq('category', category)
  if (city) query = query.ilike('city', `%${city}%`)

  const { data, error } = await query
  if (error) throw error
  return data
}

export const createStartup = async (payload) => {
  const supabase = getSupabaseBrowser()
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from('startups')
    .insert([{ ...payload, approved: false, founder_id: user?.id || null }])
    .select()
    .single()
  if (error) throw error
  return data
}

// ── Swipes ────────────────────────────────────────────────────
export const recordSwipe = async ({ startup_id, direction, feedback_reason, feedback_note }) => {
  const supabase = getSupabaseBrowser()
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase.from('swipes').insert([{
    startup_id, direction,
    feedback_reason: feedback_reason || null,
    feedback_note: feedback_note || null,
    user_id: user?.id || null,
  }])
  if (error) throw error
  if (direction === 'right') {
    await supabase.rpc('increment_supporters', { startup_id })
  }
}

// ── Saved ─────────────────────────────────────────────────────
export const saveStartup = async (startup_id) => {
  const supabase = getSupabaseBrowser()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Must be signed in to save')
  const { error } = await supabase.from('saved_startups')
    .upsert([{ user_id: user.id, startup_id }], { onConflict: 'user_id,startup_id' })
  if (error) throw error
}

export const unsaveStartup = async (startup_id) => {
  const supabase = getSupabaseBrowser()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('saved_startups')
    .delete().eq('user_id', user.id).eq('startup_id', startup_id)
}

export const fetchSavedIds = async () => {
  const supabase = getSupabaseBrowser()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []
  const { data } = await supabase.from('saved_startups').select('startup_id').eq('user_id', user.id)
  return (data || []).map(r => r.startup_id)
}

export const fetchSavedStartups = async () => {
  const supabase = getSupabaseBrowser()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []
  const { data, error } = await supabase
    .from('saved_startups')
    .select('startup_id, startups(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data.map(row => row.startups)
}

// ── Digest ────────────────────────────────────────────────────
export const subscribeDigest = async (email, interests = []) => {
  const { error } = await getSupabaseBrowser()
    .from('digest_subscribers')
    .upsert([{ email, interests, active: true }], { onConflict: 'email' })
  if (error) throw error
}

// ── Logo upload ───────────────────────────────────────────────
export const uploadLogo = async (file, startupName) => {
  const supabase = getSupabaseBrowser()
  const ext = file.name.split('.').pop()
  const filename = `${startupName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.${ext}`
  const { error } = await supabase.storage.from('logos').upload(filename, file, { upsert: true })
  if (error) throw error
  const { data } = supabase.storage.from('logos').getPublicUrl(filename)
  return data.publicUrl
}
