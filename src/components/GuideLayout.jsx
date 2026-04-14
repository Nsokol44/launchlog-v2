'use client'
import Link from 'next/link'
import { ExternalLink, Copy, Check } from 'lucide-react'
import { useState } from 'react'

export function GuideLayout({ badge, title, description, stats, children }) {
  return (
    <div className="max-w-3xl mx-auto px-5 py-12">
      <div className="mb-2">
        <Link href="/resources" className="text-muted hover:text-coral text-sm transition-colors">← Back to Resources</Link>
      </div>
      <div className="mt-4 mb-10">
        <div className="inline-flex items-center gap-2 bg-coral-50 border border-coral-200 rounded-full px-4 py-2 text-sm font-medium text-coral mb-4">
          {badge}
        </div>
        <h1 className="font-display text-5xl font-bold text-ink mb-4 tracking-tight leading-tight">{title}</h1>
        <p className="text-muted text-xl leading-relaxed font-light max-w-2xl">{description}</p>
        {stats && (
          <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-border">
            {stats.map(s => (
              <div key={s.label}>
                <div className="font-display text-2xl font-bold text-ink">{s.val}</div>
                <div className="text-xs text-muted mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      {children}
      <div className="mt-10 grid md:grid-cols-2 gap-4">
        <Link href="/guides/first-10-customers" className="bg-coral-50 border border-coral-200 rounded-3xl p-5 hover:shadow-card transition-all group block">
          <p className="font-display text-lg font-bold text-ink group-hover:text-coral transition-colors mb-1">Get your first 10 customers →</p>
          <p className="text-muted text-sm">Step-by-step playbook with scripts and templates.</p>
        </Link>
        <Link href="/list" className="bg-purple-50 border border-purple-200 rounded-3xl p-5 hover:shadow-card transition-all group block">
          <p className="font-display text-lg font-bold text-ink group-hover:text-purple-700 transition-colors mb-1">List on LaunchLog →</p>
          <p className="text-muted text-sm">Get discovered by consumers, investors, and industry peers.</p>
        </Link>
      </div>
    </div>
  )
}

export function Section({ title, children }) {
  return (
    <div className="bg-white rounded-3xl border border-border p-7 mb-5">
      <h2 className="font-display text-2xl font-semibold mb-5">{title}</h2>
      {children}
    </div>
  )
}

export function Callout({ icon, title, children, color = 'bg-blue-50 border-blue-200' }) {
  return (
    <div className={`rounded-2xl border p-5 mb-5 ${color}`}>
      {title && <p className="text-xs font-semibold uppercase tracking-wider text-current mb-2">{icon} {title}</p>}
      {!title && <span className="text-xl mr-2">{icon}</span>}
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  )
}

export function ResourceCard({ name, description, url, tag, tagColor = 'bg-purple-100 text-purple-700' }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      className="flex items-start justify-between gap-3 p-4 bg-white rounded-2xl border border-border hover:border-coral transition-all group">
      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <p className="font-semibold text-sm text-ink group-hover:text-coral transition-colors">{name}</p>
          {tag && <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tagColor}`}>{tag}</span>}
        </div>
        <p className="text-xs text-muted leading-relaxed">{description}</p>
      </div>
      <ExternalLink size={14} className="text-muted group-hover:text-coral transition-colors flex-shrink-0 mt-0.5" />
    </a>
  )
}

export function PromptCard({ title, prompt, context }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    await navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden mb-3">
      <div className="flex items-center justify-between px-4 py-3 bg-cream border-b border-border">
        <p className="text-xs font-semibold text-muted">{title}</p>
        <button onClick={copy} className="flex items-center gap-1.5 text-xs text-muted hover:text-coral transition-colors">
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? 'Copied' : 'Copy prompt'}
        </button>
      </div>
      {context && <p className="px-4 pt-3 text-xs text-muted italic">{context}</p>}
      <pre className="px-4 py-4 text-sm text-ink leading-relaxed whitespace-pre-wrap font-sans">{prompt}</pre>
    </div>
  )
}

export function StepList({ steps }) {
  return (
    <ol className="space-y-3">
      {steps.map((step, i) => (
        <li key={i} className="flex items-start gap-3 text-sm text-ink leading-relaxed">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-coral flex items-center justify-center text-white text-xs font-bold mt-0.5">{i + 1}</span>
          <div>
            {typeof step === 'string' ? step : (
              <>
                <span className="font-semibold">{step.title}</span>
                {step.desc && <span className="text-muted"> — {step.desc}</span>}
              </>
            )}
          </div>
        </li>
      ))}
    </ol>
  )
}

export function CheckList({ items, color = 'text-green-600' }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5 text-sm text-ink leading-relaxed">
          <Check size={15} className={`${color} flex-shrink-0 mt-0.5`} />
          {item}
        </li>
      ))}
    </ul>
  )
}
