'use client'
import { useState } from 'react'
import { X, Copy, Check } from 'lucide-react'
import { SITE_URL } from '@/lib/constants'
import toast from 'react-hot-toast'

const SHARE_CHANNELS = [
  {
    key: 'twitter', label: 'Share on X / Twitter', icon: '🐦',
    bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-700',
    getUrl: (s, url) => `https://twitter.com/intent/tweet?text=Just+discovered+${encodeURIComponent(s.name)}+on+%40LaunchLog+%E2%80%94+${encodeURIComponent(s.tagline)}&url=${encodeURIComponent(url)}&hashtags=startups,LaunchLog`,
  },
  {
    key: 'linkedin', label: 'Share on LinkedIn', icon: '💼',
    bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700',
    getUrl: (s, url) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    key: 'whatsapp', label: 'Share on WhatsApp', icon: '💬',
    bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700',
    getUrl: (s, url) => `https://wa.me/?text=${encodeURIComponent(`Check out ${s.name} on LaunchLog — ${s.tagline}\n${url}`)}`,
  },
  {
    key: 'reddit', label: 'Share on Reddit', icon: '🤖',
    bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700',
    getUrl: (s, url) => `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(`${s.name} — ${s.tagline}`)}`,
  },
]

export default function ShareModal({ startup, onClose }) {
  const [copied, setCopied] = useState(false)
  const pageUrl = `${SITE_URL}/startup/${startup.id}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl)
      setCopied(true)
      toast.success('Link copied!')
      setTimeout(() => setCopied(false), 2000)
    } catch { toast.error('Could not copy link') }
  }

  const handleNativeShare = async () => {
    if (!navigator.share) return
    try { await navigator.share({ title: startup.name, text: startup.tagline, url: pageUrl }) } catch {}
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-card-lg">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="font-display text-xl font-bold">Share {startup.name}</h3>
            <p className="text-muted text-sm mt-1">Help them find their first users</p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-ink"><X size={18} /></button>
        </div>

        <div className="flex gap-2 mb-5">
          <div className="flex-1 bg-cream border border-border rounded-xl px-4 py-2.5 text-sm text-muted truncate font-mono">{pageUrl}</div>
          <button onClick={handleCopy}
            className={`px-4 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all flex items-center gap-1.5 ${
              copied ? 'border-green-300 bg-green-50 text-green-700' : 'border-border bg-white text-ink hover:border-coral hover:text-coral'
            }`}>
            {copied ? <Check size={15} /> : <Copy size={15} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        {typeof navigator !== 'undefined' && navigator.share && (
          <button onClick={handleNativeShare}
            className="w-full bg-coral text-white font-semibold py-3 rounded-full shadow-coral hover:bg-coral-600 transition-all mb-4">
            Share via...
          </button>
        )}

        <div className="flex flex-col gap-2.5">
          {SHARE_CHANNELS.map(ch => (
            <a key={ch.key} href={ch.getUrl(startup, pageUrl)} target="_blank" rel="noopener noreferrer"
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all hover:translate-x-1 group ${ch.bg} ${ch.border}`}>
              <span className="text-xl">{ch.icon}</span>
              <span className={`text-sm font-semibold ${ch.text}`}>{ch.label}</span>
              <span className={`ml-auto text-sm ${ch.text} opacity-40 group-hover:opacity-100`}>→</span>
            </a>
          ))}
        </div>

        <p className="text-xs text-muted text-center mt-5 leading-relaxed">Every share directly helps this founder get discovered. 🙏</p>
      </div>
    </div>
  )
}
