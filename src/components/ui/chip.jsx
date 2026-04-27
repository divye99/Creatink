import * as React from 'react'
import { cn } from '@/lib/utils'

export function Chip({ active, className, children, ...props }) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition',
        active
          ? 'bg-cognac text-champagne border-cognac'
          : 'bg-card text-body border-border hover:border-cognac/60',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
