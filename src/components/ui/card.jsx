import * as React from 'react'
import { cn } from '@/lib/utils'

export const Card = React.forwardRef(({ className, glow = true, variant = 'default', ...props }, ref) => {
  const surface =
    variant === 'paper' ? 'bg-champagne text-bg' :
    variant === 'ink'   ? 'bg-inkslate text-body' :
                          'bg-card text-body'
  return (
    <div
      ref={ref}
      className={cn('rounded-lg border border-border p-6', surface, glow && 'card-glow', className)}
      {...props}
    />
  )
})
Card.displayName = 'Card'

export const CardHeader = ({ className, ...p }) => (
  <div className={cn('mb-3 space-y-1', className)} {...p} />
)
export const CardTitle = ({ className, ...p }) => (
  <h3 className={cn('font-display text-lg', className)} {...p} />
)
export const CardDescription = ({ className, ...p }) => (
  <p className={cn('text-sm text-muted', className)} {...p} />
)
export const CardContent = ({ className, ...p }) => (
  <div className={cn('', className)} {...p} />
)
export const CardFooter = ({ className, ...p }) => (
  <div className={cn('mt-4 flex items-center', className)} {...p} />
)
