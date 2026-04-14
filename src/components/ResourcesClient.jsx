'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ExternalLink, Search, Filter } from 'lucide-react'
import {
  FUNDING_RESOURCES,
  TOOL_RESOURCES,
  COMMUNITY_RESOURCES,
  RESOURCE_CATEGORIES,
} from '@/lib/resources-data'
import { CATEGORIES } from '@/lib/constants'

const STARTUP_CATEGORIES = CATEGORIES.filter(c => c.value !== 'all')
const FUNDING_TYPES = [
  { value: 'all',           label: 'All funding'       },
  { value: 'non-dilutive',  label: 'Non-dilutive only' },
  { value: 'dilutive',      label: 'Dilutive only'     },
]

export default function ResourcesClient() {
  const [activeCategory, setActiveCategory] = useState('funding')
  const [startupType, setStartupType] = useState('all')
  const [fundingType, setFundingType] = useState('all')
  const [search, setSearch] = useState('')

  // Filter funding resources
  const filteredFunding = useMemo(() => {
    return FUNDING_RESOURCES.filter(r => {
      const matchType = fundingType === 'all' || r.type === fundingType
      const matchStartup = startupType === 'all' ||
        r.categories.includes('all') ||
        r.categories.includes(startupType)
      const matchSearch = !search ||
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.description.toLowerCase().includes(search.toLowerCase())
      return matchType && matchStartup && matchSearch
    })
  }, [fundingType, startupType, search])

  // Filter tool resources
  const filteredTools = useMemo(() => {
    return TOOL_RESOURCES.filter(r => {
      const matchCat = activeCategory === 'all' || r.category === activeCategory
      const matchSearch = !search ||
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.description.toLowerCase().includes(search.toLowerCase())
      return matchCat && matchSearch
    })
  }, [activeCategory, search])

  // Filter community resources
  const filteredCommunity = useMemo(() => {
    return COMMUNITY_RESOURCES.filter(r => {
      const matchStartup = startupType === 'all' ||
        r.tags.includes('all') ||
        r.tags.includes(startupType)
      const matchSearch = !search ||
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.description.toLowerCase().includes(search.toLowerCase())
      return matchStartup && matchSearch
    })
  }, [startupType, search])

  return (
    <div className="max-w-5xl mx-auto px-5 py-12">

      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 bg-coral-50 border border-coral-200 rounded-full px-4 py-2 text-sm font-medium text-coral mb-4">
          📚 Founder Resources
        </div>
        <h1 className="font-display text-5xl font-bold text-ink mb-3 tracking-tight">
          Everything you need to grow
        </h1>
        <p className="text-muted text-lg leading-relaxed max-w-2xl font-light">
          Curated funding sources, legal templates, financial tools, and communities — organized by your startup type.
        </p>
      </div>

      {/* Global filters */}
      <div className="flex flex-wrap gap-3 mb-8 p-5 bg-white rounded-3xl border border-border">
        {/* Search */}
        <div className="flex-1 min-w-48 relative">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search resources..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border border-border rounded-full pl-10 pr-4 py-2.5 text-sm bg-cream focus:outline-none focus:border-coral transition-colors"
          />
        </div>

        {/* Startup type filter */}
        <select
          value={startupType}
          onChange={e => setStartupType(e.target.value)}
          className="border border-border rounded-full px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-coral transition-colors"
        >
          <option value="all">All startup types</option>
          {STARTUP_CATEGORIES.map(c => (
            <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
          ))}
        </select>
      </div>

      {/* Category nav */}
      <div className="flex flex-wrap gap-2 mb-8">
        {RESOURCE_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-medium transition-all ${
              activeCategory === cat.id
                ? 'border-coral bg-coral-50 text-coral'
                : 'border-border bg-white text-ink hover:border-coral hover:bg-coral-50 hover:text-coral'
            }`}
          >
            <span>{cat.icon}</span> {cat.label}
          </button>
        ))}
      </div>

      {/* ── FUNDING ── */}
      {activeCategory === 'funding' && (
        <div>
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <div>
              <h2 className="font-display text-2xl font-semibold">Funding Sources</h2>
              <p className="text-muted text-sm mt-1">{filteredFunding.length} sources matched</p>
            </div>
            <div className="flex gap-2">
              {FUNDING_TYPES.map(t => (
                <button
                  key={t.value}
                  onClick={() => setFundingType(t.value)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                    fundingType === t.value
                      ? 'bg-coral text-white border-coral'
                      : 'border-border text-muted hover:border-coral hover:text-coral'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Non-dilutive section */}
          {filteredFunding.filter(r => r.type === 'non-dilutive').length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-green-700 bg-green-100 border border-green-200 px-3 py-1.5 rounded-full">
                  🎁 Non-dilutive — keep your equity
                </span>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {filteredFunding.filter(r => r.type === 'non-dilutive').map(resource => (
                  <FundingCard key={resource.name} resource={resource} />
                ))}
              </div>
            </div>
          )}

          {/* Dilutive section */}
          {filteredFunding.filter(r => r.type === 'dilutive').length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-100 border border-purple-200 px-3 py-1.5 rounded-full">
                  📈 Dilutive — give equity for capital
                </span>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {filteredFunding.filter(r => r.type === 'dilutive').map(resource => (
                  <FundingCard key={resource.name} resource={resource} />
                ))}
              </div>
            </div>
          )}

          {filteredFunding.length === 0 && <EmptyState />}
        </div>
      )}

      {/* ── TOOLS & TEMPLATES ── */}
      {activeCategory !== 'funding' && activeCategory !== 'community' && (
        <div>
          <div className="mb-5">
            <h2 className="font-display text-2xl font-semibold">
              {RESOURCE_CATEGORIES.find(c => c.id === activeCategory)?.label} Resources
            </h2>
            <p className="text-muted text-sm mt-1">{filteredTools.length} resources matched</p>
          </div>

          {filteredTools.length === 0 ? <EmptyState /> : (
            <div className="grid md:grid-cols-2 gap-4">
              {filteredTools.map(resource => (
                <ToolCard key={resource.name} resource={resource} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── COMMUNITY ── */}
      {activeCategory === 'community' && (
        <div>
          <div className="mb-5">
            <h2 className="font-display text-2xl font-semibold">Communities & Mentorship</h2>
            <p className="text-muted text-sm mt-1">{filteredCommunity.length} communities matched</p>
          </div>

          {filteredCommunity.length === 0 ? <EmptyState /> : (
            <div className="grid md:grid-cols-2 gap-4">
              {filteredCommunity.map(resource => (
                <CommunityCard key={resource.name} resource={resource} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pitch builder CTA */}
      <div className="mt-12 bg-gradient-to-br from-coral-50 to-purple-50 rounded-3xl border border-border p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="font-display text-2xl font-semibold mb-2">Ready to sharpen your pitch?</h3>
          <p className="text-muted leading-relaxed">
            Use our AI pitch builder to craft a compelling startup pitch step by step — then list it on LaunchLog.
          </p>
        </div>
        <Link
          href="/pitch-builder"
          className="bg-coral text-white font-semibold px-8 py-3.5 rounded-full shadow-coral hover:bg-coral-600 transition-all whitespace-nowrap flex-shrink-0"
        >
          Build your pitch →
        </Link>
      </div>

      {/* Submit a resource */}
      <div className="mt-6 text-center">
        <p className="text-sm text-muted">
          Know a resource that should be here?{' '}
          <a href="mailto:resources@launchlog.co" className="text-coral hover:underline font-medium">
            Submit it →
          </a>
        </p>
      </div>
    </div>
  )
}

function FundingCard({ resource }) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white rounded-3xl border border-border p-6 hover:border-coral hover:shadow-card transition-all group block"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-display text-lg font-semibold text-ink group-hover:text-coral transition-colors">
          {resource.name}
        </h3>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
            resource.type === 'non-dilutive'
              ? 'bg-green-100 text-green-700'
              : 'bg-purple-100 text-purple-700'
          }`}>
            {resource.amount}
          </span>
          <ExternalLink size={14} className="text-muted group-hover:text-coral transition-colors" />
        </div>
      </div>
      <p className="text-muted text-sm leading-relaxed mb-3">{resource.description}</p>
      <div className="flex flex-wrap gap-1.5">
        {resource.stages.map(s => (
          <span key={s} className="text-xs bg-cream text-muted px-2 py-0.5 rounded-full">{s}</span>
        ))}
      </div>
    </a>
  )
}

function ToolCard({ resource }) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white rounded-3xl border border-border p-6 hover:border-coral hover:shadow-card transition-all group block"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-display text-lg font-semibold text-ink group-hover:text-coral transition-colors">
          {resource.name}
        </h3>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
            resource.type === 'template'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-orange-100 text-orange-700'
          }`}>
            {resource.type === 'template' ? '📄 Template' : '🛠 Tool'}
          </span>
          <ExternalLink size={14} className="text-muted group-hover:text-coral transition-colors" />
        </div>
      </div>
      <p className="text-muted text-sm leading-relaxed">{resource.description}</p>
    </a>
  )
}

function CommunityCard({ resource }) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white rounded-3xl border border-border p-6 hover:border-coral hover:shadow-card transition-all group block"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-display text-lg font-semibold text-ink group-hover:text-coral transition-colors">
          {resource.name}
        </h3>
        <ExternalLink size={14} className="text-muted group-hover:text-coral transition-colors flex-shrink-0 mt-1" />
      </div>
      <p className="text-muted text-sm leading-relaxed">{resource.description}</p>
    </a>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-16 bg-white rounded-3xl border border-border">
      <div className="text-4xl mb-3">🔍</div>
      <p className="text-muted">No resources match your filters. Try adjusting your startup type or search.</p>
    </div>
  )
}
