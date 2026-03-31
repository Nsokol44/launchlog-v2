import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import AdminClient from '@/components/AdminClient'

export const metadata = {
  title: 'Admin — LaunchLog',
  robots: { index: false },
}

export default async function AdminPage() {
  const supabase = createClient()

  // Check auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  // Check admin flag
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) redirect('/')

  // Fetch all startups for admin view
  const { data: startups } = await supabase
    .from('startups')
    .select('*')
    .order('created_at', { ascending: false })

  // Fetch swipe counts per startup
  const { data: swipeCounts } = await supabase
    .from('swipes')
    .select('startup_id, direction')

  const swipeMap = {}
  for (const s of (swipeCounts || [])) {
    if (!swipeMap[s.startup_id]) swipeMap[s.startup_id] = { right: 0, left: 0, save: 0 }
    swipeMap[s.startup_id][s.direction]++
  }

  return <AdminClient startups={startups || []} swipeMap={swipeMap} />
}
