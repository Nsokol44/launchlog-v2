export const revalidate = 60

import { createStaticClient } from '@/lib/supabase-static'
import DiscoverClient from '@/components/DiscoverClient'

export const metadata = {
  title: "LaunchLog — Discover What's Next",
  description: 'Swipe through early-stage startups solving real problems. Support the ones you love, leave feedback on the rest.',
}

export default async function HomePage() {
  const supabase = createStaticClient()

  const { data: startups } = await supabase
    .from('startups')
    .select('*')
    .eq('approved', true)
    .order('created_at', { ascending: false })
    .limit(50)

  return <DiscoverClient initialStartups={startups || []} />
}