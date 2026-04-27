import { formatFollowers, engagementColor } from '@/lib/utils'
import { cn } from '@/lib/utils'

/**
 * Discover-page creator card. Photo of the creator as full background,
 * darkened, with white editorial text overlay. Static (no swipe).
 */
export default function DiscoverCreatorCard({ creator, onClick }) {
  const c = creator || {}
  const niche = (c.niches || [])[0]
  const demo = c.top_demographic
  const demoString = demo
    ? [demo.age_range, demo.gender_split, demo.top_city].filter(Boolean).join(' · ')
    : null

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative w-full aspect-[16/7] rounded-lg overflow-hidden',
        'border border-cognac/15 group text-left',
        'transition-all duration-500 hover:border-cognac/40',
      )}
    >
      {/* Photo */}
      {c.photo_url && (
        <img
          src={c.photo_url}
          alt={c.name}
          loading="lazy"
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      )}

      {/* Darkening overlay — heavier than SwipeableCard for editorial mood */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/35 pointer-events-none" />

      {/* Match score top-right (if present) */}
      {c.score != null && (
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-cognac/95 text-champagne text-[9px] tracking-[0.18em] uppercase backdrop-blur-sm">
          {c.score}%
        </div>
      )}

      {/* Verified pill top-left */}
      {c.verified && (
        <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-hermes/95 text-white text-[9px] tracking-[0.18em] uppercase">
          Verified
        </div>
      )}

      {/* Bottom-bound details */}
      <div className="absolute inset-x-0 bottom-0 p-4 text-white">
        <h3 className="font-display text-xl leading-none">{c.name}</h3>
        {c.handle && (
          <p className="text-[10px] text-white/70 mt-1">{c.handle}</p>
        )}

        <div className="flex items-baseline gap-2 mt-2.5 text-[10px]">
          <span className="text-white/55 uppercase tracking-[0.18em] text-[8.5px]">Foll.</span>
          <span className="font-display text-sm">{formatFollowers(c.follower_count)}</span>
          <span className="text-white/30">·</span>
          <span className="text-white/55 uppercase tracking-[0.18em] text-[8.5px]">Eng</span>
          <span className={cn('font-display text-sm', engagementColor(c.engagement_rate).replace('text-', 'text-'))}>
            {c.engagement_rate != null ? `${Number(c.engagement_rate).toFixed(1)}%` : '—'}
          </span>
        </div>

        <p className="text-[10px] text-white/75 mt-2 leading-relaxed">
          {[niche, demoString].filter(Boolean).join('  ·  ')}
        </p>
      </div>
    </button>
  )
}
