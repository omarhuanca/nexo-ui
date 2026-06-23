import { useCallback, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { InvoicesFilters } from '../components/InvoicesFilters'
import { InvoicesFiltersSheet } from '../components/InvoicesFiltersSheet'
import { InvoicesTable } from '../components/InvoicesTable'
import {
  InvoicesPagination,
  InvoicesSummary,
} from '../components/InvoicesPagination'
import { InvoiceDetailDialog } from '../components/InvoiceDetailDialog'
import { useInvoices } from '../api/useInvoices'
import { useInvoiceFilters } from '../hooks/useInvoiceFilters'
import { invoicesKeys } from '../api/invoicesKeys'
import type { Sale } from '../types/sale'

export function InvoicesPage() {
  const queryClient = useQueryClient()
  const [filters, setFilters] = useInvoiceFilters()
  const [detailId, setDetailId] = useState<number | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const apiFilters = useMemo(
    () => ({
      status: filters.status as Sale['status'] | undefined,
      invoiceType: filters.invoiceType ?? undefined,
      transactionType: filters.transactionType ?? undefined,
      fiscalNumber: filters.fiscalNumber?.trim() || undefined,
      dateFrom: filters.dateFrom ?? undefined,
      dateTo: filters.dateTo ?? undefined,
      page: filters.page ?? 1,
      pageSize: filters.pageSize ?? 50,
    }),
    [filters],
  )

  const { data, isLoading, isError, error, isFetching, refetch } =
    useInvoices(apiFilters)

  const hasActiveFilters = useMemo(() => {
    return (
      !!filters.invoiceType ||
      !!filters.transactionType ||
      !!(filters.fiscalNumber && filters.fiscalNumber.length > 0) ||
      !!filters.dateFrom ||
      !!filters.dateTo
    )
  }, [filters])

  const sumAmount = useMemo(() => {
    if (!data?.data) return null
    return data.data.reduce((acc, s) => acc + (s.total_amount ?? 0), 0)
  }, [data])

  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: invoicesKeys.lists() })
    refetch()
  }, [queryClient, refetch])

  const handleClearFilters = useCallback(() => {
    setFilters(null)
  }, [setFilters])

  const handleRowClick = useCallback((sale: Sale) => {
    setDetailId(sale.id)
    setDetailOpen(true)
  }, [])

  const handlePageChange = useCallback(
    (page: number) => {
      setFilters({ page })
    },
    [setFilters],
  )

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-900">Invoices</h1>
        <p className="text-sm text-slate-500">
          Browse and inspect fiscalized invoices synced from TaxCore and Xero.
        </p>
      </header>

      <InvoicesSummary
        total={data?.pagination.total ?? 0}
        totalAmount={sumAmount}
        isLoading={isLoading}
      />

      <section
        className="flex flex-col gap-3 rounded-md border border-slate-200 bg-white p-4"
        aria-label="Filters"
      >
        <div className="hidden md:block">
          <InvoicesFilters onRefresh={handleRefresh} isFetching={isFetching} />
        </div>
        <div className="flex items-center justify-between md:hidden">
          <p className="text-sm text-slate-600">Filter invoices</p>
          <InvoicesFiltersSheet />
        </div>
      </section>

      <InvoicesTable
        sales={data?.data ?? []}
        isLoading={isLoading}
        isError={isError}
        isFetching={isFetching && !isLoading}
        errorMessage={isError ? error?.message : undefined}
        hasActiveFilters={hasActiveFilters || !!filters.status}
        onRowClick={handleRowClick}
        onClearFilters={handleClearFilters}
      />

      {data?.pagination ? (
        <InvoicesPagination
          pagination={data.pagination}
          onPageChange={handlePageChange}
        />
      ) : null}

      <InvoiceDetailDialog
        saleId={detailId}
        open={detailOpen}
        onOpenChange={(open) => {
          setDetailOpen(open)
          if (!open) setDetailId(null)
        }}
      />
    </div>
  )
}
