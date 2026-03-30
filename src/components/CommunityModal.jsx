'use client'
import { X, ArrowRight } from 'lucide-react'
import { COMMUNITY_CHANNELS } from '@/lib/constants'

export default function CommunityModal({ startup, onClose }) {
  if (!startup) return null

  const channels = [
    startup.discord_url   && { key: 'discord',   url: startup.discord_url },
    startup.slack_url     && { key: 'slack',      url: startup.slack_url },
    startup.instagram_url && { key: 'instagram',  url: startup.instagram_url },
    startup.twitter_url   && { key: 'twitter',    url: startup.twitter_url },
    startup.linkedin_url  && { key: 'linkedin',   url: startup.linkedin_url },
    startup.tiktok_url    && { key: 'tiktok',     url: startup.tiktok_url },
    startup.facebook_url  && { key: 'facebook',   url: startup.facebook_url },
  ].filter(Boolean)

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-card-lg">
        <div className="flex items-start gap-4 pb-5 border-b border-border mb-5">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 bg-gray-50">
            {startup.logo_url
              ? <img src={startup.logo_url} alt={startup.name} className="w-full h-full object-cover rounded-2xl" />
              : startup.logo_emoji || '🚀'
            }
          </div>
          <div className="flex-1">
            <p className="font-display text-lg font-bold text-ink">Join {startup.name}'s community</p>
            <p className="text-xs text-muted mt-1 leading-relaxed">You're now a supporter 🚀 Follow along and help them grow.</p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-ink transition-colors flex-shrink-0">
            <X size={18} />
          </button>
        </div>

        {channels.length > 0 ? (
          <div className="flex flex-col gap-2.5 mb-5">
            {channels.map(({ key, url }) => {
              const meta = COMMUNITY_CHANNELS[key]
              if (!meta) return null
              return (
                <a key={key} href={url} target="_blank" rel="noopener noreferrer"
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border transition-all hover:translate-x-1 group ${meta.bg} ${meta.border}`}>
                  <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-lg shadow-sm flex-shrink-0">{meta.icon}</div>
                  <span className={`text-sm font-semibold ${meta.text}`}>{meta.label}</span>
                  <ArrowRight size={15} className={`ml-auto ${meta.text} opacity-50 group-hover:opacity-100 transition-opacity`} />
                </a>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-6 text-muted text-sm mb-5">
            <p>This startup hasn't added community links yet.</p>
          </div>
        )}

        <button onClick={onClose} className="w-full text-center text-sm text-muted hover:text-ink transition-colors py-2">
          Maybe later
        </button>
      </div>
    </div>
  )
}
