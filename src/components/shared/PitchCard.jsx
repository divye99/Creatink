import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatINR, dayDelta } from '@/lib/utils'

export default function PitchCard({ pitch, counterpartyName, onAccept, onDecline, viewerIsReceiver }) {
  const p = pitch || {}
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted">
            {viewerIsReceiver ? 'Pitch from' : 'Pitch to'}
          </p>
          <h3 className="font-display text-lg mt-0.5">{counterpartyName}</h3>
        </div>
        <Badge variant={p.pitch_type === 'paid' ? 'champagne' : 'cognac'}>
          {p.pitch_type === 'paid' ? 'Paid Collab' : 'Gifting / Barter'}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted">Deliverables</div>
          <div className="mt-1 flex flex-wrap gap-1">
            {(p.deliverables || []).map((d) => <Badge key={d} variant="slate">{d}</Badge>)}
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted">Rate</div>
          <div className="font-display text-lg mt-1">
            {p.pitch_type === 'paid' ? formatINR(p.rate) : '—'}
          </div>
        </div>
      </div>

      {p.note && <p className="text-sm text-body/90 leading-relaxed">{p.note}</p>}

      <div className="flex items-center justify-between text-xs text-muted">
        <span>Sent {dayDelta(p.created_at)}</span>
        <Badge variant={p.status === 'accepted' ? 'success' : p.status === 'declined' ? 'error' : 'muted'}>
          {p.status}
        </Badge>
      </div>

      {viewerIsReceiver && p.status === 'pending' && (
        <div className="flex gap-2 pt-1">
          <Button onClick={onAccept} className="flex-1">Accept</Button>
          <Button variant="outline" onClick={onDecline} className="flex-1">Decline</Button>
        </div>
      )}
    </Card>
  )
}
