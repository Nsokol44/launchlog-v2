'use client'
import { useState, useEffect } from 'react'
import { getSupabaseBrowser } from '@/lib/supabase-browser'
import { useAuth } from './AuthProvider'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Copy, Check, RefreshCw, Sparkles, ChevronDown, ChevronUp, Save, Zap } from 'lucide-react'

const QUESTIONS = [
  {
    id: 'company_description',
    label: 'Company Description',
    hint: '2 sentences max. What you do and who you serve.',
    icon: '🏢',
    prompt: (s) => `Write a 2-sentence company description for a funding application for this startup:
Company: ${s.name}
What it does: ${s.product}
Target customer: ${s.target_customer || 'not specified'}
Tagline: ${s.tagline}

Requirements: First sentence says what the company does and for whom. Second sentence says how it delivers value or what makes it different. No jargon. Under 50 words total.`,
  },
  {
    id: 'problem',
    label: 'Problem Being Solved',
    hint: 'The pain, who has it, and how acute it is.',
    icon: '🎯',
    prompt: (s) => `Write a compelling "problem statement" section for a funding application for this startup:
Company: ${s.name}
What it does: ${s.product}
Target customer: ${s.target_customer || 'not specified'}
Category: ${s.category}

Requirements: 3-4 sentences. Name who has the pain, describe the pain specifically, quantify if possible, explain what they do today that fails them. No solution language yet — this is only the problem. Compelling and specific.`,
  },
  {
    id: 'solution',
    label: 'Solution & How It Works',
    hint: 'What you built and what the user experiences.',
    icon: '💡',
    prompt: (s) => `Write a "solution" section for a funding application for this startup:
Company: ${s.name}
Product: ${s.product}
Target customer: ${s.target_customer || 'not specified'}
Revenue model: ${s.revenue_model || 'not specified'}

Requirements: 3-4 sentences. Describe what the product is, how it works from the user's perspective, and what outcome it delivers. Focus on the user experience, not the technology. End with the measurable benefit.`,
  },
  {
    id: 'target_customer',
    label: 'Target Customer / ICP',
    hint: 'Specific description of your ideal customer.',
    icon: '👤',
    prompt: (s) => `Write a "target customer" or "ideal customer profile" section for a funding application:
Company: ${s.name}
Product: ${s.product}
Known target customer: ${s.target_customer || 'not specified'}
Category: ${s.category}
Stage: ${s.stage || 'early stage'}

Requirements: 2-3 sentences. Be hyper-specific — name the job title or persona, the company size or context, the behavior that makes them a fit, and what they currently use instead. Specific beats generic. No marketing language.`,
  },
  {
    id: 'market_size',
    label: 'Market Size (TAM/SAM/SOM)',
    hint: 'Bottom-up calculation of the opportunity.',
    icon: '📊',
    prompt: (s) => `Write a "market size" section for a funding application for this startup:
Company: ${s.name}
Product: ${s.product}
Target customer: ${s.target_customer || 'not specified'}
Category: ${s.category}

Requirements: Calculate TAM (total addressable market globally), SAM (serviceable addressable market — realistic reach), and SOM (obtainable market in years 1-3). Show the math: number of potential customers × average annual spend. Use realistic publicly available market data where applicable. 3-4 sentences with numbers.`,
  },
  {
    id: 'traction',
    label: 'Traction to Date',
    hint: 'Revenue, customers, growth, and proof points.',
    icon: '📈',
    prompt: (s) => `Write a "traction" section for a funding application for this startup:
Company: ${s.name}
Stage: ${s.stage || 'early stage'}
Revenue model: ${s.revenue_model || 'not specified'}

Requirements: This should be punchy and specific. Lead with the strongest metric first. Include: revenue or MRR if applicable, customer count, growth rate, key partnerships, awards, or notable milestones. If early stage, list user signups, LOIs, pilots, or waitlist numbers. Every claim should be a number. 3-4 sentences.`,
  },
  {
    id: 'business_model',
    label: 'Business Model',
    hint: 'How you make money, pricing, and unit economics.',
    icon: '💰',
    prompt: (s) => `Write a "business model" section for a funding application for this startup:
Company: ${s.name}
Revenue model: ${s.revenue_model || 'not specified'}
Product: ${s.product}
Target customer: ${s.target_customer || 'not specified'}

Requirements: 3-4 sentences. Describe how the company makes money, the pricing model, and the unit economics if known. Include revenue lines if multiple exist. Explain why this model is appropriate for the customer type. End with the path to scale.`,
  },
  {
    id: 'competitive_advantage',
    label: 'Competitive Advantage',
    hint: 'What makes you defensibly different.',
    icon: '🏆',
    prompt: (s) => `Write a "competitive advantage" section for a funding application for this startup:
Company: ${s.name}
Product: ${s.product}
Category: ${s.category}
Target customer: ${s.target_customer || 'not specified'}

Requirements: 3-4 sentences. Identify the main alternatives or competitors. Explain specifically why this startup wins against them. Focus on structural advantages — not just "better" but why it's hard to replicate. End with a moat statement.`,
  },
  {
    id: 'why_now',
    label: 'Why Now',
    hint: 'Market timing and the window of opportunity.',
    icon: '⏰',
    prompt: (s) => `Write a "why now" section for a funding application for this startup:
Company: ${s.name}
Product: ${s.product}
Category: ${s.category}

Requirements: 3-4 sentences. Explain what has changed in the last 2-3 years that makes this the right moment — technology shifts, regulatory changes, market forces, cultural trends. Why would this have failed 5 years ago? What makes the window open now? Be specific with real-world events or trends.`,
  },
  {
    id: 'team',
    label: 'Team & Why You',
    hint: "Why your team is uniquely qualified to win.",
    icon: '👥',
    prompt: (s) => `Write a "team" section for a funding application for this startup:
Company: ${s.name}
Founder: ${s.founder_name || 'the founder'}
Product: ${s.product}
Category: ${s.category}

Requirements: 3-4 sentences. Explain why the founder and team are the right people to build this specific company. Focus on domain expertise, relevant past experience, unfair advantages, and any prior wins. Connect the team's background directly to the problem. If there are gaps, briefly address how they're being filled.`,
  },
  {
    id: 'use_of_funds',
    label: 'Use of Funds',
    hint: 'What you will do with the money and why.',
    icon: '🎯',
    prompt: (s) => `Write a "use of funds" section for a funding application for this startup:
Company: ${s.name}
Stage: ${s.stage || 'early stage'}
Product: ${s.product}

Requirements: 3-4 sentences. Describe the 3-4 most important things the funding will be used for, in priority order. Each item should connect directly to a milestone or outcome (not just categories like "marketing"). End with what success looks like 12-18 months after funding.`,
  },
  {
    id: 'impact',
    label: 'Impact & Mission',
    hint: 'The broader change you are creating in the world.',
    icon: '🌍',
    prompt: (s) => `Write an "impact and mission" section for a funding application for this startup:
Company: ${s.name}
What it does: ${s.product}
Target customer: ${s.target_customer || 'not specified'}
Category: ${s.category}

Requirements: 3-4 sentences. Describe the broader positive change this startup creates beyond just making money — for customers, communities, or the world. Be specific and measurable where possible. Avoid generic sustainability language. Connect the mission to the actual product outcome.`,
  },
  {
    id: 'elevator_pitch',
    label: '2-Minute Elevator Pitch',
    hint: 'A compelling narrative version of your whole story.',
    icon: '🎤',
    prompt: (s) => `Write a compelling 2-minute elevator pitch (approximately 250-300 words, spoken aloud) for this startup:
Company: ${s.name}
Tagline: ${s.tagline}
Product: ${s.product}
Target customer: ${s.target_customer || 'not specified'}
Revenue model: ${s.revenue_model || 'not specified'}
Stage: ${s.stage || 'early stage'}
Category: ${s.category}

Requirements: Start with a vivid problem scenario the listener can feel. Then introduce the company and solution naturally. Cover: what it does, who it's for, why now, traction headline, and the ask. End with a memorable closing line. Use conversational language — this is spoken, not read. No bullet points.`,
  },
]

export default function AppKitClient() {
  const { user, profile } = useAuth()
  const supabase = getSupabaseBrowser()
  const isAgent = profile?.subscription_tier === 'agent' || profile?.subscription_tier === 'pro' || profile?.is_admin

  const [startups, setStartups] = useState([])
  const [selectedStartup, setSelectedStartup] = useState(null)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [generatingId, setGeneratingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [copiedId, setCopiedId] = useState(null)
  const [copiedPromptId, setCopiedPromptId] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [showPromptId, setShowPromptId] = useState(null)
  const [kitId, setKitId] = useState(null)

  useEffect(() => { if (user) loadStartups() }, [user])
  useEffect(() => { if (selectedStartup) loadKit(selectedStartup.id) }, [selectedStartup])

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

  const loadKit = async (startupId) => {
    const { data } = await supabase
      .from('founder_appkit')
      .select('*')
      .eq('startup_id', startupId)
      .eq('founder_id', user.id)
      .single()
    if (data) {
      setAnswers(data.answers || {})
      setKitId(data.id)
    } else {
      setAnswers({})
      setKitId(null)
    }
  }

  const saveKit = async (updatedAnswers) => {
    setSaving(true)
    try {
      const payload = {
        startup_id: selectedStartup.id,
        founder_id: user.id,
        answers: updatedAnswers,
        updated_at: new Date().toISOString(),
      }
      if (kitId) {
        await supabase.from('founder_appkit').update(payload).eq('id', kitId)
      } else {
        const { data } = await supabase.from('founder_appkit').insert([payload]).select().single()
        if (data) setKitId(data.id)
      }
    } catch (err) {
      toast.error('Save failed: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const generateAll = async () => {
    if (!isAgent) {
      toast.error('Upgrade to Agent tier to use AI generation')
      return
    }
    setGenerating(true)
    toast.loading('Generating all answers... this takes about 30 seconds', { id: 'gen-all', duration: 60000 })
    try {
      const newAnswers = { ...answers }
      await Promise.allSettled(
        QUESTIONS.map(async (q) => {
          const answer = await callClaude(q.prompt(selectedStartup))
          if (answer) newAnswers[q.id] = answer
        })
      )
      setAnswers(newAnswers)
      await saveKit(newAnswers)
      toast.success('All answers generated!', { id: 'gen-all' })
    } catch (err) {
      toast.error('Generation failed: ' + err.message, { id: 'gen-all' })
    } finally {
      setGenerating(false)
    }
  }

  const generateOne = async (question) => {
    if (!isAgent) {
      toast.error('Upgrade to Agent tier to use AI generation')
      return
    }
    setGeneratingId(question.id)
    try {
      const answer = await callClaude(question.prompt(selectedStartup))
      if (answer) {
        const newAnswers = { ...answers, [question.id]: answer }
        setAnswers(newAnswers)
        await saveKit(newAnswers)
        toast.success(`${question.label} generated!`)
      }
    } catch (err) {
      toast.error('Generation failed: ' + err.message)
    } finally {
      setGeneratingId(null)
    }
  }

  const callClaude = async (prompt) => {
    const { data: { session } } = await supabase.auth.getSession()
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/appkit-generator`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({ prompt }),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Generation failed')
    return data.answer
  }

  const updateAnswer = (id, value) => {
    const newAnswers = { ...answers, [id]: value }
    setAnswers(newAnswers)
  }

  const copyAnswer = async (id, text) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    toast.success('Copied!')
    setTimeout(() => setCopiedId(null), 2000)
  }

  const copyPrompt = async (id, prompt) => {
    await navigator.clipboard.writeText(prompt)
    setCopiedPromptId(id)
    toast.success('Prompt copied! Paste into Claude, ChatGPT, or any AI.')
    setTimeout(() => setCopiedPromptId(null), 2000)
  }

  const copyAll = async () => {
    const text = QUESTIONS
      .filter(q => answers[q.id])
      .map(q => `=== ${q.label} ===\n${answers[q.id]}`)
      .join('\n\n')
    await navigator.clipboard.writeText(text)
    toast.success('All answers copied!')
  }

  if (!user) return (
    <div className="max-w-xl mx-auto px-5 py-20 text-center">
      <div className="text-5xl mb-5">📋</div>
      <h2 className="font-display text-2xl font-bold mb-3">Sign in to access your Application Kit</h2>
      <Link href="/" className="bg-coral text-white font-semibold px-6 py-3 rounded-full shadow-coral hover:bg-coral-600 transition-all">Go home</Link>
    </div>
  )

  if (loading) return <div className="flex items-center justify-center h-64"><div className="text-4xl animate-bounce">📋</div></div>

  if (startups.length === 0) return (
    <div className="max-w-xl mx-auto px-5 py-20 text-center">
      <div className="text-5xl mb-5">🚀</div>
      <h2 className="font-display text-2xl font-bold mb-3">No approved startups yet</h2>
      <p className="text-muted mb-6">List your startup first to generate your application kit.</p>
      <Link href="/list" className="bg-coral text-white font-semibold px-6 py-3 rounded-full shadow-coral hover:bg-coral-600 transition-all">List your startup →</Link>
    </div>
  )

  const answeredCount = QUESTIONS.filter(q => answers[q.id]).length

  return (
    <div className="max-w-4xl mx-auto px-5 py-12">

      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-2xl">📋</div>
            <h1 className="font-display text-4xl font-bold">Application Kit</h1>
          </div>
          <p className="text-muted">Pre-written answers to every funding application question. Copy, paste, win.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {startups.length > 1 && (
            <select
              value={selectedStartup?.id || ''}
              onChange={e => setSelectedStartup(startups.find(s => s.id === e.target.value))}
              className="border border-border rounded-full px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-coral"
            >
              {startups.map(s => <option key={s.id} value={s.id}>{s.logo_emoji || '🚀'} {s.name}</option>)}
            </select>
          )}
          {answeredCount > 0 && (
            <button onClick={copyAll}
              className="flex items-center gap-2 border border-border bg-white text-ink font-medium px-4 py-2.5 rounded-full hover:border-coral hover:text-coral transition-all text-sm">
              <Copy size={14} /> Copy all
            </button>
          )}
          <button
            onClick={generateAll}
            disabled={generating || !isAgent}
            className="flex items-center gap-2 bg-coral text-white font-semibold px-5 py-2.5 rounded-full shadow-coral hover:bg-coral-600 transition-all disabled:opacity-60 text-sm"
          >
            {generating
              ? <><RefreshCw size={14} className="animate-spin" /> Generating...</>
              : <><Sparkles size={14} /> {isAgent ? 'Generate all with AI' : 'Upgrade to generate'}</>
            }
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-3xl border border-border p-5 mb-8">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-ink">{answeredCount} of {QUESTIONS.length} questions answered</p>
          {saving && <p className="text-xs text-muted">Saving...</p>}
        </div>
        <div className="h-2 bg-cream rounded-full overflow-hidden">
          <div className="h-full bg-coral rounded-full transition-all duration-500"
            style={{ width: `${(answeredCount / QUESTIONS.length) * 100}%` }} />
        </div>
        {!isAgent && (
          <div className="mt-4 flex items-center justify-between bg-purple-50 border border-purple-200 rounded-2xl px-4 py-3">
            <div className="flex items-center gap-2">
              <Sparkles size={15} className="text-purple-600" />
              <p className="text-sm text-purple-800 font-medium">Upgrade to Agent to generate answers with AI instantly</p>
            </div>
            <Link href="/upgrade" className="text-xs font-bold text-purple-700 bg-white border border-purple-200 px-3 py-1.5 rounded-full hover:bg-purple-100 transition-all flex items-center gap-1">
              <Zap size={11} /> Upgrade
            </Link>
          </div>
        )}
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {QUESTIONS.map(q => {
          const isExpanded = expandedId === q.id
          const hasAnswer = !!answers[q.id]
          const isGenThis = generatingId === q.id
          const promptText = q.prompt(selectedStartup || {})

          return (
            <div key={q.id} className={`bg-white rounded-3xl border overflow-hidden transition-all ${hasAnswer ? 'border-green-300' : 'border-border'}`}>

              {/* Question header */}
              <div className="flex items-center justify-between px-6 py-4">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : q.id)}
                  className="flex items-center gap-3 flex-1 text-left"
                >
                  <span className="text-xl flex-shrink-0">{q.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm text-ink">{q.label}</p>
                      {hasAnswer && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">✓ Done</span>}
                    </div>
                    <p className="text-xs text-muted">{q.hint}</p>
                  </div>
                  {isExpanded ? <ChevronUp size={16} className="text-muted flex-shrink-0" /> : <ChevronDown size={16} className="text-muted flex-shrink-0" />}
                </button>

                <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                  {hasAnswer && (
                    <button onClick={() => copyAnswer(q.id, answers[q.id])}
                      className="flex items-center gap-1 text-xs text-muted hover:text-coral transition-colors px-2 py-1">
                      {copiedId === q.id ? <Check size={12} /> : <Copy size={12} />}
                      {copiedId === q.id ? 'Copied' : 'Copy'}
                    </button>
                  )}
                  {isAgent && (
                    <button
                      onClick={() => generateOne(q)}
                      disabled={isGenThis}
                      className="flex items-center gap-1 text-xs bg-coral-50 border border-coral-200 text-coral font-medium px-3 py-1.5 rounded-full hover:bg-coral-100 transition-all disabled:opacity-60"
                    >
                      {isGenThis ? <RefreshCw size={11} className="animate-spin" /> : <Sparkles size={11} />}
                      {isGenThis ? 'Writing...' : hasAnswer ? 'Regenerate' : 'Generate'}
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded content */}
              {isExpanded && (
                <div className="px-6 pb-6 border-t border-border pt-5 space-y-4">

                  {/* Answer textarea */}
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-2">Your answer</label>
                    <textarea
                      value={answers[q.id] || ''}
                      onChange={e => updateAnswer(q.id, e.target.value)}
                      onBlur={() => answers[q.id] && saveKit(answers)}
                      placeholder={`Write your ${q.label.toLowerCase()} here, or use AI to generate it...`}
                      className="w-full border border-border rounded-2xl px-4 py-3 text-sm bg-cream focus:outline-none focus:border-coral transition-colors resize-none h-36 leading-relaxed"
                    />
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-muted">{answers[q.id]?.length || 0} characters</p>
                      {answers[q.id] && (
                        <button
                          onClick={() => { copyAnswer(q.id, answers[q.id]) }}
                          className="flex items-center gap-1.5 text-xs font-medium text-coral hover:underline"
                        >
                          {copiedId === q.id ? <Check size={12} /> : <Copy size={12} />}
                          {copiedId === q.id ? 'Copied!' : 'Copy answer'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* AI Prompt section */}
                  <div className="border border-border rounded-2xl overflow-hidden">
                    <button
                      onClick={() => setShowPromptId(showPromptId === q.id ? null : q.id)}
                      className="w-full flex items-center justify-between px-4 py-3 bg-cream hover:bg-cream/80 transition-colors text-left"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">✨</span>
                        <p className="text-xs font-semibold text-muted">Use your own AI — copy this prompt</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); copyPrompt(q.id, promptText) }}
                          className="flex items-center gap-1 text-xs font-medium text-coral bg-coral-50 border border-coral-200 px-3 py-1 rounded-full hover:bg-coral-100 transition-all"
                        >
                          {copiedPromptId === q.id ? <Check size={11} /> : <Copy size={11} />}
                          {copiedPromptId === q.id ? 'Copied!' : 'Copy prompt'}
                        </button>
                        {showPromptId === q.id ? <ChevronUp size={14} className="text-muted" /> : <ChevronDown size={14} className="text-muted" />}
                      </div>
                    </button>

                    {showPromptId === q.id && (
                      <div className="px-4 py-4 border-t border-border">
                        <p className="text-xs text-muted mb-3">Paste this into Claude, ChatGPT, or any AI tool to generate your answer:</p>
                        <pre className="text-xs text-ink leading-relaxed whitespace-pre-wrap font-sans bg-white rounded-xl p-3 border border-border">
                          {promptText}
                        </pre>
                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Bottom save reminder */}
      {answeredCount > 0 && (
        <div className="mt-8 bg-green-50 border border-green-200 rounded-3xl p-6 flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-green-800">{answeredCount} answers saved to your kit</p>
            <p className="text-sm text-green-700 mt-0.5">Your answers are saved automatically as you type and generate.</p>
          </div>
          <button onClick={copyAll}
            className="flex items-center gap-2 bg-green-600 text-white font-semibold px-5 py-2.5 rounded-full hover:bg-green-700 transition-all text-sm flex-shrink-0">
            <Copy size={14} /> Copy all answers
          </button>
        </div>
      )}
    </div>
  )
}
