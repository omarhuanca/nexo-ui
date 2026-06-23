import { memo } from 'react'
import { format, parseISO } from 'date-fns'
import { Calendar as CalendarIcon, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'

interface DatePickerProps {
  value: string | null | undefined
  onChange: (value: string | null) => void
  placeholder?: string
  ariaLabel: string
  disabled?: (date: Date) => boolean
}

function DatePickerComponent({
  value,
  onChange,
  placeholder = 'Pick a date',
  ariaLabel,
  disabled,
}: DatePickerProps) {
  const date = value ? parseISO(value) : undefined
  const display = value ? format(parseISO(value), 'PP') : placeholder

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn(
            'h-9 w-[150px] justify-start text-left font-normal',
            !value && 'text-muted-foreground',
          )}
          aria-label={ariaLabel}
        >
          <CalendarIcon className="mr-2 h-4 w-4" aria-hidden="true" />
          {display}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selected) => {
            if (!selected) {
              onChange(null)
            } else {
              onChange(format(selected, 'yyyy-MM-dd'))
            }
          }}
          disabled={disabled}
          autoFocus
        />
        {value ? (
          <div className="border-t p-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => onChange(null)}
            >
              <X className="mr-1 h-3 w-3" aria-hidden="true" />
              Clear
            </Button>
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  )
}

export const DatePicker = memo(DatePickerComponent)

interface SearchInputProps {
  value: string
  onChange: (next: string) => void
  onFocus?: () => void
  onBlur?: () => void
  placeholder?: string
  ariaLabel: string
}

function SearchInputComponent({
  value,
  onChange,
  onFocus,
  onBlur,
  placeholder = 'Search…',
  ariaLabel,
}: SearchInputProps) {
  return (
    <div className="relative">
      <Search
        className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        aria-hidden="true"
      />
      <Input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="h-9 w-[200px] pl-8"
      />
    </div>
  )
}

export const SearchInput = memo(SearchInputComponent)
