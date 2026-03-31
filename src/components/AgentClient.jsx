'use client'
import { useEffect, useState } from 'react'
import { getSupabaseBrowser } from '@/lib/supabase-browser'
import { useAuth } from './AuthProvider'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Zap, Globe, Copy, Check, Send, X, RefreshCw } from 'lucide-react'

const PLATFORM_META = {
  twitter:     { label: 'X / Twitter',   icon: '🐦', color: 'bg-sky-50 border-sky-200 text-sky-700'        },
  linkedin:    { label: 'LinkedIn',       icon: '💼', color: 'bg-blue-50 border-blue-200 text-blue-700'     },
  reddit:      { label: 'Reddit',         icon: '🤖', color: 'bg-orange-50 border-orange-200 text-orange-700'},
  email:       { label: 'Email',          icon: '📧', color: 'bg-green-50 border-green-200 text-green-700'  },
  producthunt: { label: 'Product Hunt',   icon: '🚀', color: 'bg-red-50 border-red-200 text-red-700'        },
}

const TABS = ['Overview', 'Marketing', 'Prospects', 'Outreach']

export default function AgentClient() {
  const { user, profile } = useAuth()
  const isSubscribed = profile?.subscription_tier === 'agent' || profile?.subscription_tier === 'pro' || profile?.is_admin
  const [startups, setStartups] = useState([])
  const [selectedStartup, setSelectedStartup] = useState(null)
  const [activeTab, setActiveTab] = useState('Overview')
  const [runs, setRuns] = useState([])
  const [marketing, setMarketing] = useState([])
  const [prospects, setProspects] = useState([])
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [running, setRunning] = useState(false)
  const [copiedId, setCopiedId] = useState(null)
  const [expandedProspect, setExpandedProspect] = useState(null)

  const supabase = getSupabaseBrowser()

  useEffect(() => {
    if (user) loadStartups()
  }, [user])

  useEffect(() => {
    if (selectedStartup) loadAgentData(selectedStartup.id)
  }, [selectedStartup])

  const loadStartups = async () => {
    const { data } = await supabase
      .from('startups')
      .select('*')
      .eq('founder_id', user.id)
      .eq('approved', true)
      .order('created_at', { ascending: false })
    setStartups(data || [])
    if (data?.length > 0) setSelectedStartup(data[0])
    setLoading(false)
  }

  const loadAgentData = async (startupId) => {
    const [runsRes, marketingRes, prospectsRes, reportRes] = await Promise.all([
      supabase.from('agent_runs').select('*').eq('startup_id', startupId).order('created_at', { ascending: false }).limit(5),
      supabase.from('agent_marketing').select('*').eq('startup_id', startupId).order('created_at', { ascending: false }),
      supabase.from('agent_prospects').select('*').eq('startup_id', startupId).order('created_at', { ascending: false }),
      supabase.from('agent_reports').select('*').eq('startup_id', startupId).order('week_of', { ascending: false }).limit(1).single(),
    ])
    setRuns(runsRes.data || [])
    setMarketing(marketingRes.data || [])
    setProspects(prospectsRes.data || [])
    setReport(reportRes.data || null)
  }

  const runAgent = async () => {
    if (!selectedStartup) return
    setRunning(true)
    toast.loading('Agent is working... this takes 30-60 seconds', { id: 'agent-run', duration: 60000 })
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/agent-orchestrator`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ startup_id: selectedStartup.id, triggered_by: 'manual' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Agent failed')
      toast.success('Agent completed! Refreshing results...', { id: 'agent-run' })
      setTimeout(() => loadAgentData(selectedStartup.id), 2000)
    } catch (err) {
      toast.error(err.message, { id: 'agent-run' })
    } finally {
      setRunning(false)
    }
  }

  const approveMarketing = async (item) => {
    const { error } = await supabase.from('agent_marketing')
      .update({ status: 'approved', approved_at: new Date().toISOString() })
      .eq('id', item.id)
    if (!error) {
      setMarketing(prev => prev.map(m => m.id === item.id ? { ...m, status: 'approved' } : m))
      toast.success('Approved! Ready to copy and post.')
    }
  }

  const rejectMarketing = async (item) => {
    const { error } = await supabase.from('agent_marketing').update({ status: 'rejected' }).eq('id', item.id)
    if (!error) setMarketing(prev => prev.map(m => m.id === item.id ? { ...m, status: 'rejected' } : m))
  }

  const approveOutreach = async (prospect) => {
    const { error } = await supabase.from('agent_prospects')
      .update({ outreach_status: 'approved' })
      .eq('id', prospect.id)
    if (!error) {
      setProspects(prev => prev.map(p => p.id === prospect.id ? { ...p, outreach_status: 'approved' } : p))
      toast.success('Outreach approved! Copy and send manually.')
    }
  }

  const skipProspect = async (prospect) => {
    const { error } = await supabase.from('agent_prospects').update({ outreach_status: 'skipped' }).eq('id', prospect.id)
    if (!error) setProspects(prev => prev.map(p => p.id === prospect.id ? { ...p, outreach_status: 'skipped' } : p))
  }

  const markSent = async (prospect) => {
    const { error } = await supabase.from('agent_prospects')
      .update({ outreach_status: 'sent', sent_at: new Date().toISOString() })
      .eq('id', prospect.id)
    if (!error) {
      setProspects(prev => prev.map(p => p.id === prospect.id ? { ...p, outreach_status: 'sent' } : p))
      toast.success('Marked as sent!')
    }
  }

  const copyText = async (text, id) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    toast.success('Copied!')
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (!user) return (
    <div className="max-w-xl mx-auto px-5 py-20 text-center">
      <div className="text-5xl mb-5">🤖</div>
      <h2 className="font-display text-2xl font-bold mb-3">Sign in to access your agent</h2>
      <Link href="/" className="bg-coral text-white font-semibold px-6 py-3 rounded-full shadow-coral hover:bg-coral-600 transition-all">Go home</Link>
    </div>
  )

  // ── Paywall gate ──────────────────────────────────────────────
  if (!isSubscribed) return (
    <div className="max-w-2xl mx-auto px-5 py-20 text-center">
      <div className="text-6xl mb-6">🤖</div>
      <h1 className="font-display text-4xl font-bold mb-3">AI Growth Agent</h1>
      <p className="text-muted text-lg leading-relaxed mb-8 max-w-lg mx-auto">
        The agent handles your marketing content, finds warm prospects, and drafts personalized outreach — automatically. Upgrade to unlock it.
      </p>

      {/* Feature preview */}
      <div className="bg-white rounded-3xl border border-border p-7 mb-8 text-left space-y-4">
        {[
          { icon: '📝', title: 'Marketing content',    desc: 'Ready-to-post content for X, LinkedIn, Reddit, email, and Product Hunt'   },
          { icon: '🔍', title: 'Customer discovery',   desc: 'Finds people on Reddit & Twitter actively expressing your exact pain point' },
          { icon: '✉️', title: 'Personalized outreach', desc: 'Drafts a message per prospect referencing exactly what they said'          },
        ].map(f => (
          <div key={f.title} className="flex items-start gap-4">
            <div className="text-2xl flex-shrink-0">{f.icon}</div>
            <div>
              <p className="font-semibold text-sm text-ink">{f.title}</p>
              <p className="text-muted text-sm">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <Link
        href="/upgrade"
        className="inline-flex items-center gap-2 bg-coral text-white font-semibold px-10 py-4 rounded-full shadow-coral hover:bg-coral-600 transition-all hover:-translate-y-0.5 text-lg"
      >
        <Zap size={18} /> Unlock Agent — $19/mo
      </Link>
      <p className="text-xs text-muted mt-3">Cancel anytime. No contracts.</p>
    </div>
  )

  if (loading) return <div className="flex items-center justify-center h-64"><div className="text-4xl animate-bounce">🤖</div></div>

  if (startups.length === 0) return (
    <div className="max-w-xl mx-auto px-5 py-20 text-center">
      <div className="text-5xl mb-5">🚀</div>
      <h2 className="font-display text-2xl font-bold mb-3">No approved startups yet</h2>
      <p className="text-muted mb-6">You need an approved startup listing to use the agent.</p>
      <Link href="/list" className="bg-coral text-white font-semibold px-6 py-3 rounded-full shadow-coral hover:bg-coral-600 transition-all">List your startup →</Link>
    </div>
  )

  const pendingMarketing = marketing.filter(m => m.status === 'pending')
  const approvedMarketing = marketing.filter(m => m.status === 'approved')
  const readyProspects = prospects.filter(p => p.outreach_status === 'draft_ready')
  const approvedProspects = prospects.filter(p => p.outreach_status === 'approved')
  const sentProspects = prospects.filter(p => p.outreach_status === 'sent')

  return (
    <div className="max-w-4xl mx-auto px-5 py-12">

      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-coral flex items-center justify-center text-white text-xl">🤖</div>
            <h1 className="font-display text-4xl font-bold">AI Growth Agent</h1>
          </div>
          <p className="text-muted">
            Handles marketing, customer discovery, and outreach automatically.
            {selectedStartup && (
              <span className="ml-2 text-coral font-medium">
                Running for: {selectedStartup.logo_emoji || '🚀'} {selectedStartup.name}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Startup selector — always visible */}
          <select
            value={selectedStartup?.id || ''}
            onChange={e => setSelectedStartup(startups.find(s => s.id === e.target.value))}
            className="border border-border rounded-full px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-coral max-w-48 truncate"
          >
            {startups.map(s => <option key={s.id} value={s.id}>{s.logo_emoji || '🚀'} {s.name}</option>)}
          </select>
          <button
            onClick={isSubscribed ? runAgent : () => window.location.href = '/upgrade'}
            disabled={running}
            className="flex items-center gap-2 bg-coral text-white font-semibold px-6 py-2.5 rounded-full shadow-coral hover:bg-coral-600 transition-all disabled:opacity-60 text-sm"
          >
            {running ? <><RefreshCw size={15} className="animate-spin" /> Running...</> : <><Zap size={15} /> {isSubscribed ? 'Run Agent' : 'Upgrade to Run'}</>}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-cream border border-border rounded-full p-1 mb-8 w-fit">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeTab === tab ? 'bg-coral text-white shadow-sm' : 'text-muted hover:text-ink'}`}>
            {tab}
            {tab === 'Marketing' && pendingMarketing.length > 0 && (
              <span className="ml-2 bg-white text-coral text-xs font-bold px-1.5 py-0.5 rounded-full">{pendingMarketing.length}</span>
            )}
            {tab === 'Outreach' && readyProspects.length > 0 && (
              <span className="ml-2 bg-white text-coral text-xs font-bold px-1.5 py-0.5 rounded-full">{readyProspects.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {activeTab === 'Overview' && (
        <div className="space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Posts generated',   val: marketing.length,         color: 'text-coral'       },
              { label: 'Awaiting approval', val: pendingMarketing.length,  color: 'text-yellow-600'  },
              { label: 'Prospects found',   val: prospects.length,         color: 'text-purple-600'  },
              { label: 'Outreach sent',     val: sentProspects.length,     color: 'text-green-600'   },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-2xl border border-border p-5 text-center">
                <div className={`font-display text-3xl font-bold ${s.color}`}>{s.val}</div>
                <div className="text-xs text-muted mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Report */}
          {report && (
            <div className="bg-white rounded-3xl border border-border p-7">
              <h3 className="font-display text-lg font-semibold mb-3">📊 Latest report</h3>
              <p className="text-sm text-ink leading-relaxed mb-3">{report.summary}</p>
              {report.recommendations && (
                <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4">
                  <p className="text-xs font-semibold text-purple-700 mb-1">💡 Recommendations</p>
                  <p className="text-sm text-purple-800 leading-relaxed">{report.recommendations}</p>
                </div>
              )}
            </div>
          )}

          {/* Recent runs */}
          <div className="bg-white rounded-3xl border border-border p-7">
            <h3 className="font-display text-lg font-semibold mb-4">Agent history</h3>
            {runs.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-3xl mb-3">🤖</div>
                <p className="text-muted text-sm">No runs yet. Click "Run Agent" to get started.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {runs.map(run => (
                  <div key={run.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${run.status === 'complete' ? 'bg-green-400' : run.status === 'running' ? 'bg-yellow-400 animate-pulse' : 'bg-red-400'}`} />
                      <span className="text-sm font-medium capitalize">{run.triggered_by} run</span>
                      <span className="text-xs text-muted">{run.status}</span>
                    </div>
                    <span className="text-xs text-muted">{new Date(run.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* How it works */}
          <div className="bg-gradient-to-br from-coral-50 to-purple-50 rounded-3xl border border-border p-7">
            <h3 className="font-display text-lg font-semibold mb-4">How the agent works</h3>
            <div className="space-y-4">
              {[
                { icon: '📝', title: 'Marketing Agent', desc: 'Generates ready-to-post content for X, LinkedIn, Reddit, email, and Product Hunt. You review and approve before anything goes live.' },
                { icon: '🔍', title: 'Discovery Agent', desc: 'Searches Reddit and Twitter for people actively complaining about the problem you solve. Builds a list of warm prospects.' },
                { icon: '✉️', title: 'Outreach Agent', desc: 'Drafts personalized messages for each prospect based on exactly what they said. You approve and send manually — you\'re always in control.' },
              ].map(s => (
                <div key={s.title} className="flex gap-4">
                  <div className="text-2xl flex-shrink-0">{s.icon}</div>
                  <div>
                    <p className="font-semibold text-sm text-ink">{s.title}</p>
                    <p className="text-sm text-muted leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── MARKETING TAB ── */}
      {activeTab === 'Marketing' && (
        <div className="space-y-4">
          {marketing.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-border">
              <div className="text-4xl mb-3">📝</div>
              <p className="font-display text-xl font-semibold mb-2">No content yet</p>
              <p className="text-muted text-sm mb-6">Run the agent to generate marketing content for your startup.</p>
              <button onClick={runAgent} disabled={running}
                className="bg-coral text-white font-semibold px-6 py-3 rounded-full shadow-coral hover:bg-coral-600 transition-all disabled:opacity-60">
                {running ? 'Running...' : 'Run Agent'}
              </button>
            </div>
          ) : (
            marketing.filter(m => m.status !== 'rejected').map(item => {
              const meta = PLATFORM_META[item.platform] || { label: item.platform, icon: '📄', color: 'bg-gray-50 border-gray-200 text-gray-700' }
              let displayContent = item.content
              try {
                const parsed = JSON.parse(item.content)
                if (Array.isArray(parsed)) displayContent = parsed.join('\n\n---\n\n')
                else if (typeof parsed === 'object') displayContent = Object.entries(parsed).map(([k, v]) => `**${k}**\n${Array.isArray(v) ? v.map(i => `• ${i}`).join('\n') : v}`).join('\n\n')
              } catch {}

              return (
                <div key={item.id} className={`bg-white rounded-3xl border overflow-hidden ${item.status === 'approved' ? 'border-green-300' : 'border-border'}`}>
                  <div className={`flex items-center justify-between px-6 py-4 border-b border-border`}>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${meta.color}`}>
                        {meta.icon} {meta.label}
                      </span>
                      {item.status === 'approved' && <span className="text-xs text-green-600 font-semibold">✅ Approved</span>}
                      {item.status === 'pending' && <span className="text-xs text-yellow-600 font-semibold">⏳ Needs review</span>}
                    </div>
                    <button onClick={() => copyText(item.content, item.id)}
                      className="flex items-center gap-1.5 text-xs text-muted hover:text-coral transition-colors">
                      {copiedId === item.id ? <Check size={13} /> : <Copy size={13} />}
                      {copiedId === item.id ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <div className="px-6 py-5">
                    <pre className="text-sm text-ink leading-relaxed whitespace-pre-wrap font-sans">{displayContent}</pre>
                  </div>
                  {item.status === 'pending' && (
                    <div className="px-6 py-4 border-t border-border flex gap-3">
                      <button onClick={() => approveMarketing(item)}
                        className="px-5 py-2 rounded-full bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition-all">
                        ✅ Approve
                      </button>
                      <button onClick={() => rejectMarketing(item)}
                        className="px-5 py-2 rounded-full border border-border text-muted text-sm hover:border-red-300 hover:text-red-500 transition-all">
                        Skip
                      </button>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      )}

      {/* ── PROSPECTS TAB ── */}
      {activeTab === 'Prospects' && (
        <div className="space-y-4">
          {prospects.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-border">
              <div className="text-4xl mb-3">🔍</div>
              <p className="font-display text-xl font-semibold mb-2">No prospects yet</p>
              <p className="text-muted text-sm mb-6">Run the agent to find potential customers actively looking for your solution.</p>
              <button onClick={runAgent} disabled={running}
                className="bg-coral text-white font-semibold px-6 py-3 rounded-full shadow-coral hover:bg-coral-600 transition-all disabled:opacity-60">
                {running ? 'Running...' : 'Run Agent'}
              </button>
            </div>
          ) : (
            prospects.filter(p => p.outreach_status !== 'skipped').map(prospect => (
              <div key={prospect.id} className="bg-white rounded-3xl border border-border overflow-hidden">
                <div className="flex items-start gap-4 p-6">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-sm flex-shrink-0">
                    {prospect.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <span className="font-semibold text-sm text-ink">{prospect.name}</span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full capitalize">{prospect.platform}</span>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        prospect.outreach_status === 'sent' ? 'bg-green-100 text-green-700' :
                        prospect.outreach_status === 'approved' ? 'bg-blue-100 text-blue-700' :
                        prospect.outreach_status === 'draft_ready' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {prospect.outreach_status === 'sent' ? '✅ Sent' :
                         prospect.outreach_status === 'approved' ? '👍 Approved' :
                         prospect.outreach_status === 'draft_ready' ? '📝 Draft ready' : '🔍 Discovered'}
                      </span>
                    </div>
                    <p className="text-sm text-muted leading-relaxed mb-2">{prospect.context}</p>
                    {prospect.pain_point && (
                      <div className="bg-red-50 border border-red-100 rounded-xl px-3 py-2 inline-block">
                        <p className="text-xs text-red-700"><span className="font-semibold">Pain point:</span> {prospect.pain_point}</p>
                      </div>
                    )}
                    {prospect.profile_url && (
                      <a href={prospect.profile_url} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-coral hover:underline mt-2 inline-block">View profile →</a>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── OUTREACH TAB ── */}
      {activeTab === 'Outreach' && (
        <div className="space-y-4">
          {prospects.filter(p => p.outreach_draft && p.outreach_status !== 'skipped').length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-border">
              <div className="text-4xl mb-3">✉️</div>
              <p className="font-display text-xl font-semibold mb-2">No outreach drafts yet</p>
              <p className="text-muted text-sm mb-6">Run the agent to discover prospects and generate personalized outreach messages.</p>
              <button onClick={runAgent} disabled={running}
                className="bg-coral text-white font-semibold px-6 py-3 rounded-full shadow-coral hover:bg-coral-600 transition-all disabled:opacity-60">
                {running ? 'Running...' : 'Run Agent'}
              </button>
            </div>
          ) : (
            prospects
              .filter(p => p.outreach_draft && p.outreach_status !== 'skipped')
              .map(prospect => (
                <div key={prospect.id} className={`bg-white rounded-3xl border overflow-hidden ${
                  prospect.outreach_status === 'sent' ? 'border-green-300' :
                  prospect.outreach_status === 'approved' ? 'border-blue-300' : 'border-border'
                }`}>
                  <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xs">
                        {prospect.name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-ink">{prospect.name}</p>
                        <p className="text-xs text-muted capitalize">{prospect.platform}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        prospect.outreach_status === 'sent' ? 'bg-green-100 text-green-700' :
                        prospect.outreach_status === 'approved' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {prospect.outreach_status === 'sent' ? '✅ Sent' :
                         prospect.outreach_status === 'approved' ? '👍 Approved — ready to send' : '⏳ Needs review'}
                      </span>
                    </div>
                  </div>

                  <div className="px-6 py-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">Draft message</p>
                    <div className="bg-cream rounded-2xl p-4 text-sm text-ink leading-relaxed">
                      {prospect.outreach_draft}
                    </div>
                    {prospect.pain_point && (
                      <p className="text-xs text-muted mt-3">
                        <span className="font-semibold">Why they match:</span> {prospect.pain_point}
                      </p>
                    )}
                  </div>

                  <div className="px-6 py-4 border-t border-border flex flex-wrap gap-2">
                    <button onClick={() => copyText(prospect.outreach_draft, prospect.id)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-border text-sm font-medium hover:border-coral hover:text-coral transition-all">
                      {copiedId === prospect.id ? <Check size={13} /> : <Copy size={13} />}
                      {copiedId === prospect.id ? 'Copied' : 'Copy message'}
                    </button>

                    {prospect.profile_url && (
                      <a href={prospect.profile_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-border text-sm font-medium hover:border-coral hover:text-coral transition-all">
                        <Globe size={13} /> View profile
                      </a>
                    )}

                    {prospect.outreach_status === 'draft_ready' && (
                      <button onClick={() => approveOutreach(prospect)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition-all">
                        ✅ Approve
                      </button>
                    )}

                    {prospect.outreach_status === 'approved' && (
                      <button onClick={() => markSent(prospect)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-coral text-white text-sm font-semibold shadow-coral hover:bg-coral-600 transition-all">
                        <Send size={13} /> Mark as sent
                      </button>
                    )}

                    {prospect.outreach_status !== 'sent' && (
                      <button onClick={() => skipProspect(prospect)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-border text-muted text-sm hover:border-red-300 hover:text-red-500 transition-all">
                        <X size={13} /> Skip
                      </button>
                    )}
                  </div>
                </div>
              ))
          )}
        </div>
      )}
    </div>
  )
}
