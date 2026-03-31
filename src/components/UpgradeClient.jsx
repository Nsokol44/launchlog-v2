'use client'
import { useState } from 'react'
import { useAuth } from './AuthProvider'
import { getSupabaseBrowser } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Check, Zap, TrendingUp, Search, Mail, Star } from 'lucide-react'

const FREE_FEATURES = [
  'List your startup',
  'Public profile page (Google indexed)',
  'Swipe analytics dashboard',
  'Community channels',
  'Weekly feedback digest',
]

const AGENT_FEATURES = [
  'Everything in Free',
  'AI marketing content (X, LinkedIn, Reddit, Email, Product Hunt)',
  'Customer discovery — finds warm prospects automatically',
  'Personalized outreach drafts per prospect',
  'Weekly agent runs (automated)',
  'Priority listing in swipe deck',
]

export default function UpgradeClient() {
  const { user, profile, refetchProfile } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const isAgent = profile?.subscription_tier === 'agent' || profile?.subscription_tier === 'pro'

  // Simulate upgrade (replace with Stripe in production)
  const handleUpgrade = async () => {
    if (!user) {
      toast.error('Please sign in first')
      return
    }
    setLoading(true)
    try {
      // In production: redirect to Stripe checkout here
      // For now: manually upgrade in Supabase for testing
      const supabase = getSupabaseBrowser()
      const { error } = await supabase
        .from('profiles')
        .update({
          subscription_tier: 'agent',
          subscribed: true,
          subscribed_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (error) throw error

      if (refetchProfile) await refetchProfile()
      toast.success('🎉 Agent tier activated!')
      router.push('/agent')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-5 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-coral-50 border border-coral-200 rounded-full px-4 py-2 text-sm font-medium text-coral mb-5">
          <Zap size={14} /> AI Growth Agent
        </div>
        <h1 className="font-display text-5xl font-bold text-ink mb-4 tracking-tight">
          Let AI do the work
        </h1>
        <p className="text-muted text-xl leading-relaxed max-w-2xl mx-auto font-light">
          The Agent tier handles your marketing, finds your first customers, and drafts personalized outreach — automatically.
        </p>
      </div>

      {/* Already subscribed */}
      {isAgent && (
        <div className="bg-green-50 border border-green-200 rounded-3xl p-6 text-center mb-10">
          <div className="text-3xl mb-2">✅</div>
          <p className="font-display text-xl font-semibold text-green-700 mb-1">You're on the Agent tier</p>
          <p className="text-green-600 text-sm mb-4">All agent features are active for your account.</p>
          <Link href="/agent" className="bg-coral text-white font-semibold px-6 py-3 rounded-full shadow-coral hover:bg-coral-600 transition-all inline-block">
            Go to Agent →
          </Link>
        </div>
      )}

      {/* Pricing cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {/* Free */}
        <div className="bg-white rounded-3xl border border-border p-8">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">Free</p>
            <div className="font-display text-4xl font-bold text-ink">$0</div>
            <p className="text-muted text-sm mt-1">Forever free</p>
          </div>
          <ul className="space-y-3 mb-8">
            {FREE_FEATURES.map(f => (
              <li key={f} className="flex items-start gap-3 text-sm text-ink">
                <Check size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                {f}
              </li>
            ))}
          </ul>
          <div className="w-full text-center py-3 rounded-full border border-border text-muted text-sm font-medium">
            Current plan
          </div>
        </div>

        {/* Agent */}
        <div className="bg-white rounded-3xl border-2 border-coral p-8 relative">
          {/* Popular badge */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
            <span className="bg-coral text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-coral">
              ✨ Most popular
            </span>
          </div>

          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-coral mb-2">Agent</p>
            <div className="flex items-end gap-2">
              <div className="font-display text-4xl font-bold text-ink">$19</div>
              <span className="text-muted text-sm mb-1">/month</span>
            </div>
            <p className="text-muted text-sm mt-1">Cancel anytime</p>
          </div>

          <ul className="space-y-3 mb-8">
            {AGENT_FEATURES.map(f => (
              <li key={f} className="flex items-start gap-3 text-sm text-ink">
                <Check size={16} className="text-coral flex-shrink-0 mt-0.5" />
                {f}
              </li>
            ))}
          </ul>

          {!isAgent ? (
            <button
              onClick={handleUpgrade}
              disabled={loading || !user}
              className="w-full bg-coral text-white font-semibold py-3.5 rounded-full shadow-coral hover:bg-coral-600 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Zap size={16} />
              {loading ? 'Activating...' : !user ? 'Sign in to upgrade' : 'Get Agent — $19/mo'}
            </button>
          ) : (
            <Link href="/agent"
              className="w-full bg-coral text-white font-semibold py-3.5 rounded-full shadow-coral hover:bg-coral-600 transition-all flex items-center justify-center gap-2">
              <Zap size={16} /> Go to Agent
            </Link>
          )}

          {!user && (
            <p className="text-center text-xs text-muted mt-3">
              <Link href="/" className="text-coral hover:underline">Create a free account</Link> to upgrade
            </p>
          )}
        </div>
      </div>

      {/* What the agent does */}
      <div className="bg-cream rounded-3xl border border-border p-8 mb-12">
        <h2 className="font-display text-2xl font-semibold text-center mb-8">What happens when you run the agent</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <Mail size={24} className="text-coral" />,
              title: 'Marketing Agent',
              desc: 'Generates platform-specific posts for X, LinkedIn, Reddit, email, and Product Hunt. You review and approve before anything goes live.',
              time: '~2 min',
            },
            {
              icon: <Search size={24} className="text-purple-600" />,
              title: 'Discovery Agent',
              desc: 'Searches Reddit and Twitter for people actively complaining about the exact problem you solve. Builds a warm prospect list.',
              time: '~3 min',
            },
            {
              icon: <Zap size={24} className="text-green-600" />,
              title: 'Outreach Agent',
              desc: 'Drafts a personalized message for each prospect referencing exactly what they said. You approve and send manually.',
              time: '~2 min',
            },
          ].map(step => (
            <div key={step.title} className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-white border border-border flex items-center justify-center mx-auto mb-4 shadow-card">
                {step.icon}
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-muted text-sm leading-relaxed mb-2">{step.desc}</p>
              <span className="text-xs text-coral font-semibold bg-coral-50 px-3 py-1 rounded-full">Runs in {step.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto">
        <h2 className="font-display text-2xl font-semibold text-center mb-6">Common questions</h2>
        <div className="space-y-4">
          {[
            {
              q: 'Does the agent post or send anything automatically?',
              a: 'No — you always review and approve before anything goes out. The agent does the research and writing, you stay in control.',
            },
            {
              q: 'How often does the agent run?',
              a: 'Once per week automatically, plus you can trigger it manually anytime from your agent dashboard.',
            },
            {
              q: 'What if I have multiple startups?',
              a: 'The agent runs for each approved startup in your account. One $19/month subscription covers all of them.',
            },
            {
              q: 'Can I cancel anytime?',
              a: 'Yes. Cancel anytime from your dashboard. You keep access until the end of your billing period.',
            },
            {
              q: 'Is my startup data used to train AI?',
              a: 'No. Your pitch and startup details are only used to generate content for your specific agent runs.',
            },
          ].map(faq => (
            <div key={faq.q} className="bg-white rounded-2xl border border-border p-6">
              <p className="font-semibold text-sm text-ink mb-2">{faq.q}</p>
              <p className="text-muted text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      {!isAgent && (
        <div className="text-center mt-12">
          <button
            onClick={handleUpgrade}
            disabled={loading || !user}
            className="bg-coral text-white font-semibold px-10 py-4 rounded-full shadow-coral hover:bg-coral-600 transition-all hover:-translate-y-0.5 disabled:opacity-60 text-lg inline-flex items-center gap-2"
          >
            <Zap size={18} />
            {loading ? 'Activating...' : 'Get Agent — $19/mo'}
          </button>
          <p className="text-xs text-muted mt-3">Cancel anytime. No contracts.</p>
        </div>
      )}
    </div>
  )
}
