import DashboardClient from '@/components/DashboardClient'

export const metadata = {
  title: 'Founder Dashboard',
  description: 'Track swipes, feedback, and community growth for your startups.',
  robots: { index: false }, // private page
}

export default function DashboardPage() {
  return <DashboardClient />
}
