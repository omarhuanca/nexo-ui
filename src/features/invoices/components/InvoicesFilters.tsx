import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { RefreshCw, X, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DatePicker, SearchInput } from './FiltersControls'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { useInvoiceFilters } from '../hooks/useInvoiceFilters'
import {
  INVOICE_TYPES,
  STATUS_LABELS,
  STATUS_ORDER,
  TRANSACTION_TYPES,
} from '../utils/constants'
import type { SaleStatus } from '../types/sale'

const ALL = 'all'

interface InvoicesFiltersProps {
  onRefresh: () => void
  isFetching: boolean
}

function InvoicesFiltersComponent({ onRefresh, isFetching }: InvoicesFiltersProps) {
  const [filters, setFilters] = useInvoiceFilters()

  const [searchInput, setSearchInput] = useState(filters.fiscalNumber ?? '')
  const searchFocusedRef = useRef(false)
  const debouncedSearch = useDebouncedValue(searchInput, 300)

  useEffect(() => {
    const next = debouncedSearch.trim()
    if (next === (filters.fiscalNumber ?? '')) return
    setFilters({ fiscalNumber: next || null })
  }, [debouncedSearch, filters.fiscalNumber, setFilters])

  useEffect(() => {
    if (!searchFocusedRef.current) {
      setSearchInput(filters.fiscalNumber ?? '')
    }
  }, [filters.fiscalNumber])

  const handleStatusChange = useCallback(
    (value: string) => {
      setFilters({
        status: value === ALL ? null : (value as SaleStatus),
      })
    },
    [setFilters],
  )

  const handleInvoiceTypeChange = useCallback(
    (value: string) => {
      setFilters({ invoiceType: value === ALL ? null : Number(value) })
    },
    [setFilters],
  )

  const handleTransactionTypeChange = useCallback(
    (value: string) => {
      setFilters({ transactionType: value === ALL ? null : Number(value) })
    },
    [setFilters],
  )

  const handleDateFromChange = useCallback(
    (value: string | null) => {
      setFilters({ dateFrom: value })
    },
    [setFilters],
  )

  const handleDateToChange = useCallback(
    (value: string | null) => {
      setFilters({ dateTo: value })
    },
    [setFilters],
  )

  const handleClear = useCallback(() => {
    setSearchInput('')
    setFilters(null)
  }, [setFilters])

  const dateToMin = filters.dateFrom ? new Date(filters.dateFrom) : undefined

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        value={filters.status ?? ALL}
        onValueChange={handleStatusChange}
      >
        <SelectTrigger className="h-9 w-[160px]" aria-label="Filter by status">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All statuses</SelectItem>
          {STATUS_ORDER.map((s) => (
            <SelectItem key={s} value={s}>
              {STATUS_LABELS.get(s)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.invoiceType?.toString() ?? ALL}
        onValueChange={handleInvoiceTypeChange}
      >
        <SelectTrigger className="h-9 w-[160px]" aria-label="Filter by invoice type">
          <SelectValue placeholder="Invoice type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All types</SelectItem>
          {Array.from(INVOICE_TYPES.entries()).map(([k, v]) => (
            <SelectItem key={k} value={k.toString()}>
              {v}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.transactionType?.toString() ?? ALL}
        onValueChange={handleTransactionTypeChange}
      >
        <SelectTrigger className="h-9 w-[160px]" aria-label="Filter by transaction type">
          <SelectValue placeholder="Transaction" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All</SelectItem>
          {Array.from(TRANSACTION_TYPES.entries()).map(([k, v]) => (
            <SelectItem key={k} value={k.toString()}>
              {v}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <DatePicker
        value={filters.dateFrom ?? null}
        onChange={handleDateFromChange}
        ariaLabel="Filter from date"
      />
      <DatePicker
        value={filters.dateTo ?? null}
        onChange={handleDateToChange}
        ariaLabel="Filter to date"
        disabled={dateToMin ? (d) => d < dateToMin : undefined}
      />

      <SearchInput
        value={searchInput}
        onChange={setSearchInput}
        onFocus={() => {
          searchFocusedRef.current = true
        }}
        onBlur={() => {
          searchFocusedRef.current = false
        }}
        placeholder="Search fiscal #…"
        ariaLabel="Search by fiscal number"
      />

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onRefresh}
        disabled={isFetching}
        aria-label="Refresh invoices"
      >
        <RefreshCw
          className={isFetching ? 'animate-spin' : ''}
          aria-hidden="true"
        />
        Refresh
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleClear}
        aria-label="Clear filters"
      >
        <X aria-hidden="true" />
        Clear
      </Button>

      <span className="sr-only">
        <SlidersHorizontal aria-hidden="true" />
        Filters
      </span>
    </div>
  )
}

export const InvoicesFilters = memo(InvoicesFiltersComponent)
