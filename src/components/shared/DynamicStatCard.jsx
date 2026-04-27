import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Editorial luxury stat tile. Leather-gradient cognac, oversized italic
 * numeral, sequential index, trend indicator, hairline + chevron caption.
 * Hover: card lifts, number leans right, chevron slides toward target.
 */
export default function DynamicStatCard({
  href,
  eyebrow,
  number,
  caption,
  trend,
  trendLabel,
  index,
  showHermesDot = false,
}) {
  return (
    <Link to={href} className="block h-full group">
      <div
        className={cn(
          'relative h-full overflow-hidden bg-card border border-cognac/25 rounded-2xl',
          'p-5 text-body flex flex-col',
          'transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
          'shadow-cognac group-hover:shadow-glow group-hover:border-cognac/45 group-hover:-translate-y-0.5',
        )}
      >
        <div className="relative flex items-start justify-between">
          <p
            className="uppercase text-slateblue flex items-center gap-2"
            style={{ fontSize: 11, letterSpacing: '0.22em', fontWeight: 300 }}
          >
            {eyebrow}
            {showHermesDot && <span className="dot-hermes" />}
          </p>
          {index && (
            <span className="text-[11px] text-muted tracking-[0.22em]">
              {index}
            </span>
          )}
        </div>

        <p
          className="font-display text-champagne mt-3 leading-none"
          style={{ fontSize: 72, fontWeight: 800, letterSpacing: '-0.03em' }}
        >
          {number}
        </p>

        {trend && (
          <p className="text-[10px] uppercase tracking-[0.2em] text-success flex items-center gap-1 mt-3">
            <ArrowUpRight className="h-3 w-3" strokeWidth={2.4} />
            {trend}
            {trendLabel && <span className="text-muted ml-1">· {trendLabel}</span>}
          </p>
        )}

        <div className="relative mt-auto pt-4">
          <span className="block h-px bg-cognac/20 mb-3" />
          <div className="flex items-center justify-between gap-3">
            <p className="text-[12px] text-body/70 leading-snug">{caption}</p>
            <ArrowUpRight
              className="h-4 w-4 text-slateblue shrink-0 transition-all duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-champagne"
              strokeWidth={1.5}
            />
          </div>
        </div>
      </div>
    </Link>
  )
}
