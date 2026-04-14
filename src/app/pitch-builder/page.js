import PitchBuilderClient from '@/components/PitchBuilderClient'

export const metadata = {
  title: 'Pitch Builder — LaunchLog',
  description: 'Build a compelling startup pitch step by step with AI guidance.',
  robots: { index: false },
}

export default function PitchBuilderPage() {
  return <PitchBuilderClient />
}
