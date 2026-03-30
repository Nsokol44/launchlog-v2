'use client'
import { useRef, useState } from 'react'
import Link from 'next/link'
import { MapPin, TrendingUp, ExternalLink, Share2 } from 'lucide-react'
import ShareModal from './ShareModal'

const SWIPE_THRESHOLD = 100

export default function SwipeCard({ startup, onSwipe, isTop, stackIndex }) {
  const dragStart = useRef(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [showShare, setShowShare] = useState(false)

  if (!startup) return null

  const rotation = offset.x * 0.07
  const yesOpacity = Math.min(Math.max(offset.x - 40, 0) / 80, 1)
  const nopeOpacity = Math.min(Math.max(-offset.x - 40, 0) / 80, 1)

  const stackScale = 1 - stackIndex * 0.04
  const stackY = stackIndex * 14

  const style = isTop
    ? {
        transform: `translateX(${offset.x}px) translateY(${offset.y * 0.3}px) rotate(${rotation}deg)`,
        transition: isDragging ? 'none' : 'transform 0.3s ease',
        zIndex: 10,
      }
    : {
        transform: `scale(${stackScale}) translateY(${stackY}px)`,
        zIndex: 10 - stackIndex,
        filter: `brightness(${1 - stackIndex * 0.04})`,
        transition: 'transform 0.3s ease',
        pointerEvents: 'none',
      }

  const onPointerDown = (e) => {
    if (!isTop) return
    e.currentTarget.setPointerCapture(e.pointerId)
    dragStart.current = { x: e.clientX, y: e.clientY }
    setIsDragging(true)
  }

  const onPointerMove = (e) => {
    if (!isDragging || !dragStart.current) return
    setOffset({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y })
  }

  const onPointerUp = () => {
    if (!isDragging) return
    setIsDragging(false)
    if (offset.x > SWIPE_THRESHOLD) triggerSwipe('right')
    else if (offset.x < -SWIPE_THRESHOLD) triggerSwipe('left')
    else setOffset({ x: 0, y: 0 })
    dragStart.current = null
  }

  const triggerSwipe = (direction) => {
    const exitX = direction === 'right' ? 600 : -600
    setOffset({ x: exitX, y: 0 })
    setTimeout(() => { setOffset({ x: 0, y: 0 }); onSwipe(startup, direction) }, 350)
  }

  const communityCount = [
    startup.discord_url, startup.slack_url, startup.instagram_url,
    startup.twitter_url, startup.linkedin_url, startup.tiktok_url,
  ].filter(Boolean).length

  return (
    <>
      <div
        className="absolute inset-x-0 bg-white rounded-3xl shadow-card-lg border border-border select-none swipe-card"
        style={style}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {isTop && (
          <>
            <div className="absolute top-6 left-6 z-10 bg-green-100 text-green-700 border-2 border-green-300 rounded-full px-4 py-2 font-display font-bold text-lg pointer-events-none transition-opacity"
              style={{ opacity: yesOpacity }}>
              🚀 Support!
            </div>
            <div className="absolute top-6 right-6 z-10 bg-red-100 text-red-700 border-2 border-red-300 rounded-full px-4 py-2 font-display font-bold text-lg pointer-events-none transition-opacity"
              style={{ opacity: nopeOpacity }}>
              👎 Pass
            </div>
          </>
        )}

        {/* Header */}
        <div className="flex items-start gap-4 p-7 border-b border-border">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 bg-gray-50">
            {startup.logo_url
              ? <img src={startup.logo_url} alt={startup.name} className="w-full h-full object-cover rounded-2xl" />
              : startup.logo_emoji || '🚀'
            }
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-xl font-bold text-ink">{startup.name}</h3>
            <p className="text-muted text-sm mt-1 leading-relaxed">{startup.tagline}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-100 text-purple-700">{startup.category}</span>
              {startup.city && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700 flex items-center gap-1">
                  <MapPin size={10} /> {startup.city}
                </span>
              )}
              {startup.stage && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-coral-50 text-coral">{startup.stage}</span>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="grid grid-cols-2 gap-5 p-7">
          <div className="col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">What it does</p>
            <p className="text-sm text-ink leading-relaxed">{startup.product}</p>
          </div>
          {startup.target_customer && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">Target customer</p>
              <p className="text-sm text-ink leading-relaxed">{startup.target_customer}</p>
            </div>
          )}
          {startup.revenue_model && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">Business model</p>
              <p className="text-sm text-ink leading-relaxed">{startup.revenue_model}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-7 py-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-coral flex items-center justify-center text-white text-xs font-bold">
              {startup.founder_name?.[0] || '?'}
            </div>
            <div>
              <p className="text-sm font-medium text-ink">{startup.founder_name || 'Founder'}</p>
              <p className="text-xs text-muted">Founder</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted flex items-center gap-1">
              <TrendingUp size={14} /> {(startup.supporters || 0).toLocaleString()}
            </span>
            <button
              onPointerDown={e => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); setShowShare(true) }}
              className="p-2 rounded-xl hover:bg-cream text-muted hover:text-coral transition-all"
            >
              <Share2 size={15} />
            </button>
            <Link
              href={`/startup/${startup.id}`}
              onPointerDown={e => e.stopPropagation()}
              onClick={e => e.stopPropagation()}
              className="p-2 rounded-xl hover:bg-cream text-muted hover:text-coral transition-all"
            >
              <ExternalLink size={15} />
            </Link>
          </div>
        </div>
      </div>

      {showShare && <ShareModal startup={startup} onClose={() => setShowShare(false)} />}
    </>
  )
}
