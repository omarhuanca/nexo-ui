import { memo } from 'react'
import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { LoadingState } from '@/components/feedback/LoadingState'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { AuditLog } from '../types/auditLog'

interface AuditLogsTableProps {
  logs: AuditLog[]
  isLoading: boolean
  isError: boolean
  errorMessage?: string
  onRetry: () => void
}

function formatDateTime(value: string): string {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'medium',
  }).format(date)
}

function AuditLogsTableComponent({
  logs,
  isLoading,
  isError,
  errorMessage,
  onRetry,
}: AuditLogsTableProps) {
  if (isLoading) {
    return <LoadingState />
  }

  if (isError) {
    return (
      <ErrorState
        message={
          errorMessage ?? 'Unable to load audit logs.'
        }
        onRetry={onRetry}
      />
    )
  }

  if (logs.length === 0) {
    return (
      <EmptyState
        message="No audit logs found"
        description="Try another date or clear the filters."
      />
    )
  }

  return (
    <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead>Message</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Channel</TableHead>
            <TableHead>Date and time</TableHead>
            <TableHead>Context</TableHead>
            <TableHead>Extra</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {logs.map((log, index) => (
            <TableRow
              key={`${log.datetime}-${index}`}
            >
              <TableCell className="min-w-56 font-medium text-slate-900">
                {log.message}
              </TableCell>

              <TableCell className="whitespace-nowrap">
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                  {log.level_name}
                </span>
              </TableCell>

              <TableCell className="text-slate-600">
                {log.channel}
              </TableCell>

              <TableCell className="whitespace-nowrap text-sm text-slate-600">
                {formatDateTime(log.datetime)}
              </TableCell>

              <TableCell>
                <details className="max-w-sm">
                  <summary className="cursor-pointer text-sm font-medium text-blue-700">
                    View context
                  </summary>

                  <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap break-words rounded bg-slate-50 p-2 text-xs text-slate-600">
                    {JSON.stringify(log.context, null, 2)}
                  </pre>
                </details>
              </TableCell>

              <TableCell>
                <details className="max-w-sm">
                  <summary className="cursor-pointer text-sm font-medium text-blue-700">
                    View extra
                  </summary>

                  <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap break-words rounded bg-slate-50 p-2 text-xs text-slate-600">
                    {JSON.stringify(log.extra, null, 2)}
                  </pre>
                </details>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export const AuditLogsTable = memo(
  AuditLogsTableComponent,
)