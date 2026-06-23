import { memo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { StatusBadge } from './StatusBadge'
import { InvoiceOverviewTab } from './InvoiceOverviewTab'
import { InvoiceItemsTab } from './InvoiceItemsTab'
import { InvoiceFiscalTab } from './InvoiceFiscalTab'
import { InvoiceXeroTab } from './InvoiceXeroTab'
import { formatDateTime, truncate } from '../utils/formatters'
import { useInvoice } from '../api/useInvoice'
import type { Sale } from '../types/sale'

interface InvoiceDetailDialogProps {
  saleId: number | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function HeaderContent({ sale }: { sale: Sale }) {
  return (
    <>
      <DialogTitle>Invoice #{sale.id}</DialogTitle>
      <DialogDescription className="mt-1 flex flex-wrap items-center gap-2">
        <StatusBadge status={sale.status} />
        <span className="font-mono text-xs text-slate-700">
          {sale.fiscal_number ? truncate(sale.fiscal_number, 32) : 'No fiscal #'}
        </span>
        {sale.xero_invoice_id ? (
          <span className="font-mono text-xs text-slate-500">
            · Xero {sale.xero_invoice_id.slice(0, 8)}
          </span>
        ) : null}
        <span className="text-xs text-slate-500">
          · {formatDateTime(sale.created_at)}
        </span>
      </DialogDescription>
    </>
  )
}

function HeaderSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-4 w-64" />
    </div>
  )
}

function InvoiceDetailDialogComponent({
  saleId,
  open,
  onOpenChange,
}: InvoiceDetailDialogProps) {
  const { data, isLoading, isError, error, refetch } = useInvoice(saleId)
  const sale = data?.data

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex max-h-[90vh] max-w-4xl flex-col gap-0 overflow-hidden p-0"
      >
        <DialogHeader className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-4">
          {isLoading || !sale ? <HeaderSkeleton /> : <HeaderContent sale={sale} />}
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-4">
            {isError ? (
              <p className="text-sm text-red-700" role="alert">
                {error?.message}{' '}
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="ml-2 text-blue-700 underline"
                >
                  Retry
                </button>
              </p>
            ) : null}

            {!sale && isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-9 w-72" />
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
              </div>
            ) : sale ? (
              <Tabs defaultValue="overview" className="w-full">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="items">Items</TabsTrigger>
                  <TabsTrigger value="fiscal">Fiscal</TabsTrigger>
                  <TabsTrigger value="xero">Xero</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="mt-4">
                  <InvoiceOverviewTab sale={sale} />
                </TabsContent>
                <TabsContent value="items" className="mt-4">
                  <InvoiceItemsTab items={sale.payload?.items ?? null} />
                </TabsContent>
                <TabsContent value="fiscal" className="mt-4">
                  <InvoiceFiscalTab fiscal={sale.fiscal_result} />
                </TabsContent>
                <TabsContent value="xero" className="mt-4">
                  <InvoiceXeroTab xero={sale.xero_result} />
                </TabsContent>
              </Tabs>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export const InvoiceDetailDialog = memo(InvoiceDetailDialogComponent)
