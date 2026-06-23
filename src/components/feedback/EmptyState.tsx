import { Inbox } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  message: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({
  message,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-slate-200 bg-white py-16 text-center">
      <Inbox className="h-10 w-10 text-slate-400" aria-hidden="true" />
      <div>
        <p className="text-sm font-medium text-slate-900">{message}</p>
        {description ? (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        ) : null}
      </div>
      {actionLabel && onAction ? (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  )
}
