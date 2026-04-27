import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatINR, dayDelta } from '@/lib/utils'

export default function CampaignCard({ campaign, brandName, onClick, trending }) {
  const c = campaign || {}
  const dels = c.deliverables || []
  const delsSummary =
    dels.length === 0 ? '' :
    dels.length === 1 ? dels[0] :
    dels.length === 2 ? dels.join(' + ') :
    `${dels[0]} + ${dels.length - 1} more`

  return (
    <Card
      onClick={onClick}
      className="cursor-pointer flex flex-col gap-4"
      role="button"
      tabIndex={0}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase tracking-[0.18em] text-muted">{brandName}</p>
          <h3 className="font-display text-xl mt-1 leading-tight">{c.title}</h3>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          {trending && <Badge variant="hermes">Featured</Badge>}
          {c.score != null && <Badge variant="cognac">{c.score}%</Badge>}
        </div>
      </div>

      {c.brief && (
        <p className="text-sm text-muted line-clamp-2 leading-relaxed">{c.brief}</p>
      )}

      <div className="flex items-center justify-between gap-3 pt-3 border-t border-border/50 text-xs">
        <span className="text-muted">{delsSummary || '—'}</span>
        <span className="font-display text-base text-body">
          {c.budget != null ? formatINR(c.budget) : 'Barter'}
        </span>
      </div>

      {c.reasoning && (
        <p className="text-[11px] text-cognac/90 italic">{c.reasoning}</p>
      )}

      <p className="text-[10px] uppercase tracking-wider text-muted/70">{dayDelta(c.created_at)}</p>
    </Card>
  )
}
