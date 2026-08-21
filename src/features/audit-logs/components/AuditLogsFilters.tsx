import { memo } from 'react'
import { RefreshCw, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface AuditLogsFiltersProps {
  date: string,
  perPage: number,
  isFetching: boolean
  onDateChange: (date:string) => void
  onPerPageChange: (perPage: number) => void
  onSearch: () => void
  onRefresh: () => void
  onClear: () => void
}

function AuditLogsFiltersComponent({
  date,
  perPage,
  isFetching,
  onDateChange,
  onPerPageChange,
  onSearch,
  onRefresh,
  onClear,
}: AuditLogsFiltersProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end">
      <div className="w-full space-y-1.5 md:max-w-xs">
        <Label htmlFor="audit-log-date">Date</Label>
        <Input
          id="audit-log-date"
          type="date"
          value={date}
          onChange={(event) =>
          onDateChange(event.target.value)
          }
        />
      </div>

      <div className="w-full space-y-1.5 md:max-w-xs">
        <Label htmlFor="audit-log-per-page">Items per page</Label>
        <Input
          id="audit-log-per-page"
          type="number"
          min={1}
          max={100}
          value={perPage}
          onChange={(event) => {
            const value = Number(event.target.value)

            if (value >= 1 && value <= 100) {
              onPerPageChange(value)
            }
          }}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          onClick={onSearch}
          disabled={!date || isFetching}
        >
          <Search aria-hidden="true" />
            Search
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={!date || isFetching}
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
          onClick={onClear}
        >
          <X aria-hidden="true" />
          Clear
        </Button>
      </div>
    </div>
  )
}

export const AuditLogsFilters = memo(
  AuditLogsFiltersComponent,
)