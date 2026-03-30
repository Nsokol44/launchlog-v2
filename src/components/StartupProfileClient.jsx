'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MapPin, ArrowLeft, Bookmark, BookmarkCheck, Share2, ThumbsDown, Rocket, ExternalLink } from 'lucide-react'
import { recordSwipe, saveStartup, unsaveStartup } from '@/lib/supabase-browser'
import { COMMUNITY_CHANNELS } from '@/lib/constants'
import FeedbackModal from './FeedbackModal'
import CommunityModal from './CommunityModal'
import ShareModal from './ShareModal'
import toast from 'react-hot-toast'

// Force Next.js to bypass the cache and fetch fresh data from Supabase
export const revalidate = 0;

export default function StartupProfileClient({ startup }) {
  const router = useRouter()
  const [saved, setSaved] = useState(false)
  const [supported, setSupported] = useState(false)
  const [supportCount, setSupportCount] = useState(startup.supporters || 0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [showCommunity, setShowCommunity] = useState(false)
  const [showShare, setShowShare] = useState(false)

  const handleSupport = async () => {
    if (supported) return
    setSupported(true)
    setSupportCount(c => c + 1)
    try { 
      await recordSwipe({ startup_id: startup.id, direction: 'right' }); 
      setShowCommunity(true) 
    } catch (err) {
      console.error("Support error:", err)
    }
  }

  const handleSave = async () => {
    try {
      if (saved) { 
        await unsaveStartup(startup.id); 
        setSaved(false); 
        toast.success('Removed from saved') 
      } else { 
        await saveStartup(startup.id); 
        setSaved(true); 
        toast.success('🔖 Saved!') 
      }
    } catch (e) { 
      toast.error(e.message) 
    }
  }

  // Filter and format available community channels
  const channels = [
    startup.website_url && { 
      key: 'website', 
      url: startup.website_url, 
      label: 'Official Website', 
      icon: '🌐', 
      bg: 'bg-blue-50', 
      border: 'border-blue-100', 
      text: 'text-blue-700' 
    },
    startup.discord_url   && { key: 'discord',   url: startup.discord_url },
    startup.slack_url     && { key: 'slack',     url: startup.slack_url },
    startup.instagram_url && { key: 'instagram', url: startup.instagram_url },
    startup.twitter_url   && { key: 'twitter',   url: startup.twitter_url },
    startup.linkedin_url  && { key: 'linkedin',  url: startup.linkedin_url },
    startup.tiktok_url    && { key: 'tiktok',    url: startup.tiktok_url },
  ].filter(Boolean)

  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-muted hover:text-ink transition-colors mb-8 text-sm font-medium group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to discover
      </button>

      {/* Hero card */}
      <div className="bg-white rounded-3xl border border-border shadow-card overflow-hidden mb-5">
        <div className="p-8 border-b border-border">
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0 bg-gray-50 border border-border/50">
              {startup.logo_url
                ? <img src={startup.logo_url} alt={startup.name} className="w-full h-full object-cover rounded-2xl" />
                : startup.logo_emoji || '🚀'
              }
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-display text-3xl font-bold text-ink mb-1">{startup.name}</h1>
              <p className="text-muted leading-relaxed mb-4">{startup.tagline}</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200">{startup.category}</span>
                {startup.city && (
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-green-100 text-green-700 flex items-center gap-1 border border-green-200">
                    <MapPin size={10} /> {startup.city}
                  </span>
                )}
                {startup.stage && (
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-coral-50 text-coral border border-coral-100">{startup.stage}</span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex divide-x divide-border bg-gray-50/30">
          <div className="flex-1 text-center py-4">
            <div className="font-display text-2xl font-bold text-coral">{supportCount.toLocaleString()}</div>
            <div className="text-[10px] uppercase tracking-widest font-bold text-muted mt-0.5">Supporters</div>
          </div>
          <div className="flex-1 text-center py-4">
            <div className="font-display text-2xl font-bold text-ink">{startup.stage || '—'}</div>
            <div className="text-[10px] uppercase tracking-widest font-bold text-muted mt-0.5">Stage</div>
          </div>
          <div className="flex-1 text-center py-4">
            <div className="font-display text-2xl font-bold text-ink">{channels.length}</div>
            <div className="text-[10px] uppercase tracking-widest font-bold text-muted mt-0.5">Channels</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mb-5">
        <button onClick={handleSupport} disabled={supported}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm transition-all ${
            supported ? 'bg-green-100 text-green-700 border border-green-200 cursor-default' : 'bg-coral text-white shadow-coral hover:bg-coral-600 hover:-translate-y-0.5'
          }`}>
          <Rocket size={16} />{supported ? 'Supported!' : 'Support this startup'}
        </button>
        <button onClick={handleSave}
          className={`px-4 py-3.5 rounded-2xl border-2 transition-all ${saved ? 'border-purple-300 bg-purple-50 text-purple-700' : 'border-border bg-white text-muted hover:border-purple-300 hover:text-purple-700'}`}>
          {saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
        </button>
        <button onClick={() => setShowShare(true)} className="px-4 py-3.5 rounded-2xl border-2 border-border bg-white text-muted hover:border-coral hover:text-coral transition-all">
          <Share2 size={18} />
        </button>
        <button onClick={() => setShowFeedback(true)} className="px-4 py-3.5 rounded-2xl border-2 border-border bg-white text-muted hover:border-red-300 hover:text-red-500 transition-all">
          <ThumbsDown size={18} />
        </button>
      </div>

      {/* About */}
      <div className="bg-white rounded-3xl border border-border shadow-card p-7 mb-5">
        <h2 className="font-display text-xl font-semibold mb-5 border-b border-border pb-3">About {startup.name}</h2>
        <div className="space-y-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-2">What it does</p>
            <p className="text-sm text-ink leading-relaxed">{startup.product}</p>
          </div>
          {startup.target_customer && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-2">Who it's for</p>
              <p className="text-sm text-ink leading-relaxed">{startup.target_customer}</p>
            </div>
          )}
          {startup.revenue_model && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-2">Business model</p>
              <p className="text-sm text-ink leading-relaxed">{startup.revenue_model}</p>
            </div>
          )}
        </div>
      </div>

      {/* Founder */}
      {startup.founder_name && (
        <div className="bg-white rounded-3xl border border-border shadow-card p-7 mb-5">
          <h2 className="font-display text-xl font-semibold mb-4">The founder</h2>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-coral flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-sm">
              {startup.founder_name[0]}
            </div>
            <div>
              <p className="font-semibold text-ink">{startup.founder_name}</p>
              <p className="text-sm text-muted">Founder @ {startup.name}</p>
            </div>
          </div>
        </div>
      )}

      {/* Community Channels */}
      {channels.length > 0 && (
        <div className="bg-white rounded-3xl border border-border shadow-card p-7 mb-5">
          <h2 className="font-display text-xl font-semibold mb-4">Join the community</h2>
          <div className="flex flex-col gap-3">
            {channels.map((chan) => {
              // Custom meta for website, otherwise look up in constants
              const meta = chan.key === 'website' ? chan : COMMUNITY_CHANNELS[chan.key];
              
              if (!meta) return null;

              return (
                <a key={chan.key} href={chan.url} target="_blank" rel="noopener noreferrer"
                  className={`flex items-center gap-3 px-4 py-4 rounded-2xl border transition-all hover:translate-x-1 group shadow-sm hover:shadow-md ${meta.bg} ${meta.border}`}>
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-xl shadow-sm border border-black/5">
                    {meta.icon}
                  </div>
                  <span className={`text-sm font-bold ${meta.text}`}>{meta.label}</span>
                  <span className={`ml-auto text-sm ${meta.text} opacity-30 group-hover:opacity-100 transition-opacity`}>→</span>
                </a>
              )
            })}
          </div>
        </div>
      )}

      {/* Share CTA */}
      <div className="bg-gradient-to-br from-coral-50/50 to-purple-50/50 rounded-3xl border border-border p-8 text-center">
        <p className="font-display text-xl font-semibold mb-2 text-ink">Know someone who'd love this? 🚀</p>
        <p className="text-muted text-sm mb-6 max-w-sm mx-auto leading-relaxed">Share {startup.name} with your network and help them grow their early community.</p>
        <button onClick={() => setShowShare(true)}
          className="bg-coral text-white font-semibold px-8 py-3.5 rounded-full shadow-coral hover:bg-coral-600 transition-all inline-flex items-center gap-2 hover:-translate-y-0.5">
          <Share2 size={16} /> Share this startup
        </button>
      </div>

      {showFeedback && <FeedbackModal startup={startup} onClose={() => setShowFeedback(false)} />}
      {showCommunity && <CommunityModal startup={startup} onClose={() => { setShowCommunity(false); toast.success('🚀 Thanks for your support!') }} />}
      {showShare && <ShareModal startup={startup} onClose={() => setShowShare(false)} />}
    </div>
  )
}