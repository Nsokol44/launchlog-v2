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

  return (
    <>
      <div
        className="absolute inset-x-0 bg-white rounded-3xl shadow-card-lg border border-border select-none swipe-card overflow-hidden"
        style={style}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {isTop && (
          <>
            <div className="absolute top-6 left-6 z-20 bg-green-100 text-green-700 border-2 border-green-300 rounded-full px-4 py-2 font-display font-bold text-lg pointer-events-none transition-opacity"
              style={{ opacity: yesOpacity }}>
              🚀 Support!
            </div>
            <div className="absolute top-6 right-6 z-20 bg-red-100 text-red-700 border-2 border-red-300 rounded-full px-4 py-2 font-display font-bold text-lg pointer-events-none transition-opacity"
              style={{ opacity: nopeOpacity }}>
              👎 Pass
            </div>
          </>
        )}

        {/* Header */}
        <div className="flex items-start gap-4 p-6 border-b border-border bg-white">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 bg-gray-50 border border-border/50">
            {startup.logo_url
              ? <img src={startup.logo_url} alt={startup.name} className="w-full h-full object-cover rounded-2xl" />
              : startup.logo_emoji || '🚀'
            }
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-lg font-bold text-ink truncate">{startup.name}</h3>
            <p className="text-muted text-xs mt-0.5 leading-relaxed line-clamp-1">{startup.tagline}</p>
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-600 border border-purple-100">{startup.category}</span>
              {startup.city && (
                <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md bg-green-50 text-green-600 border border-green-100 flex items-center gap-1">
                  <MapPin size={8} /> {startup.city}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Body - Constrained height with line clamping */}
        <div className="p-6 space-y-5 h-[260px] overflow-hidden bg-white">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-1.5">What it does</p>
            <p className="text-sm text-ink leading-relaxed line-clamp-4">
              {startup.product}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {startup.target_customer && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-1.5">Target customer</p>
                <p className="text-xs text-ink leading-relaxed line-clamp-3">
                  {startup.target_customer}
                </p>
              </div>
            )}
            {startup.revenue_model && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-1.5">Business model</p>
                <p className="text-xs text-ink leading-relaxed line-clamp-3">
                  {startup.revenue_model}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-gray-50/30">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-coral flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
              {startup.founder_name?.[0] || '?'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-ink truncate max-w-[100px]">{startup.founder_name || 'Founder'}</p>
              <p className="text-[10px] text-muted leading-none">Founder</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted flex items-center gap-1 bg-white border border-border px-2 py-1 rounded-lg">
              <TrendingUp size={12} className="text-coral" /> {(startup.supporters || 0).toLocaleString()}
            </span>
            <button
              onPointerDown={e => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); setShowShare(true) }}
              className="p-1.5 rounded-lg hover:bg-white border border-transparent hover:border-border text-muted hover:text-coral transition-all"
            >
              <Share2 size={14} />
            </button>
            <Link
              href={`/startup/${startup.id}`}
              onPointerDown={e => e.stopPropagation()}
              onClick={e => e.stopPropagation()}
              className="p-1.5 rounded-lg hover:bg-white border border-transparent hover:border-border text-muted hover:text-coral transition-all"
            >
              <ExternalLink size={14} />
            </Link>
          </div>
        </div>
      </div>

      {showShare && <ShareModal startup={startup} onClose={() => setShowShare(false)} />}
    </>
  )
}