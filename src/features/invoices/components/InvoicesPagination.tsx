import { memo, useMemo, useState, useTransition } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency } from '../utils/formatters'
import type { ApiPagination } from '@/types/api'

interface InvoicesPaginationProps {
  pagination: ApiPagination | undefined
  onPageChange: (page: number) => void
}

function buildPageWindow(current: number, last: number): (number | 'ellipsis')[] {
  if (last <= 7) {
    return Array.from({ length: last }, (_, i) => i + 1)
  }
  const pages: (number | 'ellipsis')[] = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(last - 1, current + 1)
  if (start > 2) pages.push('ellipsis')
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < last - 1) pages.push('ellipsis')
  pages.push(last)
  return pages
}

function InvoicesPaginationComponent({
  pagination,
  onPageChange,
}: InvoicesPaginationProps) {
  const [isPending, startTransition] = useTransition()
  const [internalPage, setInternalPage] = useState<number | null>(null)

  if (!pagination) return null
  const { current_page: current, last_page: last, from, to, total } = pagination
  if (last <= 1) {
    return (
      <p className="text-sm text-slate-600" aria-live="polite">
        Showing {total} {total === 1 ? 'invoice' : 'invoices'}
      </p>
    )
  }

  const handleClick = (page: number) => {
    setInternalPage(page)
    startTransition(() => {
      onPageChange(page)
    })
  }

  const window = buildPageWindow(current, last)
  const showSkeleton = isPending && internalPage !== null

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-600" aria-live="polite">
        Showing {from ?? 0}–{to ?? 0} of{' '}
        <span className="font-medium text-slate-900">{total}</span>
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleClick(current - 1)}
          disabled={current <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft aria-hidden="true" />
          Previous
        </Button>
        {window.map((p, i) =>
          p === 'ellipsis' ? (
            <span
              key={`ellipsis-${i}`}
              className="px-2 text-slate-400"
              aria-hidden="true"
            >
              …
            </span>
          ) : (
            <Button
              key={p}
              variant={p === current ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleClick(p)}
              aria-current={p === current ? 'page' : undefined}
              aria-label={`Go to page ${p}`}
              disabled={showSkeleton && p !== current}
            >
              {p}
            </Button>
          ),
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleClick(current + 1)}
          disabled={current >= last}
          aria-label="Next page"
        >
          Next
          <ChevronRight aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}

export const InvoicesPagination = memo(InvoicesPaginationComponent)

interface InvoicesSummaryProps {
  total: number
  totalAmount: number | null
  isLoading: boolean
}

function InvoicesSummaryComponent({
  total,
  totalAmount,
  isLoading,
}: InvoicesSummaryProps) {
  const amount = useMemo(() => {
    if (totalAmount === null || totalAmount === undefined) return null
    return formatCurrency(totalAmount)
  }, [totalAmount])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    )
  }
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="rounded-md border border-slate-200 bg-white p-4">
        <p className="text-xs uppercase tracking-wide text-slate-500">Total invoices</p>
        <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">
          {total}
        </p>
      </div>
      <div className="rounded-md border border-slate-200 bg-white p-4">
        <p className="text-xs uppercase tracking-wide text-slate-500">Sum amount</p>
        <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">
          {amount ?? '—'}
        </p>
      </div>
    </div>
  )
}

export const InvoicesSummary = memo(InvoicesSummaryComponent)
