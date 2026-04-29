import { useRef, useState } from 'react'
import { cn, formatINR, dayDelta } from '@/lib/utils'

export default function SwipeableCampaignCard({ campaign, isFront, slot = 0, onSwipeUp, onTap }) {
  const ref = useRef(null)
  const [drag, setDrag] = useState(null)
  const [exiting, setExiting] = useState(false)

  const c = campaign || {}
  const dels = c.deliverables || []
  const delsSummary =
    dels.length === 0 ? '' :
    dels.length <= 2 ? dels.join(' + ') :
    `${dels.slice(0, 2).join(' + ')} + ${dels.length - 2} more`

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

  const stackTransform = `translateY(${slot * 10}px) scale(${1 - slot * 0.04})`
  const dragTransform = `translate(${dx * 0.4}px, ${dy}px) rotate(${dx * 0.02}deg)`
  const exitTransform = `translateY(-120vh) rotate(-6deg)`

  const transform = exiting
    ? exitTransform
    : dragging
      ? dragTransform
      : isFront ? 'translateY(0) scale(1)' : stackTransform

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
      {c.brand_logo_url && (
        <>
          <img
            src={c.brand_logo_url}
            alt={c.brand_name || ''}
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none scale-105 blur-[1.5px] opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-cognac/40 via-black/75 to-black/96 pointer-events-none" />
        </>
      )}
      {!c.brand_logo_url && (
        <div className="absolute inset-0 bg-gradient-to-br from-cognac via-body to-[#2a1a10] pointer-events-none" />
      )}

      {c.score != null && (
        <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-cognac/95 text-creme text-[10px] tracking-[0.2em] uppercase backdrop-blur-sm">
          {c.score}% match
        </div>
      )}

      {isFront && (
        <div
          className="absolute top-4 left-4 px-3 py-1 rounded-full bg-hermes text-creme text-[10px] uppercase tracking-[0.22em] transition-opacity"
          style={{ opacity: passOpacity }}
        >
          Pass
        </div>
      )}

      {c.brand_logo_url && (
        <div className="absolute top-14 left-4 flex items-center gap-2.5">
          <img
            src={c.brand_logo_url}
            alt=""
            draggable={false}
            className="w-9 h-9 rounded-full border border-champagne/40 object-cover"
          />
          <p className="text-[10px] uppercase tracking-[0.22em] text-champagne/85">{c.brand_name}</p>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 p-5 text-creme">
        <h3 className="font-display text-3xl leading-tight">{c.title}</h3>

        {c.brief && (
          <p className="text-[12px] text-creme/85 mt-3 leading-relaxed line-clamp-3">{c.brief}</p>
        )}

        <div className="flex items-baseline gap-3 text-[11px] mt-4 pt-4 border-t border-white/15">
          <span className="text-creme/65 uppercase tracking-[0.18em] text-[9px]">Deliverables</span>
          <span className="text-creme/95">{delsSummary || '—'}</span>
        </div>

        <div className="flex items-baseline justify-between gap-3 mt-2.5">
          <div className="flex items-baseline gap-2">
            <span className="text-creme/65 uppercase tracking-[0.18em] text-[9px]">Budget</span>
            <span className="font-display text-lg">
              {c.budget != null ? formatINR(c.budget) : 'Barter'}
            </span>
          </div>
          <span className="text-[9px] uppercase tracking-[0.18em] text-creme/55">{dayDelta(c.created_at)}</span>
        </div>

        {c.reasoning && (
          <p className="text-[10.5px] text-creme/75 italic mt-3">{c.reasoning}</p>
        )}
      </div>
    </div>
  )
}
