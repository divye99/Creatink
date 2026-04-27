import * as React from 'react'
import { cn } from '@/lib/utils'

const styles = {
  default:   'bg-card text-body border border-border',
  champagne: 'bg-champagne/15 text-champagne border border-champagne/40',
  cognac:    'bg-cognac/15 text-cognac border border-cognac/40',
  slate:     'bg-slateblue/15 text-slateblue border border-slateblue/40',
  hermes:    'bg-hermes/15 text-hermes border border-hermes/40',
  success:   'bg-success/15 text-success border border-success/40',
  warning:   'bg-warning/15 text-warning border border-warning/40',
  error:     'bg-error/15 text-error border border-error/40',
  muted:     'bg-card text-muted border border-border/60',
}

export function Badge({ className, variant = 'default', children, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium',
        styles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
