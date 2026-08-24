import { useCallback, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { AuditLogsFilters } from '../components/AuditLogsFilters'
import { AuditLogsPagination } from '../components/AuditLogsPagination'
import { AuditLogsTable } from '../components/AuditLogsTable'
import { auditLogsKeys } from '../api/auditLogsKeys'
import { useAuditLogs } from '../api/useAuditLogs'
import { useAuditLogFilters } from '../hooks/useAuditLogFilters'

export function AuditLogsPage() {
  const queryClient = useQueryClient()

  const [filters, setFilters] = useAuditLogFilters()

  const [draftDate, setDraftDate] = useState(filters.date ?? '')

  const [draftPerPage, setDraftPerPage] = useState(filters.perPage ?? 15)

  const apiFilters = useMemo(
    () => ({
      date: filters.date ?? undefined,
      page: filters.page ?? 1,
      perPage: filters.perPage ?? 15,
    }),
    [filters],
  )

  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useAuditLogs(apiFilters)

  const handleSearch = useCallback(() => {
    if (!draftDate) {
      return
    }

    setFilters({
      date: draftDate,
      perPage: draftPerPage,
      page: 1
    })
  },[
    draftDate,
    draftPerPage,
    setFilters
  ])

  const handleRefresh = useCallback(() => {
    if (!filters.date) {
      return
    }

    queryClient.invalidateQueries({
      queryKey: auditLogsKeys.lists(),
    })

    refetch()
  }, [
    filters.date,
    queryClient,
    refetch,
  ])

  const handleClear = useCallback(() => {
    setDraftDate('')
    setDraftPerPage(15)
    setFilters(null)
  }, [setFilters])

  const handlePageChange = useCallback(
    (page: number) => {
      setFilters({ page })
    },
    [setFilters],
  )

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-900">
          Audit logs
        </h1>

        <p className="text-sm text-slate-500">
          Review application and integration activity.
        </p>
      </header>

      <section
        className="rounded-md border border-slate-200 bg-white p-4"
        aria-label="Audit log filters"
      >
        <AuditLogsFilters
          date={draftDate}
          perPage={draftPerPage}
          isFetching={isFetching}
          onDateChange={setDraftDate}
          onPerPageChange={setDraftPerPage}
          onSearch={handleSearch}
          onRefresh={handleRefresh}
          onClear={handleClear}
        />
      </section>

      {!filters.date && !isLoading ? (
        <p className="rounded-md border border-dashed border-slate-200 bg-white py-12 text-center text-sm text-slate-500">
          Select a date and press Search to load audit logs.
        </p>
      ) : (
        <>
          <AuditLogsTable
            logs={data?.data ?? []}
            isLoading={isLoading}
            isError={isError}
            errorMessage={error?.message}
            onRetry={refetch}
          />

          <AuditLogsPagination
            pagination={data?.pagination}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  )
}