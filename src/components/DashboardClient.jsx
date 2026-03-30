'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getSupabaseBrowser } from '@/lib/supabase-browser'
import { useAuth } from './AuthProvider'
import { TrendingUp, MessageSquare, ThumbsDown, ThumbsUp, Bookmark, Share2, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import ShareModal from './ShareModal'
import DigestSignup from './DigestSignup'

const TIME_FILTERS = [
  { label: 'This week',  days: 7  },
  { label: 'This month', days: 30 },
  { label: 'All time',   days: 0  },
]

export default function DashboardClient() {
  const { user } = useAuth()
  const [startups, setStartups] = useState([])
  const [swipeStats, setSwipeStats] = useState({})
  const [freeText, setFreeText] = useState({})
  const [loading, setLoading] = useState(true)
  const [timePeriod, setTimePeriod] = useState(7)
  const [shareTarget, setShareTarget] = useState(null)
  const [expandedFeedback, setExpandedFeedback] = useState({})

  useEffect(() => { if (user) loadData() }, [user, timePeriod])

  const loadData = async () => {
    setLoading(true)
    const supabase = getSupabaseBrowser()
    try {
      const { data: myStartups } = await supabase.from('startups').select('*').eq('founder_id', user.id).order('created_at', { ascending: false })
      setStartups(myStartups || [])

      if (myStartups?.length) {
        const ids = myStartups.map(s => s.id)
        let q = supabase.from('swipes').select('startup_id, direction, feedback_reason, feedback_note').in('startup_id', ids)
        if (timePeriod > 0) {
          const since = new Date(Date.now() - timePeriod * 24 * 60 * 60 * 1000).toISOString()
          q = q.gte('created_at', since)
        }
        const { data: swipes } = await q
        const stats = {}
        const ft = {}
        for (const s of (swipes || [])) {
          if (!stats[s.startup_id]) stats[s.startup_id] = { right: 0, left: 0, save: 0, feedback: [] }
          stats[s.startup_id][s.direction]++
          if (s.feedback_reason) stats[s.startup_id].feedback.push(s.feedback_reason)
          if (s.feedback_note) { if (!ft[s.startup_id]) ft[s.startup_id] = []; ft[s.startup_id].push(s.feedback_note) }
        }
        setSwipeStats(stats)
        setFreeText(ft)
      }
    } finally { setLoading(false) }
  }

  if (!user) return (
    <div className="max-w-xl mx-auto px-5 py-20 text-center">
      <div className="text-5xl mb-5">🔒</div>
      <h2 className="font-display text-2xl font-bold mb-3">Sign in to view your dashboard</h2>
      <Link href="/" className="bg-coral text-white font-semibold px-6 py-3 rounded-full shadow-coral hover:bg-coral-600 transition-all">Go home</Link>
    </div>
  )

  if (loading) return <div className="flex items-center justify-center h-64"><div className="text-4xl animate-bounce">📊</div></div>

  const totals = Object.values(swipeStats).reduce((acc, s) => ({ right: acc.right + s.right, left: acc.left + s.left, save: acc.save + s.save }), { right: 0, left: 0, save: 0 })
  const grandTotal = totals.right + totals.left + totals.save
  const overallRate = grandTotal > 0 ? Math.round((totals.right / grandTotal) * 100) : 0

  return (
    <div className="max-w-3xl mx-auto px-5 py-12">
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-4xl font-bold mb-2">Founder Dashboard</h1>
          <p className="text-muted">Track swipes, feedback, and community growth.</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex bg-white border border-border rounded-full p-1 gap-1">
            {TIME_FILTERS.map(f => (
              <button key={f.days} onClick={() => setTimePeriod(f.days)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${timePeriod === f.days ? 'bg-coral text-white' : 'text-muted hover:text-ink'}`}>
                {f.label}
              </button>
            ))}
          </div>
          <Link href="/list" className="bg-coral text-white font-semibold px-5 py-2.5 rounded-full shadow-coral hover:bg-coral-600 transition-all text-sm">+ Add startup</Link>
        </div>
      </div>

      {/* Overview */}
      {startups.length > 0 && grandTotal > 0 && (
        <div className="bg-white rounded-3xl border border-border shadow-card p-6 mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">Overall performance</p>
          <div className="grid grid-cols-4 gap-4 mb-4">
            {[
              { val: `${overallRate}%`, label: 'Support rate', color: 'text-coral' },
              { val: totals.right, label: '🚀 Supports', color: 'text-green-600' },
              { val: totals.left,  label: '👎 Passes',   color: 'text-red-500'   },
              { val: totals.save,  label: '🔖 Saves',    color: 'text-purple-600' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className={`font-display text-2xl font-bold ${s.color}`}>{s.val}</div>
                <div className="text-xs text-muted mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="h-2 bg-cream rounded-full overflow-hidden">
            <div className="h-full bg-coral rounded-full transition-all duration-700" style={{ width: `${overallRate}%` }} />
          </div>
          <p className="text-xs text-muted mt-2">{grandTotal} total swipes in period</p>
        </div>
      )}

      {startups.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-border">
          <div className="text-5xl mb-4">🚀</div>
          <h3 className="font-display text-2xl font-semibold mb-2">No startups yet</h3>
          <Link href="/list" className="bg-coral text-white font-semibold px-6 py-3 rounded-full shadow-coral hover:bg-coral-600 transition-all">List your startup →</Link>
        </div>
      ) : (
        <div className="space-y-5">
          {startups.map(startup => {
            const stats = swipeStats[startup.id] || { right: 0, left: 0, save: 0, feedback: [] }
            const notes = freeText[startup.id] || []
            const total = stats.right + stats.left + stats.save
            const rate = total > 0 ? Math.round((stats.right / total) * 100) : 0
            const isExpanded = expandedFeedback[startup.id]
            const feedbackCounts = stats.feedback.reduce((acc, r) => { acc[r] = (acc[r] || 0) + 1; return acc }, {})
            const topFeedback = Object.entries(feedbackCounts).sort((a, b) => b[1] - a[1]).slice(0, 4)

            return (
              <div key={startup.id} className="bg-white rounded-3xl border border-border shadow-card overflow-hidden">
                <div className="flex items-start gap-4 p-6 border-b border-border">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 bg-gray-50">
                    {startup.logo_url ? <img src={startup.logo_url} alt={startup.name} className="w-full h-full object-cover rounded-2xl" /> : startup.logo_emoji || '🚀'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-display text-xl font-bold">{startup.name}</h3>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${startup.approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {startup.approved ? '✅ Live' : '⏳ Under review'}
                      </span>
                    </div>
                    <p className="text-muted text-sm mt-1">{startup.tagline}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => setShareTarget(startup)} className="p-2 rounded-xl hover:bg-cream text-muted hover:text-coral transition-all"><Share2 size={16} /></button>
                    <Link href={`/startup/${startup.id}`} className="p-2 rounded-xl hover:bg-cream text-muted hover:text-coral transition-all"><ExternalLink size={16} /></Link>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
                  {[
                    { icon: <TrendingUp size={14} />, label: 'Supporters', val: startup.supporters || 0, color: 'text-coral' },
                    { icon: <ThumbsUp size={14} />,   label: 'Supports',   val: stats.right,             color: 'text-green-600' },
                    { icon: <ThumbsDown size={14} />, label: 'Passes',     val: stats.left,              color: 'text-red-500'   },
                    { icon: <Bookmark size={14} />,   label: 'Saved',      val: stats.save,              color: 'text-purple-600' },
                  ].map(s => (
                    <div key={s.label} className="bg-white px-5 py-4 text-center">
                      <div className={`flex items-center justify-center gap-1 ${s.color} mb-1`}>{s.icon}</div>
                      <div className="font-display text-2xl font-bold text-ink">{s.val.toLocaleString()}</div>
                      <div className="text-xs text-muted">{s.label}</div>
                    </div>
                  ))}
                </div>

                <div className="px-6 py-4 border-b border-border">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted">Support rate</span>
                    <span className="text-sm font-bold text-ink">{total > 0 ? `${rate}%` : '—'}</span>
                  </div>
                  <div className="h-2 bg-cream rounded-full overflow-hidden">
                    <div className="h-full bg-coral rounded-full transition-all duration-700" style={{ width: `${rate}%` }} />
                  </div>
                  <p className="text-xs text-muted mt-1.5">{total} swipes in period</p>
                </div>

                {(topFeedback.length > 0 || notes.length > 0) && (
                  <div className="px-6 py-4">
                    <button onClick={() => setExpandedFeedback(prev => ({ ...prev, [startup.id]: !prev[startup.id] }))}
                      className="flex items-center gap-2 w-full text-left mb-3">
                      <MessageSquare size={14} className="text-muted" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted flex-1">
                        Feedback ({topFeedback.length} reasons{notes.length > 0 ? `, ${notes.length} comments` : ''})
                      </span>
                      {isExpanded ? <ChevronUp size={14} className="text-muted" /> : <ChevronDown size={14} className="text-muted" />}
                    </button>

                    {topFeedback.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {topFeedback.map(([reason, count]) => (
                          <span key={reason} className="text-xs bg-red-50 text-red-700 border border-red-200 rounded-full px-3 py-1 font-medium">
                            {reason} ×{count}
                          </span>
                        ))}
                      </div>
                    )}

                    {isExpanded && notes.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">Comments</p>
                        {notes.map((note, i) => (
                          <div key={i} className="bg-cream border-l-2 border-coral px-4 py-2.5 rounded-r-xl text-sm text-ink leading-relaxed">"{note}"</div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <div className="mt-8">
        <div className="bg-gradient-to-br from-purple-50 to-coral-50 rounded-3xl border border-border p-7">
          <h3 className="font-display text-xl font-semibold mb-2">📬 Get your weekly report by email</h3>
          <p className="text-muted text-sm mb-5 leading-relaxed">Receive swipes and feedback every Monday morning.</p>
          <DigestSignup compact />
        </div>
      </div>

      {shareTarget && <ShareModal startup={shareTarget} onClose={() => setShareTarget(null)} />}
    </div>
  )
}
