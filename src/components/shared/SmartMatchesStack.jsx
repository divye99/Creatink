import { useEffect, useState } from 'react'
import SwipeableCard from './SwipeableCard'

/**
 * Stack of SwipeableCards. Top card is interactive; cards behind
 * are visual peeks. Swipe up dismisses the front card.
 */
export default function SmartMatchesStack({ matches, onTap }) {
  const [stack, setStack] = useState(matches || [])

  // If matches prop changes (eg. on profile load), reset
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

  // Render top 3 cards in DOM (back-to-front for z-index stacking)
  const visible = stack.slice(0, 3)

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative w-full max-w-sm aspect-[3/4]"
        style={{ touchAction: 'pan-y' }}
      >
        {visible.slice().reverse().map((c, idxFromBack) => {
          const slot = visible.length - 1 - idxFromBack // 0 = front
          const isFront = slot === 0
          return (
            <SwipeableCard
              key={c.creator_id || c.user_id}
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
