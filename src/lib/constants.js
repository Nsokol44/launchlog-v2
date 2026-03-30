export const CATEGORIES = [
  { value: 'all',            label: 'All',            icon: '🌐' },
  { value: 'food',           label: 'Food & Drink',   icon: '🍔' },
  { value: 'tech',           label: 'Tech',           icon: '💻' },
  { value: 'saas',           label: 'SaaS',           icon: '☁️' },
  { value: 'health',         label: 'Health',         icon: '💚' },
  { value: 'finance',        label: 'Finance',        icon: '💰' },
  { value: 'entertainment',  label: 'Entertainment',  icon: '🎮' },
  { value: 'sustainability', label: 'Sustainability', icon: '🌱' },
  { value: 'real-estate',    label: 'Real Estate',    icon: '🏠' },
  { value: 'education',      label: 'Education',      icon: '🎓' },
]

export const STAGES = ['Idea stage', 'Pre-revenue', 'Early revenue', 'Growing']

export const COMMUNITY_CHANNELS = {
  discord:   { label: 'Join Discord',          icon: '🎮', bg: 'bg-indigo-50',  text: 'text-indigo-700',  border: 'border-indigo-200' },
  slack:     { label: 'Join Slack',            icon: '💬', bg: 'bg-orange-50',  text: 'text-orange-700',  border: 'border-orange-200' },
  instagram: { label: 'Follow on Instagram',   icon: '📸', bg: 'bg-pink-50',    text: 'text-pink-700',    border: 'border-pink-200'   },
  twitter:   { label: 'Follow on X / Twitter', icon: '🐦', bg: 'bg-sky-50',     text: 'text-sky-700',     border: 'border-sky-200'    },
  linkedin:  { label: 'Connect on LinkedIn',   icon: '💼', bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200'   },
  tiktok:    { label: 'Follow on TikTok',      icon: '🎵', bg: 'bg-gray-100',   text: 'text-gray-800',    border: 'border-gray-300'   },
  facebook:  { label: 'Join Facebook Group',   icon: '👥', bg: 'bg-blue-50',    text: 'text-blue-800',    border: 'border-blue-200'   },
}

export const FEEDBACK_OPTIONS = [
  { id: 'no-problem',    label: "🙅 Not solving a problem I have" },
  { id: 'too-expensive', label: "💸 Seems too expensive" },
  { id: 'competitive',   label: "🔀 Already exists / too competitive" },
  { id: 'unclear',       label: "📖 Pitch wasn't clear enough" },
  { id: 'location',      label: "🌍 Not in my area" },
  { id: 'timing',        label: "⏳ Good idea, wrong timing" },
]

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://launchlog.vercel.app'
