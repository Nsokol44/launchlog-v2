'use client'
import { ExternalLink, Download, FileText, Presentation, Table } from 'lucide-react'
import Link from 'next/link'

const PITCH_TEMPLATES = [
  {
    name: 'Sequoia Capital Pitch Deck',
    description: 'The exact pitch deck structure recommended by Sequoia. Covers company purpose, problem, solution, market size, product, business model, team, and financials.',
    format: 'Guide + Template',
    icon: '🎯',
    type: 'deck',
    url: 'https://www.sequoiacap.com/article/writing-a-business-plan/',
    tags: ['all stages', 'investor ready'],
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
  {
    name: 'Y Combinator Application Template',
    description: "YC's actual application questions restructured as a pitch template. Used by thousands of funded startups including Airbnb, Stripe, and Dropbox.",
    format: 'Google Doc',
    icon: '🚀',
    type: 'doc',
    url: 'https://www.ycombinator.com/apply',
    tags: ['early stage', 'pre-seed'],
    bg: 'bg-orange-50',
    border: 'border-orange-200',
  },
  {
    name: 'Guy Kawasaki 10-Slide Pitch',
    description: 'The famous 10-slide pitch deck format: Title, Problem, Solution, Business Model, Underlying Magic, Marketing, Competition, Team, Projections, Status.',
    format: 'PowerPoint / Keynote',
    icon: '📊',
    type: 'deck',
    url: 'https://guykawasaki.com/the-only-10-slides-you-need-in-your-pitch/',
    tags: ['all stages', 'investor ready'],
    bg: 'bg-purple-50',
    border: 'border-purple-200',
  },
  {
    name: 'Elevator Pitch Template',
    description: 'A fill-in-the-blank elevator pitch formula: "For [customer] who [need], [product] is a [category] that [benefit]. Unlike [alternative], we [differentiator]."',
    format: 'PDF',
    icon: '🗣️',
    type: 'doc',
    url: 'https://www.score.org/resource/elevator-pitch-template',
    tags: ['all stages', 'networking'],
    bg: 'bg-green-50',
    border: 'border-green-200',
  },
  {
    name: 'Problem-Solution One Pager',
    description: 'A single-page pitch document covering problem, solution, traction, team, and ask. Perfect for warm intros and email outreach to investors.',
    format: 'Canva Template',
    icon: '📄',
    type: 'doc',
    url: 'https://www.canva.com/templates/business-one-pagers/',
    tags: ['early stage', 'investor ready'],
    bg: 'bg-pink-50',
    border: 'border-pink-200',
  },
  {
    name: 'Investor Update Email Template',
    description: 'Monthly investor update template covering highlights, metrics, challenges, and asks. Keeps investors engaged and warm between rounds.',
    format: 'Google Doc',
    icon: '📧',
    type: 'doc',
    url: 'https://www.ycombinator.com/library/4P-how-to-write-investor-updates',
    tags: ['post-investment'],
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
  },
  {
    name: 'Financial Model Template',
    description: '3-year revenue model, unit economics, and funding needs spreadsheet. Pre-built for SaaS, marketplace, and e-commerce business models.',
    format: 'Excel / Google Sheets',
    icon: '💰',
    type: 'spreadsheet',
    url: 'https://www.score.org/resource/financial-projections-template',
    tags: ['all stages', 'investor ready'],
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
  {
    name: 'Demo Day Pitch Template',
    description: 'Tight 2-minute pitch structure used at accelerator demo days. Optimized for maximum impact in minimum time.',
    format: 'Google Slides',
    icon: '🎤',
    type: 'deck',
    url: 'https://www.techstars.com/blog/advice/how-to-pitch-your-startup/',
    tags: ['accelerator', 'demo day'],
    bg: 'bg-red-50',
    border: 'border-red-200',
  },
]

const TYPE_ICONS = {
  deck:       <Presentation size={14} />,
  doc:        <FileText size={14} />,
  spreadsheet: <Table size={14} />,
}

export default function PitchBuilderClient() {
  return (
    <div className="max-w-4xl mx-auto px-5 py-12">

      {/* Header */}
      <div className="mb-2">
        <Link href="/resources" className="text-muted hover:text-coral text-sm transition-colors">← Back to Resources</Link>
      </div>
      <div className="mb-10 mt-3">
        <div className="inline-flex items-center gap-2 bg-coral-50 border border-coral-200 rounded-full px-4 py-2 text-sm font-medium text-coral mb-4">
          📄 Pitch Templates
        </div>
        <h1 className="font-display text-5xl font-bold text-ink mb-3 tracking-tight">
          Pitch templates that work
        </h1>
        <p className="text-muted text-lg leading-relaxed max-w-2xl font-light">
          Proven frameworks used by funded startups. Download, customize, and pitch with confidence.
        </p>
      </div>

      {/* Templates grid */}
      <div className="grid md:grid-cols-2 gap-5 mb-12">
        {PITCH_TEMPLATES.map(template => (
          <a
            key={template.name}
            href={template.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`bg-white rounded-3xl border ${template.border} p-6 hover:shadow-card transition-all group block`}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 ${template.bg} rounded-2xl flex items-center justify-center text-2xl flex-shrink-0`}>
                  {template.icon}
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-ink group-hover:text-coral transition-colors leading-tight">
                    {template.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-muted">
                    {TYPE_ICONS[template.type]}
                    <span>{template.format}</span>
                  </div>
                </div>
              </div>
              <ExternalLink size={16} className="text-muted group-hover:text-coral transition-colors flex-shrink-0 mt-1" />
            </div>

            <p className="text-muted text-sm leading-relaxed mb-4">
              {template.description}
            </p>

            <div className="flex flex-wrap gap-2 items-center justify-between">
              <div className="flex flex-wrap gap-1.5">
                {template.tags.map(tag => (
                  <span key={tag} className={`text-xs font-medium px-2.5 py-1 rounded-full ${template.bg} border ${template.border}`}>
                    {tag}
                  </span>
                ))}
              </div>
              <span className="text-xs font-semibold text-coral flex items-center gap-1 group-hover:gap-2 transition-all">
                <Download size={12} /> Get template
              </span>
            </div>
          </a>
        ))}
      </div>

      {/* Tips section */}
      <div className="bg-white rounded-3xl border border-border p-8 mb-8">
        <h2 className="font-display text-2xl font-semibold mb-6">What makes a great pitch</h2>
        <div className="grid md:grid-cols-2 gap-5">
          {[
            { icon: '🎯', title: 'Lead with the problem', desc: "Investors fund solutions to real problems. Start with the pain, not your product. Make them feel it before you show the fix." },
            { icon: '📏', title: 'Be ruthlessly specific', desc: "\"Millions of people\" is not a customer. \"35-year-old restaurant owners with 2-5 locations\" is. Specific beats generic every time." },
            { icon: '📊', title: 'Show, don\'t tell', desc: "\"We have strong traction\" means nothing. \"$12k MRR, 40% month-over-month growth, zero churn\" means everything." },
            { icon: '👤', title: 'Make the team slide count', desc: "Investors bet on people. Why are YOU the right person to build this? Domain expertise, past wins, and unfair advantages matter." },
            { icon: '💡', title: 'One clear ask', desc: "Know exactly how much you\'re raising and what you\'ll do with it. Vague asks signal vague thinking." },
            { icon: '⏱️', title: 'Respect their time', desc: "If you can\'t explain your startup in 2 minutes, you don\'t understand it well enough yet. Simplicity is a sign of clarity." },
          ].map(tip => (
            <div key={tip.title} className="flex items-start gap-4">
              <div className="text-2xl flex-shrink-0">{tip.icon}</div>
              <div>
                <p className="font-semibold text-sm text-ink mb-1">{tip.title}</p>
                <p className="text-muted text-sm leading-relaxed">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-br from-coral-50 to-purple-50 rounded-3xl border border-border p-8 text-center">
        <div className="text-4xl mb-4">🚀</div>
        <h3 className="font-display text-2xl font-semibold mb-2">Ready to get discovered?</h3>
        <p className="text-muted mb-6 leading-relaxed">
          List your startup on LaunchLog and get real feedback from consumers, investors, and industry peers.
        </p>
        <Link
          href="/list"
          className="inline-flex items-center gap-2 bg-coral text-white font-semibold px-8 py-3.5 rounded-full shadow-coral hover:bg-coral-600 transition-all"
        >
          List your startup — it's free →
        </Link>
      </div>
    </div>
  )
}
