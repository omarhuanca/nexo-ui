import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorStateProps {
  message: string
  onRetry?: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-3 rounded-lg border border-red-200 bg-red-50 py-12 text-center"
    >
      <AlertTriangle className="h-8 w-8 text-red-600" aria-hidden="true" />
      <div>
        <p className="text-sm font-medium text-red-900">
          Something went wrong
        </p>
        <p className="mt-1 max-w-md text-sm text-red-700">{message}</p>
      </div>
      {onRetry ? (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  )
}
