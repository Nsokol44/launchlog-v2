'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getSupabaseBrowser, uploadLogo } from '@/lib/supabase-browser'
import { useAuth } from './AuthProvider'
import { TrendingUp, MessageSquare, ThumbsDown, ThumbsUp, Bookmark, Share2, ExternalLink, ChevronDown, ChevronUp, Pencil, Trash2, X, Save } from 'lucide-react'
import ShareModal from './ShareModal'
import DigestSignup from './DigestSignup'
import { CATEGORIES, STAGES } from '@/lib/constants'
import toast from 'react-hot-toast'

const TIME_FILTERS = [
  { label: 'This week',  days: 7  },
  { label: 'This month', days: 30 },
  { label: 'All time',   days: 0  },
]

const COMMUNITY_FIELDS = [
  { key: 'website_url',   label: 'Website',     icon: '🌐' },
  { key: 'discord_url',   label: 'Discord',     icon: '🎮' },
  { key: 'slack_url',     label: 'Slack',       icon: '💬' },
  { key: 'instagram_url', label: 'Instagram',   icon: '📸' },
  { key: 'twitter_url',   label: 'X / Twitter', icon: '🐦' },
  { key: 'linkedin_url',  label: 'LinkedIn',    icon: '💼' },
  { key: 'tiktok_url',    label: 'TikTok',      icon: '🎵' },
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
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [editLogoFile, setEditLogoFile] = useState(null)
  const [editLogoPreview, setEditLogoPreview] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => { if (user) loadData() }, [user, timePeriod])

  const loadData = async () => {
    setLoading(true)
    const supabase = getSupabaseBrowser()
    try {
      const { data: myStartups } = await supabase
        .from('startups')
        .select('*')
        .eq('founder_id', user.id)
        .order('created_at', { ascending: false })
      setStartups(myStartups || [])

      if (myStartups?.length) {
        const ids = myStartups.map(s => s.id)
        let q = supabase.from('swipes')
          .select('startup_id, direction, feedback_reason, feedback_note')
          .in('startup_id', ids)
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
          if (s.feedback_note) {
            if (!ft[s.startup_id]) ft[s.startup_id] = []
            ft[s.startup_id].push(s.feedback_note)
          }
        }
        setSwipeStats(stats)
        setFreeText(ft)
      }
    } finally { setLoading(false) }
  }

  const startEdit = (startup) => {
    setEditingId(startup.id)
    setEditForm({ ...startup })
    setEditLogoFile(null)
    setEditLogoPreview(null)
  }
  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({})
    setEditLogoFile(null)
    setEditLogoPreview(null)
  }
  const setField = (key, val) => setEditForm(f => ({ ...f, [key]: val }))

  const saveEdit = async () => {
    if (!editForm.name || !editForm.tagline || !editForm.product) {
      toast.error('Name, tagline and product are required'); return
    }
    setSaving(true)
    const supabase = getSupabaseBrowser()
    try {
      // Upload new logo if provided, passing existing URL so old one gets deleted
      let logo_url = editForm.logo_url
      if (editLogoFile) {
        logo_url = await uploadLogo(editLogoFile, editForm.name, editForm.logo_url)
      }

      const { error } = await supabase.from('startups').update({
        name: editForm.name, tagline: editForm.tagline, category: editForm.category,
        city: editForm.city, stage: editForm.stage, product: editForm.product,
        target_customer: editForm.target_customer, revenue_model: editForm.revenue_model,
        founder_name: editForm.founder_name, logo_emoji: editForm.logo_emoji,
        logo_url,
        website_url: editForm.website_url, discord_url: editForm.discord_url,
        slack_url: editForm.slack_url, instagram_url: editForm.instagram_url,
        twitter_url: editForm.twitter_url, linkedin_url: editForm.linkedin_url,
        tiktok_url: editForm.tiktok_url,
      }).eq('id', editForm.id).eq('founder_id', user.id)
      if (error) throw error
      setStartups(prev => prev.map(s => s.id === editForm.id ? { ...s, ...editForm, logo_url } : s))
      setEditingId(null); setEditForm({}); setEditLogoFile(null); setEditLogoPreview(null)
      toast.success('Startup updated!')
    } catch (err) { toast.error(err.message) }
    finally { setSaving(false) }
  }

  const confirmDelete = (id) => setDeleteConfirmId(id)
  const cancelDelete = () => setDeleteConfirmId(null)

  const deleteStartup = async (id) => {
    setDeleting(true)
    const supabase = getSupabaseBrowser()
    try {
      const { error } = await supabase.from('startups').delete().eq('id', id).eq('founder_id', user.id)
      if (error) throw error
      setStartups(prev => prev.filter(s => s.id !== id))
      setDeleteConfirmId(null)
      toast.success('Startup deleted')
    } catch (err) { toast.error(err.message) }
    finally { setDeleting(false) }
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
            const isEditing = editingId === startup.id
            const isDeleteConfirm = deleteConfirmId === startup.id
            const feedbackCounts = stats.feedback.reduce((acc, r) => { acc[r] = (acc[r] || 0) + 1; return acc }, {})
            const topFeedback = Object.entries(feedbackCounts).sort((a, b) => b[1] - a[1]).slice(0, 4)

            return (
              <div key={startup.id} className="bg-white rounded-3xl border border-border shadow-card overflow-hidden">

                {/* Header */}
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
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => setShareTarget(startup)} className="p-2 rounded-xl hover:bg-cream text-muted hover:text-coral transition-all" title="Share"><Share2 size={16} /></button>
                    <Link href={`/startup/${startup.id}`} className="p-2 rounded-xl hover:bg-cream text-muted hover:text-coral transition-all" title="View profile"><ExternalLink size={16} /></Link>
                    <button onClick={() => isEditing ? cancelEdit() : startEdit(startup)}
                      className={`p-2 rounded-xl transition-all ${isEditing ? 'bg-coral-50 text-coral' : 'hover:bg-cream text-muted hover:text-coral'}`}
                      title={isEditing ? 'Cancel' : 'Edit'}>
                      {isEditing ? <X size={16} /> : <Pencil size={16} />}
                    </button>
                    <button onClick={() => isDeleteConfirm ? cancelDelete() : confirmDelete(startup.id)}
                      className={`p-2 rounded-xl transition-all ${isDeleteConfirm ? 'bg-red-50 text-red-500' : 'hover:bg-red-50 text-muted hover:text-red-500'}`}
                      title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Delete confirm */}
                {isDeleteConfirm && (
                  <div className="px-6 py-4 bg-red-50 border-b border-red-100 flex items-center justify-between gap-4 flex-wrap">
                    <p className="text-sm text-red-700 font-medium">Permanently delete {startup.name} and all its data?</p>
                    <div className="flex gap-2">
                      <button onClick={cancelDelete} className="px-4 py-2 rounded-full border border-red-200 text-sm text-red-700 hover:bg-red-100 transition-all">Cancel</button>
                      <button onClick={() => deleteStartup(startup.id)} disabled={deleting}
                        className="px-4 py-2 rounded-full bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-all disabled:opacity-60">
                        {deleting ? 'Deleting...' : 'Yes, delete'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Edit form */}
                {isEditing && (
                  <div className="p-6 border-b border-border bg-cream/50">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">Edit startup</p>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <EditField label="Name *" value={editForm.name} onChange={v => setField('name', v)} />
                      <EditField label="Tagline *" value={editForm.tagline} onChange={v => setField('tagline', v)} />
                      <EditField label="City" value={editForm.city} onChange={v => setField('city', v)} />
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">Stage</label>
                        <select value={editForm.stage || ''} onChange={e => setField('stage', e.target.value)}
                          className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-coral">
                          <option value="">Select stage</option>
                          {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>

                    {/* Logo upload */}
                    <div className="mb-4">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Logo</label>
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl bg-gray-50 border border-border flex-shrink-0">
                          {editLogoPreview
                            ? <img src={editLogoPreview} alt="preview" className="w-full h-full object-cover rounded-2xl" />
                            : editForm.logo_url
                            ? <img src={editForm.logo_url} alt="logo" className="w-full h-full object-cover rounded-2xl" />
                            : editForm.logo_emoji || '🚀'
                          }
                        </div>
                        <label className="flex-1 cursor-pointer">
                          <div className="border-2 border-dashed border-border rounded-xl px-4 py-3 text-center hover:border-coral hover:bg-coral-50 transition-all bg-cream">
                            <p className="text-sm text-muted">
                              <span className="text-coral font-medium">Upload new logo</span> to replace existing
                            </p>
                            <p className="text-xs text-muted mt-0.5">PNG, JPG up to 2MB</p>
                          </div>
                          <input type="file" accept="image/*" className="hidden" onChange={e => {
                            const f = e.target.files?.[0]
                            if (!f) return
                            setEditLogoFile(f)
                            const reader = new FileReader()
                            reader.onload = ev => setEditLogoPreview(ev.target.result)
                            reader.readAsDataURL(f)
                          }} />
                        </label>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Category</label>
                      <div className="flex flex-wrap gap-2">
                        {CATEGORIES.filter(c => c.value !== 'all').map(cat => (
                          <button key={cat.value} type="button" onClick={() => setField('category', cat.value)}
                            className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${editForm.category === cat.value ? 'border-coral bg-coral-50 text-coral' : 'border-border bg-white hover:border-coral'}`}>
                            {cat.icon} {cat.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3 mb-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">What it does *</label>
                        <textarea value={editForm.product || ''} onChange={e => setField('product', e.target.value)}
                          className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-coral resize-none h-20" />
                      </div>
                      <EditField label="Target customer" value={editForm.target_customer} onChange={v => setField('target_customer', v)} />
                      <EditField label="Revenue model" value={editForm.revenue_model} onChange={v => setField('revenue_model', v)} />
                      <EditField label="Founder name" value={editForm.founder_name} onChange={v => setField('founder_name', v)} />
                    </div>
                    <div className="mb-5">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Community channels</label>
                      <div className="space-y-2">
                        {COMMUNITY_FIELDS.map(f => (
                          <div key={f.key} className="flex items-center gap-2">
                            <span className="text-lg w-7 text-center flex-shrink-0">{f.icon}</span>
                            <input type="url" value={editForm[f.key] || ''} onChange={e => setField(f.key, e.target.value)}
                              placeholder={f.label}
                              className="flex-1 border border-border rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:border-coral" />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-3 justify-end">
                      <button onClick={cancelEdit} className="px-5 py-2.5 rounded-full border border-border text-sm font-medium hover:border-coral hover:text-coral transition-all">Cancel</button>
                      <button onClick={saveEdit} disabled={saving}
                        className="px-5 py-2.5 rounded-full bg-coral text-white text-sm font-semibold shadow-coral hover:bg-coral-600 transition-all disabled:opacity-60 flex items-center gap-2">
                        <Save size={14} />{saving ? 'Saving...' : 'Save changes'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Stats */}
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

                {/* Support rate */}
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

                {/* Feedback */}
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
                          <span key={reason} className="text-xs bg-red-50 text-red-700 border border-red-200 rounded-full px-3 py-1 font-medium">{reason} ×{count}</span>
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

function EditField({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">{label}</label>
      <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-coral transition-colors" />
    </div>
  )
}
