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
      className="cursor-pointer flex flex-col gap-3"
      role="button"
      tabIndex={0}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[9px] uppercase tracking-[0.2em] text-cognac/70">{brandName}</p>
          <h3 className="font-display text-lg mt-1 leading-tight">{c.title}</h3>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          {trending && <Badge variant="hermes">Featured</Badge>}
          {c.score != null && <Badge variant="cognac">{c.score}%</Badge>}
        </div>
      </div>

      {c.brief && (
        <p className="text-xs text-muted/90 line-clamp-2 leading-relaxed">{c.brief}</p>
      )}

      <div className="flex items-center justify-between gap-3 pt-2.5 border-t border-cognac/15 text-[11px]">
        <span className="text-muted">{delsSummary || '—'}</span>
        <span className="font-display text-base">
          {c.budget != null ? formatINR(c.budget) : 'Barter'}
        </span>
      </div>

      {c.reasoning && (
        <p className="text-[10px] text-cognac/85 italic -mt-0.5">{c.reasoning}</p>
      )}

      <p className="text-[9px] uppercase tracking-[0.18em] text-muted/70 -mt-0.5">{dayDelta(c.created_at)}</p>
    </Card>
  )
}
