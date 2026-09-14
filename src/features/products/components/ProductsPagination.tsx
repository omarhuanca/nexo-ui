import { memo, useState, useTransition } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ApiPagination } from '@/types/api'

interface ProductsPaginationProps {
  pagination: ApiPagination | undefined
  onPageChange: (page: number) => void
}

function ProductsPaginationComponent({
  pagination,
  onPageChange,
}: ProductsPaginationProps) {
  const [isPending, startTransition] = useTransition()
  const [pendingPage, setPendingPage] = useState(0)

  if (!pagination) return undefined

  const { current_page: current, last_page: last, from, to, total } = pagination

  if (last <= 1) {
    return (
      <p className="text-sm text-slate-600" aria-live="polite">
        Showing {total} {total === 1 ? 'product' : 'products'}
      </p>
    )
  }

  const handlePageChange = (page: number) => {
    setPendingPage(page)
    startTransition(() => onPageChange(page))
  }

  const isChangingPage = isPending && pendingPage > 0

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-600" aria-live="polite">
        Showing {from || 0}–{to || 0} of{' '}
        <span className="font-medium text-slate-900">{total}</span>
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(current - 1)}
          disabled={current <= 1 || isChangingPage}
          aria-label="Previous page"
        >
          <ChevronLeft aria-hidden="true" />
          Previous
        </Button>
        <span className="px-3 text-sm tabular-nums text-slate-600">
          Page {current} of {last}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(current + 1)}
          disabled={current >= last || isChangingPage}
          aria-label="Next page"
        >
          Next
          <ChevronRight aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}

export const ProductsPagination = memo(ProductsPaginationComponent)
