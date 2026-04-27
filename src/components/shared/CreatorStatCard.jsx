import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  AvailabilityBadge,
  CastinkLinkedBadge,
  VerifiedCreatorBadge,
} from './VerifiedBadges'
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
      className="cursor-pointer flex flex-col gap-5"
      role="button"
      tabIndex={0}
    >
      <div className="flex items-start gap-4">
        <Avatar className="h-14 w-14">
          <AvatarImage src={c.photo_url} alt={c.name} />
          <AvatarFallback>{c.name?.[0] || 'C'}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-xl leading-tight">{c.name}</h3>
          <p className="text-sm text-muted/90 mt-0.5">{c.handle || ''}</p>
        </div>
        {c.score != null && <Badge variant="cognac">{c.score}%</Badge>}
      </div>

      {/* Stats — two clean numbers, dividers not boxes */}
      <div className="grid grid-cols-2 divide-x divide-border/40">
        <div className="pr-4">
          <p className="text-[10px] uppercase tracking-[0.18em] text-muted">Followers</p>
          <p className="font-display text-2xl mt-1">{formatFollowers(c.follower_count)}</p>
        </div>
        <div className="pl-4">
          <p className="text-[10px] uppercase tracking-[0.18em] text-muted">Engagement</p>
          <p className={`font-display text-2xl mt-1 ${engagementColor(c.engagement_rate)}`}>
            {c.engagement_rate != null ? `${Number(c.engagement_rate).toFixed(1)}%` : '—'}
          </p>
        </div>
      </div>

      {/* Single inline metadata line — no chip clutter */}
      <div className="text-xs text-muted/90 leading-relaxed">
        {[niche, demoString].filter(Boolean).join('  ·  ')}
      </div>

      {c.reasoning && (
        <p className="text-[11px] text-cognac/90 italic">{c.reasoning}</p>
      )}

      <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-border/50">
        <AvailabilityBadge availability={c.availability} />
        {c.verified && <VerifiedCreatorBadge />}
        {c.castink_linked && <CastinkLinkedBadge />}
      </div>
    </Card>
  )
}
