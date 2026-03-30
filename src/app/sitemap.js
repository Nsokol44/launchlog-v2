import { createStaticClient } from '@/lib/supabase-static'
import { SITE_URL } from '@/lib/constants'

export default async function sitemap() {
  const supabase = createStaticClient()
  const { data: startups } = await supabase
    .from('startups')
    .select('id, created_at')
    .eq('approved', true)

  const staticRoutes = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/list`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  ]

  const startupRoutes = (startups || []).map(s => ({
    url: `${SITE_URL}/startup/${s.id}`,
    lastModified: new Date(s.created_at),
    changeFrequency: 'weekly',
    priority: 0.9,
  }))

  return [...staticRoutes, ...startupRoutes]
}
