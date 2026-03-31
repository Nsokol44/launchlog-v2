'use client'
import { useState } from 'react'
import { getSupabaseBrowser } from '@/lib/supabase-browser'
import { Check, X, Trash2, ExternalLink, Search, Filter } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

const STATUS_FILTERS = ['all', 'pending', 'approved', 'rejected']

export default function AdminClient({ startups: initial, swipeMap }) {
  const [startups, setStartups] = useState(initial)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('pending')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [loading, setLoading] = useState({})

  const supabase = getSupabaseBrowser()

  // ── Filters ───────────────────────────────────────────────────
  const categories = ['all', ...new Set(startups.map(s => s.category).filter(Boolean))]

  const filtered = startups.filter(s => {
    const matchSearch = !search ||
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.tagline?.toLowerCase().includes(search.toLowerCase()) ||
      s.founder_name?.toLowerCase().includes(search.toLowerCase()) ||
      s.city?.toLowerCase().includes(search.toLowerCase())

    const matchStatus =
      statusFilter === 'all' ? true :
      statusFilter === 'pending' ? !s.approved && !s.rejected :
      statusFilter === 'approved' ? s.approved :
      statusFilter === 'rejected' ? s.rejected : true

    const matchCat = categoryFilter === 'all' || s.category === categoryFilter

    return matchSearch && matchStatus && matchCat
  })

  // ── Stats ─────────────────────────────────────────────────────
  const stats = {
    total:    startups.length,
    pending:  startups.filter(s => !s.approved && !s.rejected).length,
    approved: startups.filter(s => s.approved).length,
    rejected: startups.filter(s => s.rejected).length,
  }

  // ── Actions ───────────────────────────────────────────────────
  const setLoaded = (id, val) => setLoading(prev => ({ ...prev, [id]: val }))

  const approve = async (startup) => {
    setLoaded(startup.id, 'approving')
    try {
      const { error } = await supabase
        .from('startups')
        .update({ approved: true, rejected: false })
        .eq('id', startup.id)
      if (error) throw error
      setStartups(prev => prev.map(s => s.id === startup.id ? { ...s, approved: true, rejected: false } : s))
      toast.success(`✅ ${startup.name} approved`)
    } catch (err) { toast.error(err.message) }
    finally { setLoaded(startup.id, null) }
  }

  const reject = async (startup) => {
    setLoaded(startup.id, 'rejecting')
    try {
      const { error } = await supabase
        .from('startups')
        .update({ approved: false, rejected: true })
        .eq('id', startup.id)
      if (error) throw error
      setStartups(prev => prev.map(s => s.id === startup.id ? { ...s, approved: false, rejected: true } : s))
      toast.success(`❌ ${startup.name} rejected`)
    } catch (err) { toast.error(err.message) }
    finally { setLoaded(startup.id, null) }
  }

  const deleteStartup = async (startup) => {
    if (!confirm(`Permanently delete ${startup.name}? This cannot be undone.`)) return
    setLoaded(startup.id, 'deleting')
    try {
      const { error } = await supabase.from('startups').delete().eq('id', startup.id)
      if (error) throw error
      setStartups(prev => prev.filter(s => s.id !== startup.id))
      toast.success(`🗑️ ${startup.name} deleted`)
    } catch (err) { toast.error(err.message) }
    finally { setLoaded(startup.id, null) }
  }

  const undoReject = async (startup) => {
    setLoaded(startup.id, 'undoing')
    try {
      const { error } = await supabase
        .from('startups')
        .update({ approved: false, rejected: false })
        .eq('id', startup.id)
      if (error) throw error
      setStartups(prev => prev.map(s => s.id === startup.id ? { ...s, approved: false, rejected: false } : s))
      toast.success(`↩️ ${startup.name} moved back to pending`)
    } catch (err) { toast.error(err.message) }
    finally { setLoaded(startup.id, null) }
  }

  return (
    <div className="max-w-5xl mx-auto px-5 py-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold mb-1">Admin Panel</h1>
        <p className="text-muted text-sm">Manage startup submissions and platform content.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total',    val: stats.total,    color: 'text-ink',         bg: 'bg-white'       },
          { label: 'Pending',  val: stats.pending,  color: 'text-yellow-600',  bg: 'bg-yellow-50'   },
          { label: 'Approved', val: stats.approved, color: 'text-green-600',   bg: 'bg-green-50'    },
          { label: 'Rejected', val: stats.rejected, color: 'text-red-500',     bg: 'bg-red-50'      },
        ].map(s => (
          <button
            key={s.label}
            onClick={() => setStatusFilter(s.label.toLowerCase())}
            className={`${s.bg} rounded-2xl border border-border p-5 text-center transition-all hover:shadow-card ${statusFilter === s.label.toLowerCase() ? 'ring-2 ring-coral' : ''}`}
          >
            <div className={`font-display text-3xl font-bold ${s.color}`}>{s.val}</div>
            <div className="text-xs text-muted mt-1 font-medium">{s.label}</div>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        {/* Search */}
        <div className="flex-1 min-w-48 relative">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search by name, founder, city..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border border-border rounded-full pl-10 pr-4 py-2.5 text-sm bg-white focus:outline-none focus:border-coral transition-colors"
          />
        </div>

        {/* Status filter */}
        <div className="flex bg-white border border-border rounded-full p-1 gap-1">
          {STATUS_FILTERS.map(f => (
            <button key={f} onClick={() => setStatusFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${statusFilter === f ? 'bg-coral text-white' : 'text-muted hover:text-ink'}`}>
              {f}
            </button>
          ))}
        </div>

        {/* Category filter */}
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="border border-border rounded-full px-4 py-2 text-sm bg-white focus:outline-none focus:border-coral transition-colors"
        >
          {categories.map(c => <option key={c} value={c}>{c === 'all' ? 'All categories' : c}</option>)}
        </select>
      </div>

      {/* Results count */}
      <p className="text-xs text-muted mb-4">
        Showing {filtered.length} of {startups.length} startups
      </p>

      {/* Startup list */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-border">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-muted">No startups match your filters</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map(startup => {
            const swipes = swipeMap[startup.id] || { right: 0, left: 0, save: 0 }
            const total = swipes.right + swipes.left + swipes.save
            const rate = total > 0 ? Math.round((swipes.right / total) * 100) : null
            const isLoading = loading[startup.id]
            const isPending = !startup.approved && !startup.rejected

            return (
              <div key={startup.id} className="bg-white rounded-3xl border border-border shadow-card overflow-hidden">

                {/* Status bar */}
                <div className={`h-1 ${startup.approved ? 'bg-green-400' : startup.rejected ? 'bg-red-400' : 'bg-yellow-400'}`} />

                <div className="p-6">
                  <div className="flex items-start gap-4">

                    {/* Logo */}
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 bg-gray-50 border border-border">
                      {startup.logo_url
                        ? <img src={startup.logo_url} alt={startup.name} className="w-full h-full object-cover rounded-2xl" />
                        : startup.logo_emoji || '🚀'
                      }
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap mb-1">
                        <h3 className="font-display text-lg font-bold">{startup.name}</h3>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          startup.approved ? 'bg-green-100 text-green-700' :
                          startup.rejected ? 'bg-red-100 text-red-600' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {startup.approved ? '✅ Live' : startup.rejected ? '❌ Rejected' : '⏳ Pending'}
                        </span>
                        {startup.category && (
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700">
                            {startup.category}
                          </span>
                        )}
                        {startup.city && (
                          <span className="text-xs text-muted">📍 {startup.city}</span>
                        )}
                      </div>
                      <p className="text-muted text-sm mb-3 leading-relaxed">{startup.tagline}</p>

                      {/* Pitch details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-1">What it does</p>
                          <p className="text-sm text-ink leading-relaxed line-clamp-3">{startup.product}</p>
                        </div>
                        <div className="space-y-2">
                          {startup.target_customer && (
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-0.5">Target customer</p>
                              <p className="text-sm text-ink line-clamp-2">{startup.target_customer}</p>
                            </div>
                          )}
                          {startup.revenue_model && (
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-0.5">Revenue model</p>
                              <p className="text-sm text-ink">{startup.revenue_model}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Meta row */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
                        {startup.founder_name && (
                          <span className="flex items-center gap-1">
                            👤 {startup.founder_name}
                          </span>
                        )}
                        {startup.stage && (
                          <span className="flex items-center gap-1">
                            📈 {startup.stage}
                          </span>
                        )}
                        <span>
                          🗓️ {new Date(startup.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        {total > 0 && (
                          <span className="flex items-center gap-1">
                            🚀 {swipes.right} supports · 👎 {swipes.left} passes
                            {rate !== null && <span className="text-coral font-semibold ml-1">({rate}% rate)</span>}
                          </span>
                        )}
                        {startup.website_url && (
                          <a href={startup.website_url} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1 text-coral hover:underline">
                            🌐 Website
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-border">
                    {isPending && (
                      <>
                        <button
                          onClick={() => approve(startup)}
                          disabled={!!isLoading}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition-all disabled:opacity-60"
                        >
                          <Check size={15} />
                          {isLoading === 'approving' ? 'Approving...' : 'Approve'}
                        </button>
                        <button
                          onClick={() => reject(startup)}
                          disabled={!!isLoading}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-all disabled:opacity-60"
                        >
                          <X size={15} />
                          {isLoading === 'rejecting' ? 'Rejecting...' : 'Reject'}
                        </button>
                      </>
                    )}

                    {startup.approved && (
                      <button
                        onClick={() => reject(startup)}
                        disabled={!!isLoading}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-red-200 text-red-500 text-sm font-semibold hover:bg-red-50 transition-all disabled:opacity-60"
                      >
                        <X size={15} />
                        {isLoading === 'rejecting' ? 'Rejecting...' : 'Unpublish'}
                      </button>
                    )}

                    {startup.rejected && (
                      <button
                        onClick={() => undoReject(startup)}
                        disabled={!!isLoading}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-border text-muted text-sm font-semibold hover:border-coral hover:text-coral transition-all disabled:opacity-60"
                      >
                        {isLoading === 'undoing' ? 'Moving...' : '↩️ Move to pending'}
                      </button>
                    )}

                    <Link
                      href={`/startup/${startup.id}`}
                      target="_blank"
                      className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-border text-muted text-sm font-medium hover:border-coral hover:text-coral transition-all ml-auto"
                    >
                      <ExternalLink size={14} /> View profile
                    </Link>

                    <button
                      onClick={() => deleteStartup(startup)}
                      disabled={!!isLoading}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-border text-muted text-sm hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-all disabled:opacity-60"
                      title="Permanently delete"
                    >
                      <Trash2 size={14} />
                      {isLoading === 'deleting' ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
