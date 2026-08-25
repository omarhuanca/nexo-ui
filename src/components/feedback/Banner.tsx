import type { LucideIcon } from 'lucide-react'
import { Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type BannerVariant = 'info' | 'warning'

interface BannerAction {
  label: string
  onClick: () => void
}

interface BannerProps {
  title: string
  description?: string
  variant?: BannerVariant
  icon?: LucideIcon
  action?: BannerAction
  className?: string
}

const variantStyles: Record<BannerVariant, string> = {
  info: 'border-sky-200 bg-sky-50 text-sky-900',
  warning: 'border-amber-200 bg-amber-50 text-amber-900',
}

const variantIconStyles: Record<BannerVariant, string> = {
  info: 'text-sky-600',
  warning: 'text-amber-600',
}

export function Banner({
  title,
  description,
  variant = 'info',
  icon: Icon = Info,
  action,
  className,
}: BannerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex flex-col gap-4 rounded-lg border p-6 sm:flex-row sm:items-start sm:gap-4',
        variantStyles[variant],
        className,
      )}
    >
      <Icon
        className={cn('h-6 w-6 shrink-0', variantIconStyles[variant])}
        aria-hidden="true"
      />
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium">{title}</p>
        {description ? (
          <p className="text-sm opacity-90">{description}</p>
        ) : null}
      </div>
      {action ? (
        <Button
          variant="outline"
          size="sm"
          onClick={action.onClick}
          className="self-stretch sm:self-auto"
        >
          {action.label}
        </Button>
      ) : null}
    </div>
  )
}