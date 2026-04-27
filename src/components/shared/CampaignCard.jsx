import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Tag } from 'lucide-react'
import { formatINR, dayDelta } from '@/lib/utils'

export default function CampaignCard({ campaign, brandName, onClick, trending }) {
  const c = campaign || {}
  return (
    <Card onClick={onClick} className="cursor-pointer flex flex-col gap-3" role="button" tabIndex={0}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wider text-muted">{brandName}</p>
          <h3 className="font-display text-lg mt-0.5 truncate">{c.title}</h3>
        </div>
        {trending && <Badge variant="hermes">Trending</Badge>}
      </div>

      <p className="text-sm text-muted line-clamp-2">{c.brief}</p>

      <div className="flex flex-wrap gap-1.5">
        {(c.deliverables || []).slice(0, 3).map((d) => (
          <Badge key={d} variant="cognac">{d}</Badge>
        ))}
        {(c.deliverables?.length || 0) > 3 && (
          <Badge variant="muted">+{c.deliverables.length - 3}</Badge>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-muted pt-1 border-t border-border/60">
        <span className="inline-flex items-center gap-1">
          <Tag className="h-3 w-3" /> {c.budget != null ? formatINR(c.budget) : 'Barter'}
        </span>
        <span className="inline-flex items-center gap-1">
          <Calendar className="h-3 w-3" /> {dayDelta(c.created_at)}
        </span>
      </div>
    </Card>
  )
}
