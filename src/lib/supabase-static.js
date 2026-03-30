import { createClient } from '@supabase/supabase-js'

// Use this ONLY in generateStaticParams and generateMetadata
// It does not use cookies so it works at build time
export function createStaticClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}
