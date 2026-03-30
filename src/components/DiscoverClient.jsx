'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Bookmark } from 'lucide-react'
import toast from 'react-hot-toast'
import SwipeCard from './SwipeCard'
import FeedbackModal from './FeedbackModal'
import CommunityModal from './CommunityModal'
import DigestSignup from './DigestSignup'
import { CATEGORIES } from '@/lib/constants'
import { recordSwipe, saveStartup, fetchStartups } from '@/lib/supabase-browser'

export default function DiscoverClient({ initialStartups }) {
  const [allStartups, setAllStartups] = useState(initialStartups)
  const [category, setCategory] = useState('all')
  const [cityFilter, setCityFilter] = useState('')
  const [dismissed, setDismissed] = useState(new Set())
  const [feedbackTarget, setFeedbackTarget] = useState(null)
  const [communityTarget, setCommunityTarget] = useState(null)

  const visible = useMemo(() => {
    return allStartups
      .filter(s => !dismissed.has(s.id))
      .filter(s => category === 'all' || s.category === category)
      .filter(s => !cityFilter || s.city?.toLowerCase().includes(cityFilter.toLowerCase()))
  }, [allStartups, dismissed, category, cityFilter])

  const topCard = visible[0]

  const handleSwipe = async (startup, direction) => {
    setDismissed(prev => new Set([...prev, startup.id]))
    if (direction === 'right') {
      setCommunityTarget(startup)
      try { await recordSwipe({ startup_id: startup.id, direction: 'right' }) } catch {}
    } else {
      setFeedbackTarget(startup)
    }
  }

  const handleSave = async () => {
    if (!topCard) return
    setDismissed(prev => new Set([...prev, topCard.id]))
    toast.success(`🔖 ${topCard.name} saved`)
    try { await saveStartup(topCard.id) } catch (e) { toast.error(e.message) }
  }

  const triggerSwipe = (direction) => {
    if (topCard) handleSwipe(topCard, direction)
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <div className="text-center py-16 px-5 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-white border border-border rounded-full px-4 py-2 text-sm font-medium text-coral mb-6">
          ✨ New startups added daily
        </div>
        <h1 className="font-display text-5xl md:text-6xl font-bold text-ink leading-tight tracking-tight mb-4">
          Find solutions you <em className="text-coral not-italic">actually</em> want
        </h1>
        <p className="text-muted text-lg leading-relaxed mb-8 font-light">
          Swipe through early-stage startups solving real problems. Support the ones you love, leave feedback on the rest.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <a href="#swipe" className="bg-coral text-white font-semibold px-8 py-3.5 rounded-full shadow-coral hover:bg-coral-600 transition-all hover:-translate-y-0.5">
            Start Swiping →
          </a>
          <Link href="/list" className="bg-white text-ink font-medium px-8 py-3.5 rounded-full border border-border hover:border-coral hover:text-coral transition-all">
            List your startup
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="border-y border-border bg-white py-8">
        <div className="flex justify-center gap-12 md:gap-20 flex-wrap px-5">
          {[
            { num: `${allStartups.length}+`, label: 'Startups listed' },
            { num: '18k',  label: 'Community members' },
            { num: '94k',  label: 'Swipes this month'  },
            { num: '62',   label: 'Cities represented' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="font-display text-3xl font-bold text-ink">{s.num}</div>
              <div className="text-muted text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Swipe area */}
      <div id="swipe" className="max-w-2xl mx-auto px-5 py-12">
        {/* Category filter */}
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">Browse by category</p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button key={cat.value} onClick={() => setCategory(cat.value)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                  category === cat.value
                    ? 'border-coral bg-coral-50 text-coral'
                    : 'border-border bg-white text-ink hover:border-coral hover:bg-coral-50 hover:text-coral'
                }`}>
                <span>{cat.icon}</span> {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-semibold">Today's Startups</h2>
          <div className="flex items-center gap-3">
            <input type="text" placeholder="Filter by city..."
              value={cityFilter} onChange={e => setCityFilter(e.target.value)}
              className="text-sm border border-border rounded-full px-4 py-2 bg-white focus:outline-none focus:border-coral transition-colors w-36" />
            <span className="text-sm text-muted bg-white border border-border px-4 py-2 rounded-full">
              {visible.length} remaining
            </span>
          </div>
        </div>

        {/* Card stack */}
        {visible.length === 0 ? (
          <div className="h-96 flex items-center justify-center text-center">
            <div>
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="font-display text-2xl font-semibold mb-2">You've seen everything!</h3>
              <p className="text-muted text-sm mb-6">Check back tomorrow for fresh startups.</p>
              <Link href="/list" className="bg-coral text-white font-semibold px-6 py-3 rounded-full shadow-coral hover:bg-coral-600 transition-all">
                List your own startup →
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="relative h-[480px] mb-8">
              {visible.slice(0, 3).map((startup, i) => (
                <SwipeCard key={startup.id} startup={startup} isTop={i === 0} stackIndex={i} onSwipe={handleSwipe} />
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex justify-center items-center gap-5">
              <button onClick={() => triggerSwipe('left')} className="flex flex-col items-center gap-2 group">
                <div className="w-16 h-16 rounded-full bg-red-50 border-2 border-red-200 flex items-center justify-center text-2xl transition-all group-hover:bg-red-100 group-hover:scale-110 group-hover:shadow-lg">👎</div>
                <span className="text-xs text-muted font-medium">Pass</span>
              </button>
              <button onClick={handleSave} className="flex flex-col items-center gap-2 group">
                <div className="w-12 h-12 rounded-full bg-purple-50 border-2 border-purple-200 flex items-center justify-center transition-all group-hover:bg-purple-100 group-hover:scale-110">
                  <Bookmark size={18} className="text-purple-600" />
                </div>
                <span className="text-xs text-muted font-medium">Save</span>
              </button>
              <button onClick={() => triggerSwipe('right')} className="flex flex-col items-center gap-2 group">
                <div className="w-16 h-16 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center text-2xl transition-all group-hover:bg-green-100 group-hover:scale-110 group-hover:shadow-lg">🚀</div>
                <span className="text-xs text-muted font-medium">Support</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Digest + CTA */}
      <div className="max-w-2xl mx-auto px-5 pb-8">
        <DigestSignup />
      </div>
      <div className="max-w-2xl mx-auto px-5 pb-16">
        <div className="bg-gradient-to-br from-coral-50 to-purple-50 rounded-3xl border border-border p-7 flex flex-col md:flex-row items-center justify-between gap-5">
          <div>
            <h3 className="font-display text-xl font-semibold mb-1">Building something? 🚀</h3>
            <p className="text-muted text-sm leading-relaxed">Get in front of real people who care about new products. Free to list.</p>
          </div>
          <Link href="/list" className="bg-coral text-white font-semibold px-6 py-3 rounded-full shadow-coral hover:bg-coral-600 transition-all whitespace-nowrap flex-shrink-0">
            List your startup →
          </Link>
        </div>
      </div>

      {/* Modals */}
      {feedbackTarget && <FeedbackModal startup={feedbackTarget} onClose={() => setFeedbackTarget(null)} />}
      {communityTarget && (
        <CommunityModal startup={communityTarget} onClose={() => { setCommunityTarget(null); toast.success('🚀 Support added! Keep swiping.') }} />
      )}
    </div>
  )
}
