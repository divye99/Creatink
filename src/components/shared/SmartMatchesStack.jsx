import { useEffect, useState } from 'react'
import SwipeableCard from './SwipeableCard'
import SwipeableCampaignCard from './SwipeableCampaignCard'

export default function SmartMatchesStack({ matches, onTap, variant = 'creator' }) {
  const [stack, setStack] = useState(matches || [])

  useEffect(() => { setStack(matches || []) }, [matches])

  const handleSwipeUp = () => {
    setStack((s) => s.slice(1))
  }

  if (!stack || stack.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <p className="text-[10px] uppercase tracking-[0.22em] text-cognac/70">All caught up</p>
        <h3 className="font-display text-2xl mt-2">No more matches today</h3>
        <p className="text-sm text-muted mt-3">Check back tomorrow for new picks.</p>
      </div>
    )
  }

  const visible = stack.slice(0, 3)
  const isCampaign = variant === 'campaign'

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative w-full max-w-sm aspect-[3/4]"
        style={{ touchAction: 'pan-y' }}
      >
        {visible.slice().reverse().map((c, idxFromBack) => {
          const slot = visible.length - 1 - idxFromBack
          const isFront = slot === 0
          const key = isCampaign
            ? (c.campaign_id || c.id)
            : (c.creator_id || c.user_id)
          return isCampaign ? (
            <SwipeableCampaignCard
              key={key}
              campaign={c}
              isFront={isFront}
              slot={slot}
              onSwipeUp={handleSwipeUp}
              onTap={() => onTap?.(c)}
            />
          ) : (
            <SwipeableCard
              key={key}
              creator={c}
              isFront={isFront}
              slot={slot}
              onSwipeUp={handleSwipeUp}
              onTap={() => onTap?.(c)}
            />
          )
        })}
      </div>

      <p className="text-center text-[10px] uppercase tracking-[0.22em] text-cognac/55 mt-6">
        Tap to open  ·  Swipe up to pass
      </p>
    </div>
  )
}
