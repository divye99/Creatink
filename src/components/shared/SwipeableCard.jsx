import { useRef, useState } from 'react'
import { cn, formatFollowers } from '@/lib/utils'

/**
 * Tinder-style swipeable creator card.
 *  - Pointer-driven: works for mouse + touch.
 *  - Tap (movement < 6px) → onTap.
 *  - Swipe up past threshold → exits + onSwipeUp.
 *  - Behind cards (slot > 0) are non-interactive visual stack.
 */
export default function SwipeableCard({ creator, isFront, slot = 0, onSwipeUp, onTap }) {
  const ref = useRef(null)
  const [drag, setDrag] = useState(null) // { startX, startY, x, y }
  const [exiting, setExiting] = useState(false)

  const c = creator || {}
  const demo = c.top_demographic
  const demoString = demo
    ? [demo.age_range, demo.gender_split, demo.top_city].filter(Boolean).join(' · ')
    : null

  const onPointerDown = (e) => {
    if (!isFront || exiting) return
    e.currentTarget.setPointerCapture(e.pointerId)
    setDrag({ startX: e.clientX, startY: e.clientY, x: e.clientX, y: e.clientY })
  }
  const onPointerMove = (e) => {
    if (!drag) return
    setDrag((d) => ({ ...d, x: e.clientX, y: e.clientY }))
  }
  const onPointerUp = () => {
    if (!drag) return
    const dx = drag.x - drag.startX
    const dy = drag.y - drag.startY
    const distance = Math.hypot(dx, dy)

    if (distance < 6) {
      onTap?.()
    } else if (dy < -110) {
      setExiting(true)
      setTimeout(() => onSwipeUp?.(), 320)
    }
    setDrag(null)
  }

  const dx = drag ? drag.x - drag.startX : 0
  const dy = drag ? drag.y - drag.startY : 0
  const dragging = drag != null

  // Stack offset for behind-cards
  const stackTransform = `translateY(${slot * 10}px) scale(${1 - slot * 0.04})`

  // Front card transform
  const dragTransform = `translate(${dx * 0.4}px, ${dy}px) rotate(${dx * 0.02}deg)`

  const exitTransform = `translateY(-120vh) rotate(-6deg)`

  const transform = exiting
    ? exitTransform
    : dragging
      ? dragTransform
      : isFront ? 'translateY(0) scale(1)' : stackTransform

  // Pass overlay opacity based on upward drag distance
  const passOpacity = isFront && dy < 0 ? Math.min(1, -dy / 120) : 0

  return (
    <div
      ref={ref}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className={cn(
        'absolute inset-0 rounded-lg overflow-hidden select-none',
        'bg-card border border-cognac/15 shadow-cognac',
        isFront ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none',
      )}
      style={{
        transform,
        opacity: exiting ? 0 : isFront ? 1 : 1 - slot * 0.18,
        transition: dragging ? 'none' : 'transform 320ms cubic-bezier(0.22, 1, 0.36, 1), opacity 280ms ease-out',
        touchAction: 'none',
      }}
    >
      {/* Photo background */}
      <img
        src={c.photo_url}
        alt={c.name}
        draggable={false}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />

      {/* Bottom gradient → text canvas */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/0 pointer-events-none" />

      {/* Match score (top right) */}
      {c.score != null && (
        <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-cognac/95 text-creme text-[10px] tracking-[0.2em] uppercase backdrop-blur-sm">
          {c.score}% match
        </div>
      )}

      {/* PASS overlay (visible while dragging up) */}
      {isFront && (
        <div
          className="absolute top-4 left-4 px-3 py-1 rounded-full bg-hermes text-creme text-[10px] uppercase tracking-[0.22em] transition-opacity"
          style={{ opacity: passOpacity }}
        >
          Pass
        </div>
      )}

      {/* Details overlay (bottom) */}
      <div className="absolute inset-x-0 bottom-0 p-5 text-creme">
        <h3 className="font-display text-3xl leading-none">{c.name}</h3>
        {c.handle && (
          <p className="text-[11px] text-creme/75 mt-1.5">{c.handle}</p>
        )}

        <div className="flex items-baseline gap-3 text-[11px] mt-3">
          <span className="text-creme/65 uppercase tracking-[0.18em] text-[9px]">Followers</span>
          <span className="font-display text-base">{formatFollowers(c.follower_count)}</span>
          <span className="text-creme/30">·</span>
          <span className="text-creme/65 uppercase tracking-[0.18em] text-[9px]">Eng</span>
          <span className="font-display text-base">
            {c.engagement_rate != null ? `${Number(c.engagement_rate).toFixed(1)}%` : '—'}
          </span>
        </div>

        <p className="text-[11px] text-creme/85 mt-3 leading-relaxed">
          {[c.niches?.[0], demoString].filter(Boolean).join('  ·  ')}
        </p>

        {c.reasoning && (
          <p className="text-[10.5px] text-creme/75 italic mt-2">{c.reasoning}</p>
        )}
      </div>
    </div>
  )
}
