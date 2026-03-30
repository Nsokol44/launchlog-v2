import SavedClient from '@/components/SavedClient'

export const metadata = {
  title: 'Saved Startups',
  description: 'Your bookmarked startups on LaunchLog.',
  robots: { index: false }, // private page, don't index
}

export default function SavedPage() {
  return <SavedClient />
}
