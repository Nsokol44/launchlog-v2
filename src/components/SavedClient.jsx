'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { fetchSavedStartups, unsaveStartup } from '@/lib/supabase-browser'
import { useAuth } from './AuthProvider'
import { MapPin, Trash2, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SavedClient() {
  const { user } = useAuth()
  const [startups, setStartups] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) load()
    else setLoading(false)
  }, [user])

  const load = async () => {
    try { const data = await fetchSavedStartups(); setStartups(data) }
    finally { setLoading(false) }
  }

  const handleUnsave = async (startup) => {
    try {
      await unsaveStartup(startup.id)
      setStartups(prev => prev.filter(s => s.id !== startup.id))
      toast.success(`Removed ${startup.name}`)
    } catch (e) { toast.error(e.message) }
  }

  if (!user) return (
    <div className="max-w-xl mx-auto px-5 py-20 text-center">
      <div className="text-5xl mb-5">🔒</div>
      <h2 className="font-display text-2xl font-bold mb-3">Sign in to see saved startups</h2>
      <p className="text-muted mb-6">Create a free account to bookmark startups and come back later.</p>
      <Link href="/" className="bg-coral text-white font-semibold px-6 py-3 rounded-full shadow-coral hover:bg-coral-600 transition-all">Back to discover</Link>
    </div>
  )

  if (loading) return <div className="flex items-center justify-center h-64"><div className="text-4xl animate-bounce">🔖</div></div>

  return (
    <div className="max-w-2xl mx-auto px-5 py-12">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold mb-2">Saved Startups</h1>
        <p className="text-muted">{startups.length > 0 ? `${startups.length} bookmarked` : 'Startups you bookmark will appear here'}</p>
      </div>

      {startups.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-border">
          <div className="text-5xl mb-4">🔖</div>
          <h3 className="font-display text-2xl font-semibold mb-2">Nothing saved yet</h3>
          <p className="text-muted mb-6 text-sm">Hit the bookmark button when swiping to save startups here.</p>
          <Link href="/" className="bg-coral text-white font-semibold px-6 py-3 rounded-full shadow-coral hover:bg-coral-600 transition-all">Start discovering →</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {startups.map(startup => (
            <div key={startup.id} className="bg-white rounded-3xl border border-border shadow-card p-6 flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 bg-gray-50">
                {startup.logo_url ? <img src={startup.logo_url} alt={startup.name} className="w-full h-full object-cover rounded-2xl" /> : startup.logo_emoji || '🚀'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-lg font-bold text-ink">{startup.name}</h3>
                    <p className="text-muted text-sm mt-0.5 leading-relaxed">{startup.tagline}</p>
                  </div>
                  <button onClick={() => handleUnsave(startup)} className="text-muted hover:text-red-500 transition-colors flex-shrink-0"><Trash2 size={16} /></button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3 items-center">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700">{startup.category}</span>
                  {startup.city && <span className="text-xs text-muted flex items-center gap-1"><MapPin size={10} /> {startup.city}</span>}
                  <span className="text-xs text-muted ml-auto">🚀 {(startup.supporters || 0).toLocaleString()}</span>
                </div>
                <Link href={`/startup/${startup.id}`} className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-coral hover:underline">
                  View startup <ExternalLink size={11} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
