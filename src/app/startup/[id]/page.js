import { createClient } from '@/lib/supabase-server'
import { createStaticClient } from '@/lib/supabase-static'
import { notFound } from 'next/navigation'
import StartupProfileClient from '@/components/StartupProfileClient'
import { SITE_URL } from '@/lib/constants'

export const dynamicParams = true
export const revalidate = 60

// generateStaticParams runs at BUILD TIME — must use static client (no cookies)
export async function generateStaticParams() {
  const supabase = createStaticClient()
  const { data: startups } = await supabase
    .from('startups')
    .select('id')
    .eq('approved', true)
  return (startups || []).map(s => ({ id: s.id }))
}

// generateMetadata also runs at build time — use static client
export async function generateMetadata({ params }) {
  const supabase = createStaticClient()
  const { data: startup } = await supabase
    .from('startups')
    .select('*')
    .eq('id', params.id)
    .eq('approved', true)
    .single()

  if (!startup) {
    return { title: 'Startup Not Found | LaunchLog' }
  }

  const title = `${startup.name} — ${startup.tagline}`
  const description = `${startup.product} | ${startup.supporters || 0} supporters on LaunchLog.${startup.city ? ` Based in ${startup.city}.` : ''}`
  const ogImageUrl = `${SITE_URL}/api/og?name=${encodeURIComponent(startup.name)}&tagline=${encodeURIComponent(startup.tagline)}&emoji=${encodeURIComponent(startup.logo_emoji || '🚀')}&supporters=${startup.supporters || 0}&category=${encodeURIComponent(startup.category || '')}`

  return {
    title,
    description,
    keywords: [startup.name, startup.category, 'startup', 'early stage', startup.city].filter(Boolean),
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/startup/${startup.id}`,
      type: 'website',
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: `${startup.name} on LaunchLog` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: `${SITE_URL}/startup/${startup.id}`,
    },
  }
}

// Page itself runs at REQUEST TIME — can use cookie-based client
export default async function StartupPage({ params }) {
  const supabase = createStaticClient()

  const { data: startup } = await supabase
    .from('startups')
    .select('*')
    .eq('id', params.id)
    .eq('approved', true)
    .single()

  if (!startup) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: startup.name,
    description: startup.tagline,
    url: `${SITE_URL}/startup/${startup.id}`,
    foundingLocation: startup.city || undefined,
    founder: startup.founder_name ? { '@type': 'Person', name: startup.founder_name } : undefined,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <StartupProfileClient startup={startup} />
    </>
  )
}
