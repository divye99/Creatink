import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const STAGES = [
  { key: 'applied',           label: 'Applied' },
  { key: 'in_discussion',     label: 'In Discussion' },
  { key: 'contracted',        label: 'Contracted' },
  { key: 'content_submitted', label: 'Content Submitted' },
  { key: 'approved',          label: 'Approved' },
  { key: 'payment_released',  label: 'Payment Released' },
]

export default function StatusPipeline({ status }) {
  const idx = Math.max(0, STAGES.findIndex((s) => s.key === status))
  const pct = ((idx + 1) / STAGES.length) * 100

  return (
    <div className="space-y-3">
      <div className="relative h-2 rounded-full bg-border overflow-hidden">
        <div className="absolute inset-y-0 left-0 bg-cognac transition-all" style={{ width: `${pct}%` }} />
      </div>
      <div className="grid grid-cols-6 gap-1 text-[10px]">
        {STAGES.map((s, i) => (
          <div key={s.key} className="flex flex-col items-center text-center gap-1">
            <div
              className={cn(
                'h-5 w-5 rounded-full flex items-center justify-center border',
                i <= idx ? 'bg-cognac border-cognac text-champagne' : 'bg-card border-border text-muted'
              )}
            >
              {i <= idx ? <Check className="h-3 w-3" strokeWidth={3} /> : <span>{i + 1}</span>}
            </div>
            <span className={cn('leading-tight', i <= idx ? 'text-body' : 'text-muted')}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export { STAGES }
