import * as React from 'react'
import { cn } from '@/lib/utils'

export const Input = React.forwardRef(({ className, type = 'text', ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn(
      'flex h-11 w-full rounded-md border border-border bg-card px-4 py-2 text-sm text-body',
      'placeholder:text-muted',
      'focus:border-cognac focus:outline-none focus:ring-2 focus:ring-cognac/40',
      'disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {...props}
  />
))
Input.displayName = 'Input'
