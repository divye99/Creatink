import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  AvailabilityBadge,
  CastinkLinkedBadge,
  TaxReadyBadge,
  VerifiedCreatorBadge,
} from './VerifiedBadges'
import { engagementColor, formatFollowers } from '@/lib/utils'
import { Users, TrendingUp, MapPin } from 'lucide-react'

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
      className="cursor-pointer flex flex-col gap-4"
      role="button"
      tabIndex={0}
    >
      <div className="flex items-start gap-4">
        <Avatar className="h-14 w-14">
          <AvatarImage src={c.photo_url} alt={c.name} />
          <AvatarFallback>{c.name?.[0] || 'C'}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-lg truncate">{c.name}</h3>
          </div>
          <p className="text-sm text-muted truncate">{c.handle || ''}</p>
          <div className="mt-1 flex flex-wrap items-center gap-1">
            {niche && <Badge variant="slate">{niche}</Badge>}
            {c.score != null && <Badge variant="cognac">{c.score}% match</Badge>}
          </div>
        </div>
      </div>
      {c.reasoning && (
        <p className="text-xs text-muted -mt-1">{c.reasoning}</p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-md bg-slateblue/15 p-3">
          <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted">
            <Users className="h-3 w-3" /> Followers
          </div>
          <div className="font-display text-2xl mt-1">{formatFollowers(c.follower_count)}</div>
        </div>
        <div className="rounded-md bg-slateblue/15 p-3">
          <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted">
            <TrendingUp className="h-3 w-3" /> Engagement
          </div>
          <div className={`font-display text-2xl mt-1 ${engagementColor(c.engagement_rate)}`}>
            {c.engagement_rate != null ? `${Number(c.engagement_rate).toFixed(1)}%` : '—'}
          </div>
        </div>
      </div>

      {demoString && (
        <div className="flex items-center gap-1 text-xs text-muted">
          <MapPin className="h-3 w-3" /> {demoString}
        </div>
      )}

      <div className="flex flex-wrap gap-1.5 mt-1">
        <AvailabilityBadge availability={c.availability} />
        {c.verified && <VerifiedCreatorBadge />}
        {c.tax_ready && <TaxReadyBadge />}
        {c.castink_linked && <CastinkLinkedBadge />}
      </div>
    </Card>
  )
}
