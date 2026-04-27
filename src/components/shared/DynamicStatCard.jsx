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
          'relative h-full overflow-hidden border border-cognac/70',
          'p-5 text-champagne flex flex-col',
          'transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
          'shadow-[0_18px_40px_-22px_rgba(139,94,60,0.55)]',
          'group-hover:shadow-[0_28px_56px_-22px_rgba(139,94,60,0.7)]',
          'group-hover:-translate-y-1',
        )}
        style={{
          backgroundImage:
            'linear-gradient(135deg, #9C6B47 0%, #7B5232 55%, #5F3E25 100%)',
          borderRadius: '28px 4px 28px 4px', // tl tr br bl — diagonal asymmetry
        }}
      >
        {/* Diagonal pinstripe — barely-there texture */}
        <span
          aria-hidden
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(135deg, transparent 0, transparent 7px, #F2E7D3 7px, #F2E7D3 8px)',
          }}
        />
        {/* Soft inner light from top-left */}
        <span
          aria-hidden
          className="absolute -top-12 -left-12 w-40 h-40 rounded-full opacity-[0.18] pointer-events-none blur-2xl"
          style={{ background: 'radial-gradient(circle, #F2E7D3 0%, transparent 70%)' }}
        />

        {/* Top row — eyebrow + index */}
        <div className="relative flex items-start justify-between">
          <p className="text-[10px] uppercase tracking-[0.22em] text-champagne/75 flex items-center gap-2">
            {eyebrow}
            {showHermesDot && <span className="dot-hermes" />}
          </p>
          {index && (
            <span className="font-display italic text-[12px] text-champagne/40 tracking-[0.18em]">
              {index}
            </span>
          )}
        </div>

        {/* Hero number */}
        <div className="relative mt-3 flex items-baseline gap-2.5">
          <p className="font-display text-[64px] leading-[0.9] transition-transform duration-500 group-hover:translate-x-1 origin-left">
            {number}
          </p>
          {trend && (
            <p className="text-[9px] uppercase tracking-[0.2em] text-hermes/95 flex items-center gap-0.5 mb-1.5">
              <ArrowUpRight className="h-2.5 w-2.5" strokeWidth={2.4} />
              {trend}
            </p>
          )}
        </div>
        {trendLabel && (
          <p className="relative text-[9px] uppercase tracking-[0.22em] text-champagne/45 mt-1.5">
            {trendLabel}
          </p>
        )}

        {/* Hairline + caption + chevron */}
        <div className="relative mt-auto pt-4">
          <span className="block h-px bg-champagne/15 mb-3" />
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] text-champagne/75 leading-snug">{caption}</p>
            <ArrowUpRight
              className="h-3.5 w-3.5 text-champagne/55 shrink-0 transition-all duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-champagne/95"
              strokeWidth={1.5}
            />
          </div>
        </div>
      </div>
    </Link>
  )
}
