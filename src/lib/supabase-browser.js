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
  const supabase = getSupabaseBrowser()
  const { data: { user } } = await supabase.auth.getUser()

  // 1. Build the query with a Left Join on the swipes table
  // We select 'swipes(id)' so we can check if a swipe exists for this user
  let query = supabase
    .from('startups')
    .select(`
      *,
      swipes!left(id, user_id)
    `)
    .eq('approved', true)
    .is('deleted_at', null)

  // 2. Filter logic: 
  // If logged in, only show startups where the user HAS NOT swiped yet.
  if (user) {
    query = query.or(`user_id.is.null, user_id.neq.${user.id}`, { foreignTable: 'swipes' })
  }

  if (category && category !== 'all') query = query.eq('category', category)
  if (city) query = query.ilike('city', `%${city}%`)

  const { data, error } = await query
  if (error) throw error

  // 3. Post-process: Remove startups that technically joined but belonged to other users' swipes
  // and clean the object so it doesn't contain the 'swipes' array.
  const filteredData = data
    .filter(s => !s.swipes || !s.swipes.some(swipe => swipe.user_id === user?.id))
    .map(({ swipes, ...startup }) => startup)

  return filteredData
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
  
  // Prevent recording if the startup is deleted
  const { data: check } = await supabase
    .from('startups')
    .select('id')
    .eq('id', startup_id)
    .is('deleted_at', null)
    .single()
    
  if (!check) return 

  const { error } = await supabase.from('swipes').insert([{
    startup_id, 
    direction,
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
    .select(`
      startup_id, 
      startups!inner(*)
    `) 
    .eq('user_id', user.id)
    .is('startups.deleted_at', null)
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