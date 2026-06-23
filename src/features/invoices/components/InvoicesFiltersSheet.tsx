import { memo, useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useInvoiceFilters } from '../hooks/useInvoiceFilters'
import {
  INVOICE_TYPES,
  STATUS_LABELS,
  STATUS_ORDER,
  TRANSACTION_TYPES,
} from '../utils/constants'
import type { SaleStatus } from '../types/sale'

const ALL = 'all'

function InvoicesFiltersSheetComponent() {
  const [open, setOpen] = useState(false)
  const [filters, setFilters] = useInvoiceFilters()

  const handleClear = () => {
    setFilters(null)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="md:hidden">
          <SlidersHorizontal className="mr-1" aria-hidden="true" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>
            Narrow down the list of invoices.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="mobile-status">Status</Label>
            <Select
              value={filters.status ?? ALL}
              onValueChange={(v) =>
                setFilters({ status: v === ALL ? null : (v as SaleStatus) })
              }
            >
              <SelectTrigger id="mobile-status" className="h-9 w-full">
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
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="mobile-invoice-type">Invoice type</Label>
            <Select
              value={filters.invoiceType?.toString() ?? ALL}
              onValueChange={(v) =>
                setFilters({ invoiceType: v === ALL ? null : Number(v) })
              }
            >
              <SelectTrigger id="mobile-invoice-type" className="h-9 w-full">
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
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="mobile-transaction">Transaction</Label>
            <Select
              value={filters.transactionType?.toString() ?? ALL}
              onValueChange={(v) =>
                setFilters({ transactionType: v === ALL ? null : Number(v) })
              }
            >
              <SelectTrigger id="mobile-transaction" className="h-9 w-full">
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
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="mobile-fiscal">Fiscal number</Label>
            <Input
              id="mobile-fiscal"
              type="search"
              value={filters.fiscalNumber ?? ''}
              onChange={(e) =>
                setFilters({
                  fiscalNumber: e.target.value || null,
                })
              }
              placeholder="e.g. CPLP77KX-…"
              className="h-9 w-full"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleClear}
            >
              <X aria-hidden="true" />
              Clear
            </Button>
            <Button
              type="button"
              className="flex-1"
              onClick={() => setOpen(false)}
            >
              Apply
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export const InvoicesFiltersSheet = memo(InvoicesFiltersSheetComponent)
