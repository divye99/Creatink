import { cn } from '@/lib/utils'

export default function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center py-16 px-4', className)}>
      {Icon && (
        <div className="h-14 w-14 rounded-full bg-card flex items-center justify-center mb-4 border border-border">
          <Icon className="h-6 w-6 text-cognac" />
        </div>
      )}
      <h3 className="font-display text-xl">{title}</h3>
      {description && <p className="text-sm text-muted mt-2 max-w-sm">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
