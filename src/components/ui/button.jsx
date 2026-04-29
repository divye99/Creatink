import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:     'bg-cognac text-champagne hover:brightness-110 shadow-cognac',
        secondary:   'bg-card text-body border border-border hover:border-cognac/60',
        ghost:       'text-body hover:bg-card',
        outline:     'border border-cognac/40 text-body hover:border-cognac hover:bg-card',
        destructive: 'bg-error text-creme hover:brightness-110',
        link:        'text-cognac underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-11 px-5 py-2',
        sm:      'h-9  px-4 text-xs',
        lg:      'h-12 px-7 text-base',
        icon:    'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button'
  return <Comp ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />
})
Button.displayName = 'Button'

export { Button, buttonVariants }
