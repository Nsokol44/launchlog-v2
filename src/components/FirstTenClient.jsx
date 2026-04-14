'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp, Copy, Check, ExternalLink } from 'lucide-react'

const STEPS = [
  {
    number: '01',
    title: 'Start with who you already know',
    timeframe: 'Day 1–2',
    color: 'bg-coral-50 border-coral-200',
    headerColor: 'text-coral',
    summary: 'Your first customers are closer than you think. Before searching the internet, exhaust your existing network.',
    why: "Most founders skip this step because it feels uncomfortable. Don't. The people who already know and trust you are 10x more likely to give you honest feedback and become early customers than a cold stranger. You are not asking for a favor — you are offering them early access to something that might genuinely help them.",
    actions: [
      'Write down every person you know who fits your target customer profile — LinkedIn, phone contacts, former colleagues, friends of friends.',
      'Aim for 20 names before you contact anyone.',
      'Prioritize people who have complained about the problem you solve. If you\'ve ever heard someone say "I hate dealing with X" and X is what you fix — they go to the top of the list.',
    ],
    scripts: [
      {
        label: 'Text/DM to someone you know well',
        text: "Hey [Name], I'm working on something I think you might actually find useful — [one sentence description]. Would you be up for a 20-minute call this week? I want honest feedback, not validation. Happy to buy you a coffee virtually.",
      },
      {
        label: 'Email to a former colleague',
        text: "Hi [Name],\n\nHope you're doing well. I've been working on [startup name] — a way to [solve specific problem] for [specific person]. I know you've dealt with this before and I'd love 20 minutes of your honest feedback.\n\nNo pitch, no ask. Just trying to understand if I'm solving the right problem.\n\nAre you free [day] or [day]?\n\n— [Your name]",
      },
    ],
    metric: 'Goal: 5 conversations from your existing network',
  },
  {
    number: '02',
    title: 'Go where your customers already are',
    timeframe: 'Day 3–5',
    color: 'bg-purple-50 border-purple-200',
    headerColor: 'text-purple-700',
    summary: "Your customers have communities — Reddit threads, Slack groups, Facebook groups, LinkedIn communities, industry forums. Find them and show up genuinely.",
    why: "This is where the real signal is. When someone posts in r/restaurantowners saying 'inventory management is killing me,' they are telling you exactly what they need. You do not need to pitch them. You need to respond helpfully and start a conversation.",
    actions: [
      'Identify 3–5 communities where your target customer hangs out. Reddit is usually the fastest to find.',
      'Spend one hour reading posts before you write anything. Learn the language they use to describe their problem.',
      'Reply to posts where people are describing the exact pain you solve. Be helpful first, mention your startup only if it\'s directly relevant.',
      'DM anyone who engages with your reply and ask for a 20-minute conversation.',
    ],
    scripts: [
      {
        label: 'Reply to a Reddit post about your problem',
        text: "This is a really common frustration. A few things that have helped people I've talked to: [1-2 genuine tips]. I'm actually building something specifically for this — would you be open to a quick conversation? Not a pitch, genuinely just want to understand how you're dealing with it today.",
      },
      {
        label: 'DM after someone engages with your post',
        text: "Hey, saw you commented on my post about [topic]. Sounds like you've dealt with this too. I'm building [startup] and would love to hear how you currently handle this — 20 minutes, totally informal. Would that work?",
      },
    ],
    metric: 'Goal: 3 conversations from communities',
    communities: [
      { name: 'Reddit', desc: 'Search your problem in Reddit — there\'s almost always a subreddit', url: 'https://reddit.com' },
      { name: 'Facebook Groups', desc: 'Industry-specific groups are often more active than you\'d expect', url: 'https://facebook.com/groups' },
      { name: 'LinkedIn Groups', desc: 'Best for B2B and professional services customers', url: 'https://linkedin.com' },
      { name: 'Slack Communities', desc: 'Industry-specific Slack groups for more engaged audiences', url: 'https://slofile.com' },
    ],
  },
  {
    number: '03',
    title: 'Run the right kind of conversation',
    timeframe: 'Ongoing',
    color: 'bg-blue-50 border-blue-200',
    headerColor: 'text-blue-700',
    summary: "Most founder interviews go wrong because founders do all the talking. The goal is to understand their world, not to pitch yours.",
    why: "The biggest mistake in customer discovery is asking 'would you use this?' People say yes to avoid conflict. Instead, ask about their past behavior and current pain. Past behavior is truth. Future intent is fiction.",
    actions: [
      'Ask about their past, not their hypothetical future.',
      'Listen for emotion — frustration, embarrassment, relief. That\'s where the real pain is.',
      'Never mention your solution until they\'ve described the problem in their own words.',
      'End every call by asking for one referral: "Is there anyone else who deals with this I should talk to?"',
    ],
    questions: [
      { q: 'Walk me through the last time you dealt with [problem].', why: 'Gets specific, recent behavior — not hypotheticals.' },
      { q: 'How are you handling it right now?', why: 'Reveals existing solutions and workarounds.' },
      { q: 'What\'s the worst part about that?', why: 'Surfaces the emotional core of the pain.' },
      { q: 'How much time/money does this cost you?', why: 'Establishes willingness to pay.' },
      { q: 'Have you ever tried to fix this? What happened?', why: 'Shows what they\'ve already rejected.' },
      { q: 'Who else on your team deals with this?', why: 'Identifies other stakeholders and referral opportunities.' },
    ],
    avoid: [
      'Would you use something that did X?',
      'Does this sound like it would help you?',
      'We\'re building X — what do you think?',
      'Would you pay for this?',
    ],
    metric: 'Goal: Leave every call with 1 referral and 3 specific quotes you can use',
  },
  {
    number: '04',
    title: 'Use LaunchLog feedback as customer discovery data',
    timeframe: 'Week 2+',
    color: 'bg-green-50 border-green-200',
    headerColor: 'text-green-700',
    summary: "Every left-swipe with a reason is a free customer interview. Most founders ignore this data. Don't.",
    why: "When someone passes on your startup and says 'pitch wasn't clear enough' or 'not solving a problem I have,' they are telling you something a customer interview would take 20 minutes to reveal. You are getting unfiltered, anonymous feedback from real people — that's genuinely rare.",
    actions: [
      'Check your founder dashboard every week and read every piece of feedback.',
      'Group feedback reasons into themes. If 40% of passes say "pitch not clear," that\'s a message.',
      'Rewrite your pitch to address the top pass reason. Test it. See if the rate improves.',
      'When someone swipes right and joins your community, reach out personally within 24 hours.',
    ],
    scripts: [
      {
        label: 'DM to someone who supported you on LaunchLog',
        text: "Hey [Name], I saw you supported [startup] on LaunchLog — genuinely appreciate it. Would you be open to a 15-minute conversation? I'd love to understand what resonated and what you're hoping the product will do. Happy to give you early access as a thank you.",
      },
    ],
    metric: 'Goal: Reach out to every supporter personally in the first month',
    launchlogTip: true,
  },
  {
    number: '05',
    title: 'Convert conversations into customers',
    timeframe: 'Week 3+',
    color: 'bg-yellow-50 border-yellow-200',
    headerColor: 'text-yellow-700',
    summary: "After 10 conversations, you should know if the problem is real. If it is, the next conversation should end with a commitment — not a maybe.",
    why: "A commitment doesn't have to be money. It can be: agreeing to be a beta user, joining a waitlist, introducing you to their boss, or paying a small deposit. 'I love this idea' without any commitment is not validation. Commitment under any friction is validation.",
    actions: [
      'After 10 discovery conversations, identify your 3 warmest leads — the people who expressed the most pain and showed the most interest.',
      'Follow up with each one specifically referencing what they told you.',
      'Ask for the smallest possible commitment that proves real intent.',
      'If they say yes to being a beta user, get them into the product within 48 hours or you\'ll lose momentum.',
    ],
    scripts: [
      {
        label: 'Follow-up email after a great discovery call',
        text: "Hi [Name],\n\nReally appreciated your time on [day]. When you said [specific thing they said] — that stuck with me, because it's exactly what we're trying to fix.\n\nI'd love to have you try [startup] as one of our first beta users. It would mean a lot and your feedback would directly shape the product.\n\nCan I get you set up this week?\n\n— [Your name]",
      },
      {
        label: 'Ask for a small commitment',
        text: "Based on everything you told me, I think we can genuinely help you with [specific problem]. Would you be willing to try it for 30 days? I just need a yes — I'll handle the setup and check in with you weekly to make sure it's working.",
      },
    ],
    metric: 'Goal: 3 committed beta users who are actively using the product',
  },
  {
    number: '06',
    title: 'Turn beta users into paying customers',
    timeframe: 'Week 4–6',
    color: 'bg-orange-50 border-orange-200',
    headerColor: 'text-orange-700',
    summary: "Free users tell you what they think. Paying customers tell you what it's worth. You need both data points, but paying is the real signal.",
    why: "The goal of the first 10 customers is not revenue — it's proof. Proof that people care enough to give you money. Even $10/month from 3 people is more valuable than 100 free users, because it proves the value exchange is real.",
    actions: [
      'After 4 weeks of using your product for free, have the pricing conversation.',
      'Don\'t apologize for charging. Confident pricing is a signal of a real product.',
      'If they push back on price, ask what would make it worth that price — not whether the price is right.',
      'Document every paying customer\'s exact use case. These become your best testimonials.',
    ],
    scripts: [
      {
        label: 'The pricing conversation',
        text: "You've been using [startup] for a few weeks now. I want to start transitioning to our paid plan — it's [price] per month. Based on what you told me about [problem], I think that's a fair trade for what it saves you. Does that work for you?",
      },
      {
        label: 'If they hesitate',
        text: "That\'s fair — what would make it clearly worth [price] to you? I want to make sure the product gets there before I ask you to commit.",
      },
    ],
    metric: 'Goal: 1 paying customer. Then 3. Then 10.',
  },
]

const TRACKING_TEMPLATE = [
  { col: 'Name', width: 'w-32' },
  { col: 'Source', width: 'w-24' },
  { col: 'Date contacted', width: 'w-32' },
  { col: 'Status', width: 'w-28' },
  { col: 'Key insight', width: 'w-48' },
  { col: 'Next action', width: 'w-36' },
]

export default function FirstTenClient() {
  const [expandedStep, setExpandedStep] = useState(0)
  const [copiedScript, setCopiedScript] = useState(null)
  const [showTracker, setShowTracker] = useState(false)

  const copyScript = async (text, id) => {
    await navigator.clipboard.writeText(text)
    setCopiedScript(id)
    setTimeout(() => setCopiedScript(null), 2000)
  }

  return (
    <div className="max-w-3xl mx-auto px-5 py-12">

      {/* Header */}
      <div className="mb-2">
        <Link href="/resources" className="text-muted hover:text-coral text-sm transition-colors">← Back to Resources</Link>
      </div>

      <div className="mt-4 mb-10">
        <div className="inline-flex items-center gap-2 bg-coral-50 border border-coral-200 rounded-full px-4 py-2 text-sm font-medium text-coral mb-4">
          🎯 Founder Playbook
        </div>
        <h1 className="font-display text-5xl font-bold text-ink mb-4 tracking-tight leading-tight">
          How to get your first 10 customers
        </h1>
        <p className="text-muted text-xl leading-relaxed font-light max-w-2xl">
          A step-by-step playbook. No theory, no fluff — just the exact actions and scripts that work for early-stage founders.
        </p>

        {/* Stats row */}
        <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-border">
          {[
            { val: '6 steps', label: 'to follow in order' },
            { val: '~6 weeks', label: 'realistic timeline' },
            { val: '8 scripts', label: 'you can copy and use' },
          ].map(s => (
            <div key={s.label}>
              <div className="font-display text-2xl font-bold text-ink">{s.val}</div>
              <div className="text-xs text-muted mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Key principle callout */}
      <div className="bg-ink rounded-3xl p-7 mb-10 text-white">
        <p className="font-display text-xl font-semibold mb-2">The one rule to remember</p>
        <p className="text-white/80 leading-relaxed">
          Never ask "would you use this?" Ask "how do you handle this today?" Past behavior is truth. Future intent is fiction. Every script in this guide follows that principle.
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-4 mb-12">
        {STEPS.map((step, i) => {
          const isOpen = expandedStep === i
          return (
            <div key={step.number} className={`bg-white rounded-3xl border-2 overflow-hidden transition-all ${isOpen ? step.color : 'border-border'}`}>

              {/* Step header */}
              <button
                onClick={() => setExpandedStep(isOpen ? -1 : i)}
                className="w-full flex items-center gap-5 p-6 text-left"
              >
                <div className={`font-display text-3xl font-bold flex-shrink-0 ${isOpen ? step.headerColor : 'text-muted'}`}>
                  {step.number}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-display text-xl font-bold text-ink">{step.title}</h3>
                    <span className="text-xs font-semibold bg-cream border border-border px-3 py-1 rounded-full text-muted">
                      {step.timeframe}
                    </span>
                  </div>
                  <p className="text-muted text-sm mt-1 leading-relaxed">{step.summary}</p>
                </div>
                <div className="flex-shrink-0 text-muted">
                  {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </button>

              {/* Step content */}
              {isOpen && (
                <div className="px-6 pb-7 border-t border-border/50 pt-6 space-y-6">

                  {/* Why */}
                  <div className="bg-white/60 rounded-2xl p-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">Why this matters</p>
                    <p className="text-sm text-ink leading-relaxed">{step.why}</p>
                  </div>

                  {/* Actions */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">What to do</p>
                    <ol className="space-y-2">
                      {step.actions.map((action, j) => (
                        <li key={j} className="flex items-start gap-3 text-sm text-ink leading-relaxed">
                          <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5 ${isOpen ? 'bg-coral' : 'bg-muted'}`}>
                            {j + 1}
                          </span>
                          {action}
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Interview questions */}
                  {step.questions && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">Questions to ask</p>
                      <div className="space-y-3">
                        {step.questions.map((q, j) => (
                          <div key={j} className="bg-white rounded-2xl border border-border p-4">
                            <p className="text-sm font-semibold text-ink mb-1">"{q.q}"</p>
                            <p className="text-xs text-muted">{q.why}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Questions to avoid */}
                  {step.avoid && (
                    <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-red-700 mb-3">❌ Never ask these</p>
                      <ul className="space-y-1.5">
                        {step.avoid.map((q, j) => (
                          <li key={j} className="text-sm text-red-800 flex items-start gap-2">
                            <span className="flex-shrink-0 mt-0.5">✗</span> "{q}"
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Communities */}
                  {step.communities && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">Where to find them</p>
                      <div className="grid grid-cols-2 gap-3">
                        {step.communities.map(c => (
                          <a key={c.name} href={c.url} target="_blank" rel="noopener noreferrer"
                            className="bg-white rounded-2xl border border-border p-4 hover:border-coral transition-all group">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-semibold text-sm text-ink group-hover:text-coral transition-colors">{c.name}</p>
                              <ExternalLink size={12} className="text-muted group-hover:text-coral transition-colors" />
                            </div>
                            <p className="text-xs text-muted leading-relaxed">{c.desc}</p>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Scripts */}
                  {step.scripts && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">Scripts you can use</p>
                      <div className="space-y-3">
                        {step.scripts.map((script, j) => {
                          const scriptId = `${i}-${j}`
                          return (
                            <div key={j} className="bg-white rounded-2xl border border-border overflow-hidden">
                              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-cream/50">
                                <p className="text-xs font-semibold text-muted">{script.label}</p>
                                <button
                                  onClick={() => copyScript(script.text, scriptId)}
                                  className="flex items-center gap-1.5 text-xs text-muted hover:text-coral transition-colors"
                                >
                                  {copiedScript === scriptId ? <Check size={12} /> : <Copy size={12} />}
                                  {copiedScript === scriptId ? 'Copied' : 'Copy'}
                                </button>
                              </div>
                              <pre className="px-4 py-4 text-sm text-ink leading-relaxed whitespace-pre-wrap font-sans">
                                {script.text}
                              </pre>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* LaunchLog tip */}
                  {step.launchlogTip && (
                    <div className="bg-coral-50 border border-coral-200 rounded-2xl p-5">
                      <p className="text-xs font-semibold text-coral mb-2">💡 LaunchLog tip</p>
                      <p className="text-sm text-ink leading-relaxed">
                        Your <Link href="/dashboard" className="text-coral underline font-medium">founder dashboard</Link> shows every pass reason from swipes on your listing. Check it weekly — patterns in that feedback are free customer discovery data telling you exactly what to fix.
                      </p>
                    </div>
                  )}

                  {/* Metric */}
                  <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl px-5 py-4">
                    <span className="text-xl flex-shrink-0">🎯</span>
                    <p className="text-sm font-semibold text-green-800">{step.metric}</p>
                  </div>

                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Progress tracker */}
      <div className="bg-white rounded-3xl border border-border p-7 mb-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-display text-2xl font-semibold">Customer tracking spreadsheet</h2>
            <p className="text-muted text-sm mt-1">Keep a simple spreadsheet to track every conversation.</p>
          </div>
          <button
            onClick={() => setShowTracker(!showTracker)}
            className="text-sm text-coral font-medium hover:underline flex items-center gap-1"
          >
            {showTracker ? 'Hide' : 'Show template'}
            {showTracker ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {showTracker && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-cream">
                  {TRACKING_TEMPLATE.map(col => (
                    <th key={col.col} className={`${col.width} text-left px-3 py-2.5 font-semibold text-muted border border-border first:rounded-tl-xl last:rounded-tr-xl`}>
                      {col.col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Sara M.', 'LinkedIn', 'Apr 10', 'Contacted', '"Inventory tracking kills me"', 'Follow up Apr 17'],
                  ['James R.', 'Reddit', 'Apr 11', 'Call scheduled', 'Runs 2 restaurants', 'Call Apr 15 2pm'],
                  ['[Name]', '', '', '', '', ''],
                  ['[Name]', '', '', '', '', ''],
                  ['[Name]', '', '', '', '', ''],
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-cream/50'}>
                    {row.map((cell, j) => (
                      <td key={j} className="px-3 py-2.5 border border-border text-ink">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 flex gap-3">
              <a
                href="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms/copy"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-coral hover:underline"
              >
                <ExternalLink size={13} /> Open Google Sheets template
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Common mistakes */}
      <div className="bg-white rounded-3xl border border-border p-7 mb-8">
        <h2 className="font-display text-2xl font-semibold mb-5">The 5 mistakes that kill early traction</h2>
        <div className="space-y-4">
          {[
            { mistake: 'Asking for opinions instead of stories', fix: 'Replace "what do you think of X?" with "tell me about the last time you dealt with X."' },
            { mistake: 'Talking to people who want to be supportive', fix: 'Friends and family lie kindly. Find strangers who have the actual problem.' },
            { mistake: 'Waiting until the product is ready', fix: 'Start talking to customers before you write a line of code. The conversations shape what you build.' },
            { mistake: 'Stopping at 3 conversations', fix: 'Three conversations is a story. Ten conversations is a pattern. You need patterns.' },
            { mistake: 'Not asking for referrals', fix: 'End every call with "who else should I talk to?" One good conversation leads to three more.' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4 py-4 border-b border-border last:border-0">
              <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-xs flex-shrink-0 mt-0.5">✗</div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-ink mb-1">{item.mistake}</p>
                <p className="text-sm text-muted leading-relaxed">
                  <span className="text-green-700 font-medium">Fix: </span>{item.fix}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTAs */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-coral-50 border border-coral-200 rounded-3xl p-6 text-center">
          <div className="text-3xl mb-3">🚀</div>
          <h3 className="font-display text-lg font-semibold mb-2">List on LaunchLog</h3>
          <p className="text-muted text-sm mb-4 leading-relaxed">Get real consumer feedback from people who swipe through your listing.</p>
          <Link href="/list" className="inline-block bg-coral text-white font-semibold px-6 py-2.5 rounded-full shadow-coral hover:bg-coral-600 transition-all text-sm">
            List your startup →
          </Link>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-3xl p-6 text-center">
          <div className="text-3xl mb-3">📚</div>
          <h3 className="font-display text-lg font-semibold mb-2">More resources</h3>
          <p className="text-muted text-sm mb-4 leading-relaxed">Funding, legal templates, financial tools, and founder communities.</p>
          <Link href="/resources" className="inline-block bg-purple-600 text-white font-semibold px-6 py-2.5 rounded-full hover:bg-purple-700 transition-all text-sm">
            Browse resources →
          </Link>
        </div>
      </div>

      {/* Recommended reading */}
      <div className="bg-white rounded-3xl border border-border p-6">
        <h3 className="font-display text-lg font-semibold mb-4">Recommended reading</h3>
        <div className="space-y-3">
          {[
            { title: 'The Mom Test', author: 'Rob Fitzpatrick', desc: 'The definitive book on customer interviews. Short, practical, and worth re-reading every quarter.', url: 'https://www.momtestbook.com' },
            { title: 'Do Things That Don\'t Scale', author: 'Paul Graham', desc: 'YC essay on why early-stage founders should do manual, unscalable things to get their first customers.', url: 'https://paulgraham.com/ds.html' },
            { title: 'The First 10 Customers', author: 'Lenny Rachitsky', desc: 'How 30 founders got their first 10 customers, across B2B and consumer. Practical and specific.', url: 'https://www.lennysnewsletter.com/p/how-todays-top-startups-acquired' },
          ].map(book => (
            <a key={book.title} href={book.url} target="_blank" rel="noopener noreferrer"
              className="flex items-start gap-4 py-3 border-b border-border last:border-0 group hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-xl bg-cream border border-border flex items-center justify-center text-lg flex-shrink-0">📖</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm text-ink group-hover:text-coral transition-colors">{book.title}</p>
                  <span className="text-xs text-muted">— {book.author}</span>
                  <ExternalLink size={11} className="text-muted flex-shrink-0" />
                </div>
                <p className="text-xs text-muted leading-relaxed mt-0.5">{book.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
