import { memo } from 'react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { SaleStatus } from '../types/sale'
import { formatStatus } from '../utils/formatters'

const STATUS_STYLES: Record<SaleStatus, string> = {
  completed: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-600/20',
  pending: 'bg-amber-100 text-amber-700 ring-1 ring-amber-600/20',
  processing: 'bg-blue-100 text-blue-700 ring-1 ring-blue-600/20',
  failed: 'bg-red-100 text-red-700 ring-1 ring-red-600/20',
}

interface StatusBadgeProps {
  status: SaleStatus
  className?: string
}

function StatusBadgeComponent({ status, className }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'border-transparent font-medium',
        STATUS_STYLES[status],
        className,
      )}
    >
      {formatStatus(status)}
    </Badge>
  )
}

export const StatusBadge = memo(StatusBadgeComponent)
