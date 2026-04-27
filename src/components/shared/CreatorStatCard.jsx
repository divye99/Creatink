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
      className="cursor-pointer flex flex-col gap-3.5"
      role="button"
      tabIndex={0}
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-11 w-11">
          <AvatarImage src={c.photo_url} alt={c.name} />
          <AvatarFallback>{c.name?.[0] || 'C'}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg leading-tight">{c.name}</h3>
          <p className="text-xs text-muted/90 mt-0.5">{c.handle || ''}</p>
        </div>
        {c.score != null && <Badge variant="cognac">{c.score}%</Badge>}
      </div>

      {/* Stats — divider not boxes, smaller numbers */}
      <div className="grid grid-cols-2 divide-x divide-cognac/15">
        <div className="pr-3">
          <p className="text-[9px] uppercase tracking-[0.18em] text-muted">Followers</p>
          <p className="font-display text-xl mt-0.5">{formatFollowers(c.follower_count)}</p>
        </div>
        <div className="pl-3">
          <p className="text-[9px] uppercase tracking-[0.18em] text-muted">Engagement</p>
          <p className={`font-display text-xl mt-0.5 ${engagementColor(c.engagement_rate)}`}>
            {c.engagement_rate != null ? `${Number(c.engagement_rate).toFixed(1)}%` : '—'}
          </p>
        </div>
      </div>

      {/* Inline metadata + reasoning combined */}
      <div className="text-[11px] leading-relaxed">
        <span className="text-muted/90">{[niche, demoString].filter(Boolean).join('  ·  ')}</span>
        {c.reasoning && (
          <>
            <span className="text-cognac/30 mx-1.5">/</span>
            <span className="text-cognac/85 italic">{c.reasoning}</span>
          </>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-1.5 pt-2.5 border-t border-cognac/15">
        <AvailabilityBadge availability={c.availability} />
        {c.verified && <VerifiedCreatorBadge />}
        {c.castink_linked && <CastinkLinkedBadge />}
      </div>
    </Card>
  )
}
