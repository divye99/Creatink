import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { AvailabilityBadge, VerifiedCreatorBadge } from './VerifiedBadges'
import { engagementColor, formatFollowers } from '@/lib/utils'

export default function CreatorStatCard({ creator, onClick }) {
  const c = creator || {}
  const niche = (c.niches || [])[0]
  const demo = c.top_demographic
  const demoString = demo
    ? [demo.age_range, demo.gender_split, demo.top_city].filter(Boolean).join(' · ')
    : null

  return (
    <Card
      onClick={onClick}
      className="cursor-pointer flex flex-col gap-2 p-4"
      role="button"
      tabIndex={0}
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarImage src={c.photo_url} alt={c.name} />
          <AvatarFallback>{c.name?.[0] || 'C'}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-base leading-none">{c.name}</h3>
          <p className="text-[10px] text-muted/80 mt-0.5">{c.handle || ''}</p>
        </div>
        {c.score != null && (
          <span className="text-[10px] tracking-[0.18em] uppercase text-cognac">{c.score}%</span>
        )}
      </div>

      {/* Inline stats — single row */}
      <div className="flex items-baseline gap-3 text-[10px]">
        <span className="text-muted/80 uppercase tracking-[0.18em] text-[9px]">Followers</span>
        <span className="font-display text-sm">{formatFollowers(c.follower_count)}</span>
        <span className="text-cognac/30">·</span>
        <span className="text-muted/80 uppercase tracking-[0.18em] text-[9px]">Eng</span>
        <span className={`font-display text-sm ${engagementColor(c.engagement_rate)}`}>
          {c.engagement_rate != null ? `${Number(c.engagement_rate).toFixed(1)}%` : '—'}
        </span>
      </div>

      <p className="text-[10.5px] leading-snug">
        <span className="text-muted/85">{[niche, demoString].filter(Boolean).join('  ·  ')}</span>
        {c.reasoning && (
          <>
            <span className="text-cognac/30 mx-1">/</span>
            <span className="text-cognac/85 italic">{c.reasoning}</span>
          </>
        )}
      </p>

      <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-cognac/15">
        <AvailabilityBadge availability={c.availability} />
        {c.verified && <VerifiedCreatorBadge />}
      </div>
    </Card>
  )
}
