import { cn } from '@/lib/utils'

export default function BrandCard({ brand, onClick }) {
  const b = brand || {}
  const cats = (b.categories || []).slice(0, 3)
  const verified = b.gst_pan
  const contractReady = Boolean(b.contract_vault_url)

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative w-full aspect-[16/7] rounded-lg overflow-hidden',
        'border border-cognac/15 group text-left',
        'transition-all duration-500 hover:border-cognac/40',
      )}
    >
      {b.logo_url && (
        <img
          src={b.logo_url}
          alt={b.name}
          loading="lazy"
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover scale-105 blur-[1.5px] opacity-90 transition-transform duration-700 group-hover:scale-[1.1]"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-br from-cognac/35 via-black/65 to-black/92 pointer-events-none" />

      {verified && (
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-cognac/95 text-champagne text-[9px] tracking-[0.18em] uppercase backdrop-blur-sm">
          Verified
        </div>
      )}

      {b.logo_url && (
        <div className="absolute top-3 left-3">
          <img
            src={b.logo_url}
            alt=""
            draggable={false}
            className="w-10 h-10 rounded-md border border-champagne/40 object-cover"
          />
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 p-4 text-creme">
        <h3 className="font-display text-xl leading-none">{b.name}</h3>
        {b.description && (
          <p className="text-[11px] text-creme/80 mt-2 leading-relaxed line-clamp-2 max-w-prose">
            {b.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-1.5 mt-3">
          {cats.map((c) => (
            <span
              key={c}
              className="px-2 py-0.5 rounded-full bg-white/10 text-creme/85 text-[9px] tracking-[0.18em] uppercase backdrop-blur-sm"
            >
              {c}
            </span>
          ))}
          {contractReady && (
            <span className="px-2 py-0.5 rounded-full bg-cognac/90 text-champagne text-[9px] tracking-[0.18em] uppercase">
              Contract ready
            </span>
          )}
        </div>
      </div>
    </button>
  )
}
