'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X, Bookmark, BookmarkCheck, ExternalLink, Globe } from 'lucide-react'
import { saveStartup, unsaveStartup, fetchSavedIds } from '@/lib/supabase-browser'
import { COMMUNITY_CHANNELS } from '@/lib/constants'
import toast from 'react-hot-toast'

const formatUrl = (url) => {
  if (!url) return '';
  const trimmed = url.trim();
  return trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
};

export default function CommunityModal({ startup, onClose }) {
  const [saved, setSaved] = useState(false)

  // Check if already saved when modal opens
  useEffect(() => {
    fetchSavedIds().then(ids => setSaved(ids.includes(startup.id)))
  }, [startup.id])

  const handleSave = async () => {
    try {
      if (saved) {
        await unsaveStartup(startup.id)
        setSaved(false)
        toast.success('Removed from saved')
      } else {
        await saveStartup(startup.id)
        setSaved(true)
        toast.success('🔖 Saved to your dashboard!')
      }
    } catch (e) {
      toast.error('Failed to update save status')
    }
  }

  const channels = [
    startup.website_url && { 
      key: 'website', 
      url: formatUrl(startup.website_url), 
      label: 'Visit Website', 
      icon: '🌐', 
      bg: 'bg-blue-50', 
      border: 'border-blue-100', 
      text: 'text-blue-700' 
    },
    startup.discord_url   && { key: 'discord',   url: formatUrl(startup.discord_url) },
    startup.slack_url     && { key: 'slack',     url: formatUrl(startup.slack_url) },
    startup.instagram_url && { key: 'instagram', url: formatUrl(startup.instagram_url) },
    startup.twitter_url   && { key: 'twitter',   url: formatUrl(startup.twitter_url) },
    startup.linkedin_url  && { key: 'linkedin',  url: formatUrl(startup.linkedin_url) },
    startup.tiktok_url    && { key: 'tiktok',    url: formatUrl(startup.tiktok_url) },
  ].filter(Boolean)

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-ink/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200">
        <button onClick={onClose} className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 text-muted transition-colors">
          <X size={20} />
        </button>

        <div className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-3xl border border-border/50 overflow-hidden">
              {startup.logo_url 
                ? <img src={startup.logo_url} alt="" className="w-full h-full object-cover" />
                : (startup.logo_emoji || '🚀')
              }
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-ink leading-tight">Join {startup.name}'s community</h2>
              <p className="text-sm text-muted mt-1">You're now a supporter! 🚀 Follow along and help them grow.</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 mb-8">
            {channels.map((chan) => {
              const meta = chan.key === 'website' ? chan : COMMUNITY_CHANNELS[chan.key]
              if (!meta) return null

              return (
                <a key={chan.key} href={chan.url} target="_blank" rel="noopener noreferrer"
                  className={`flex items-center gap-3 px-4 py-4 rounded-2xl border transition-all hover:translate-x-1 group shadow-sm ${meta.bg} ${meta.border}`}>
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-xl shadow-sm border border-black/5">
                    {meta.icon}
                  </div>
                  <span className={`text-sm font-bold ${meta.text}`}>{meta.label}</span>
                  <span className={`ml-auto text-sm ${meta.text} opacity-30 group-hover:opacity-100 transition-opacity`}>→</span>
                </a>
              )
            })}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
            <button 
              onClick={handleSave}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                saved ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-white border-border text-muted hover:border-purple-200 hover:text-purple-700'
              }`}
            >
              {saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
              {saved ? 'Saved' : 'Save for later'}
            </button>
            
            <Link 
              href={`/startup/${startup.id}`}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-ink text-white font-semibold text-sm hover:bg-ink/90 transition-all shadow-sm"
            >
              <ExternalLink size={16} />
              View Profile
            </Link>
          </div>

          <button onClick={onClose} className="w-full text-center mt-6 text-sm font-medium text-muted hover:text-ink transition-colors">
            Maybe later
          </button>
        </div>
      </div>
    </div>
  )
}