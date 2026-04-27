import * as React from 'react'
import { cn } from '@/lib/utils'

export const Textarea = React.forwardRef(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'flex min-h-[100px] w-full rounded-md border border-border bg-card px-4 py-3 text-sm text-body',
      'placeholder:text-muted resize-none',
      'focus:border-champagne focus:outline-none focus:ring-2 focus:ring-champagne/40',
      className
    )}
    {...props}
  />
))
Textarea.displayName = 'Textarea'
