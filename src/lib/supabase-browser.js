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
export const uploadLogo = async (file, startupName, existingLogoUrl = null) => {
  const supabase = getSupabaseBrowser()
  const ext = file.name.split('.').pop().toLowerCase()

  // Use a consistent filename based on startup name — no timestamp
  // This means re-uploading always overwrites the same file
  const slug = startupName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  const filename = `${slug}-logo.${ext}`

  // Delete old logo first if it exists and is a different filename
  if (existingLogoUrl) {
    try {
      const oldFilename = existingLogoUrl.split('/logos/')[1]?.split('?')[0]
      if (oldFilename && oldFilename !== filename) {
        await supabase.storage.from('logos').remove([oldFilename])
      }
    } catch {
      // Non-fatal — continue with upload even if delete fails
    }
  }

  // Upload with upsert:true so same filename always overwrites
  const { error } = await supabase.storage
    .from('logos')
    .upload(filename, file, {
      upsert: true,
      cacheControl: '3600',
      contentType: file.type,
    })

  if (error) throw error

  const { data } = supabase.storage.from('logos').getPublicUrl(filename)
  return data.publicUrl
}

// ── Clean up orphaned logos ───────────────────────────────────
// Call this from admin panel to remove logos with no matching startup
export const cleanOrphanedLogos = async () => {
  const supabase = getSupabaseBrowser()

  // Get all files in the logos bucket
  const { data: files, error: listError } = await supabase.storage
    .from('logos')
    .list()

  if (listError) throw listError

  // Get all logo URLs currently in use
  const { data: startups } = await supabase
    .from('startups')
    .select('logo_url')
    .not('logo_url', 'is', null)

  const activeUrls = new Set((startups || []).map(s => {
    return s.logo_url?.split('/logos/')[1]?.split('?')[0]
  }).filter(Boolean))

  // Delete any file not referenced by a startup
  const orphans = (files || [])
    .filter(f => !activeUrls.has(f.name))
    .map(f => f.name)

  if (orphans.length > 0) {
    const { error } = await supabase.storage.from('logos').remove(orphans)
    if (error) throw error
  }

  return orphans.length
}
