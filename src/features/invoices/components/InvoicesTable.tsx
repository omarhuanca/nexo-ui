import { memo, useCallback, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type Row,
} from '@tanstack/react-table'
import { Eye } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { StatusBadge } from './StatusBadge'
import { formatCurrency, formatDateTime, truncate } from '../utils/formatters'
import { api } from '@/lib/api'
import { env } from '@/lib/env'
import { invoicesKeys } from '../api/invoicesKeys'
import type { SingleResponse, Sale } from '../types/sale'
import { cn } from '@/lib/utils'

const PREFETCH_DELAY_MS = 100

interface InvoicesTableProps {
  sales: Sale[]
  isLoading: boolean
  isError: boolean
  isFetching: boolean
  errorMessage?: string
  hasActiveFilters: boolean
  onRowClick: (sale: Sale) => void
  onClearFilters: () => void
}

function LoadingSkeleton() {
  return (
    <div className="space-y-2" aria-busy="true">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  )
}

const columns: ColumnDef<Sale>[] = [
  {
    id: 'id',
    header: 'ID',
    accessorKey: 'id',
    cell: ({ getValue }) => (
      <span className="font-mono text-xs text-slate-500">
        #{getValue<number>()}
      </span>
    ),
  },
  {
    id: 'status',
    header: 'Status',
    accessorKey: 'status',
    cell: ({ getValue }) => <StatusBadge status={getValue<Sale['status']>()} />,
  },
  {
    id: 'fiscal_number',
    header: 'Fiscal #',
    accessorKey: 'fiscal_number',
    cell: ({ getValue }) => {
      const value = getValue<string | null>()
      return (
        <span className="font-mono text-xs text-slate-700">
          {value ? truncate(value, 28) : '—'}
        </span>
      )
    },
  },
  {
    id: 'buyer',
    header: 'Buyer',
    accessorFn: (row) => row.payload?.buyer?.name ?? '',
    cell: ({ getValue }) => (
      <span className="text-sm text-slate-900">
        {(getValue<string>() || '—') as string}
      </span>
    ),
  },
  {
    id: 'total',
    header: () => <div className="text-right">Total</div>,
    accessorKey: 'total_amount',
    cell: ({ getValue }) => (
      <div className="text-right font-medium tabular-nums">
        {formatCurrency(getValue<number | null>())}
      </div>
    ),
  },
  {
    id: 'sdc_date_time',
    header: 'SDC date',
    accessorKey: 'sdc_date_time',
    cell: ({ getValue }) => (
      <span className="text-xs text-slate-600">
        {formatDateTime(getValue<string | null>())}
      </span>
    ),
  },
  {
    id: 'created_at',
    header: 'Created',
    accessorKey: 'created_at',
    cell: ({ getValue }) => (
      <span className="text-xs text-slate-600">
        {formatDateTime(getValue<string>())}
      </span>
    ),
  },
  {
    id: 'actions',
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <div className="text-right">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={(e) => {
            e.stopPropagation()
          }}
          aria-label={`View invoice ${row.original.id}`}
        >
          <Eye className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    ),
  },
]

function InvoicesTableComponent({
  sales,
  isLoading,
  isError,
  isFetching,
  errorMessage,
  hasActiveFilters,
  onRowClick,
  onClearFilters,
}: InvoicesTableProps) {
  const queryClient = useQueryClient()
  const hoverTimerRef = useRef<number | null>(null)

  const handlePrefetch = useCallback(
    (id: number) => {
      queryClient.prefetchQuery({
        queryKey: invoicesKeys.detail(id),
        queryFn: async () => {
          const { data } = await api.get<SingleResponse<Sale>>(
            `/integrations/taxcore/invoices/${id}?organization_id=${env.VITE_DEFAULT_ORGANIZATION_ID}`,
          )
          return data
        },
        staleTime: 60_000,
      })
    },
    [queryClient],
  )

  const handleMouseEnter = useCallback(
    (row: Row<Sale>) => {
      if (hoverTimerRef.current) {
        window.clearTimeout(hoverTimerRef.current)
      }
      const id = row.original.id
      hoverTimerRef.current = window.setTimeout(() => {
        handlePrefetch(id)
      }, PREFETCH_DELAY_MS)
    },
    [handlePrefetch],
  )

  const handleMouseLeave = useCallback(() => {
    if (hoverTimerRef.current) {
      window.clearTimeout(hoverTimerRef.current)
      hoverTimerRef.current = null
    }
  }, [])

  const handleRowKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTableRowElement>, row: Row<Sale>) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        onRowClick(row.original)
      }
    },
    [onRowClick],
  )

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: sales,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (isLoading) return <LoadingSkeleton />

  if (isError) {
    return (
      <div
        role="alert"
        className="rounded-md border border-red-200 bg-red-50 p-6 text-sm text-red-800"
      >
        <p className="font-medium">Failed to load invoices</p>
        <p className="mt-1">{errorMessage ?? 'Unknown error'}</p>
      </div>
    )
  }

  if (sales.length === 0) {
    if (hasActiveFilters) {
      return (
        <div className="rounded-md border border-dashed border-slate-200 bg-white py-16 text-center">
          <p className="text-sm font-medium text-slate-900">
            No invoices match these filters
          </p>
          <button
            type="button"
            onClick={onClearFilters}
            className="mt-3 text-sm font-medium text-blue-700 hover:underline"
          >
            Clear filters
          </button>
        </div>
      )
    }
    return (
      <div className="rounded-md border border-dashed border-slate-200 bg-white py-16 text-center">
        <p className="text-sm font-medium text-slate-900">No invoices yet</p>
        <p className="mt-1 text-sm text-slate-500">
          Once invoices are fiscalized, they'll appear here.
        </p>
      </div>
    )
  }

  return (
    <div className="relative">
      {isFetching ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 rounded-md bg-white/40"
        />
      ) : null}
      <div className="overflow-x-auto rounded-md border border-slate-200 bg-white">
        <Table>
          <caption className="sr-only">Invoices list</caption>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    scope="col"
                    style={{
                      contentVisibility: 'auto',
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                role="button"
                tabIndex={0}
                aria-label={`Open invoice ${row.original.id}`}
                onClick={() => onRowClick(row.original)}
                onKeyDown={(e) => handleRowKeyDown(e, row)}
                onMouseEnter={() => handleMouseEnter(row)}
                onMouseLeave={handleMouseLeave}
                className={cn('cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring')}
                style={{ contentVisibility: 'auto', containIntrinsicSize: '0 48px' }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export const InvoicesTable = memo(InvoicesTableComponent)
