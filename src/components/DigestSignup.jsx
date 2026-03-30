'use client'
import { useState } from 'react'
import { subscribeDigest } from '@/lib/supabase-browser'
import { CATEGORIES } from '@/lib/constants'
import toast from 'react-hot-toast'

export default function DigestSignup({ compact = false }) {
  const [email, setEmail] = useState('')
  const [interests, setInterests] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)

  const toggleInterest = (val) =>
    setInterests(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val])

  const handleEmailSubmit = (e) => { e.preventDefault(); if (email) setStep(2) }

  const handleFinalSubmit = async () => {
    setLoading(true)
    try {
      await subscribeDigest(email, interests)
      setSubmitted(true)
      toast.success("You're on the list! 🎉")
    } catch (err) { toast.error(err.message) }
    finally { setLoading(false) }
  }

  if (submitted) {
    return (
      <div className={`text-center ${compact ? 'py-4' : 'py-8'}`}>
        <div className="text-3xl mb-2">🎉</div>
        <p className="font-display font-semibold text-ink">You're in!</p>
        <p className="text-muted text-sm mt-1">We'll send you the best new startups every week.</p>
      </div>
    )
  }

  if (compact) {
    return (
      <form onSubmit={handleEmailSubmit} className="flex gap-2">
        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
          placeholder="Your email" required
          className="flex-1 border border-border rounded-full px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-coral transition-colors" />
        <button type="submit"
          className="bg-coral text-white font-semibold px-5 py-2.5 rounded-full shadow-coral hover:bg-coral-600 transition-all text-sm whitespace-nowrap">
          Get digest
        </button>
      </form>
    )
  }

  return (
    <div className="bg-white rounded-3xl border border-border shadow-card p-8">
      <div className="text-center mb-6">
        <div className="text-3xl mb-3">📬</div>
        <h3 className="font-display text-2xl font-bold mb-2">Weekly startup digest</h3>
        <p className="text-muted text-sm leading-relaxed">Get the 5 best new startups in your categories delivered every Monday.</p>
      </div>

      {step === 1 ? (
        <form onSubmit={handleEmailSubmit} className="space-y-3">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com" required
            className="w-full border border-border rounded-2xl px-5 py-3.5 text-sm bg-cream focus:outline-none focus:border-coral transition-colors" />
          <button type="submit"
            className="w-full bg-coral text-white font-semibold py-3.5 rounded-full shadow-coral hover:bg-coral-600 transition-all">
            Continue →
          </button>
        </form>
      ) : (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-3 text-center">What are you interested in?</p>
          <div className="grid grid-cols-3 gap-2 mb-5">
            {CATEGORIES.filter(c => c.value !== 'all').map(cat => (
              <button key={cat.value} type="button" onClick={() => toggleInterest(cat.value)}
                className={`py-2.5 px-2 rounded-2xl border-2 text-center transition-all ${
                  interests.includes(cat.value) ? 'border-coral bg-coral-50 text-coral' : 'border-border bg-white hover:border-coral'
                }`}>
                <div className="text-lg mb-0.5">{cat.icon}</div>
                <div className="text-xs font-medium">{cat.label}</div>
              </button>
            ))}
          </div>
          <button onClick={handleFinalSubmit} disabled={loading}
            className="w-full bg-coral text-white font-semibold py-3.5 rounded-full shadow-coral hover:bg-coral-600 transition-all disabled:opacity-60">
            {loading ? 'Subscribing...' : `Subscribe${interests.length > 0 ? ` (${interests.length} selected)` : ''}`}
          </button>
          <button onClick={() => setStep(1)} className="w-full text-center text-sm text-muted mt-3 hover:text-ink transition-colors">← Back</button>
        </div>
      )}
      <p className="text-xs text-muted text-center mt-4">Free forever. Unsubscribe anytime.</p>
    </div>
  )
}
