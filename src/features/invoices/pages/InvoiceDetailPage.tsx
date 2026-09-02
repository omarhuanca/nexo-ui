import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { OrganizationRequiredNotice } from '@/features/organizations/components/OrganizationRequiredNotice'
import { ORGANIZATION_NONE, useActiveOrganization } from '@/features/organizations/hooks/useActiveOrganization'
import { StatusBadge } from '../components/StatusBadge'
import { InvoiceOverviewTab } from '../components/InvoiceOverviewTab'
import { InvoiceItemsTab } from '../components/InvoiceItemsTab'
import { InvoiceFiscalTab } from '../components/InvoiceFiscalTab'
import { InvoiceXeroTab } from '../components/InvoiceXeroTab'
import { InvoiceActionsPanel } from '../components/InvoiceActionsPanel'
import { useInvoice } from '../api/useInvoice'
import { useCompleteSale } from '../api/useCompleteSale'
import { formatDateTime, truncate } from '../utils/formatters'
import { INVOICE_TYPES } from '../utils/constants'
import { getInvoiceActions } from '../utils/invoiceActions'

export function InvoiceDetailPage() {
  const { invoiceId } = useParams()
  const navigate = useNavigate()
  const { organizationId } = useActiveOrganization()
  const id = Number(invoiceId)

  const { data, isLoading, isError, error } = useInvoice(id)
  const { mutateAsync: completeSaleMutation, isPending: isCompletingSale } = useCompleteSale()
  const [isTokenDialogOpen, setIsTokenDialogOpen] = useState(false)
  const [connectorToken, setConnectorToken] = useState('')
  const [connectorTokenError, setConnectorTokenError] = useState('')
  const sale = data?.data

  const handleCompleteSaleClick = () => {
    if (!sale) return
    setConnectorTokenError('')
    setConnectorToken('')
    setIsTokenDialogOpen(true)
  }

  const handleConfirmCompleteSale = async () => {
    if (!sale) return

    const token = connectorToken.trim()
    if (!token) {
      setConnectorTokenError('Connector token is required.')
      return
    }

    await completeSaleMutation({ sale, connectorToken: token })
    setIsTokenDialogOpen(false)
    setConnectorToken('')
    setConnectorTokenError('')
  }

  const actions = getInvoiceActions(sale?.payload?.invoiceType, {
    print: () => {
      console.log('Print invoice', sale?.id)
    },
    completeSale: () => {
      if (isCompletingSale) return
      handleCompleteSaleClick()
    },
    copyInvoice: () => {
      console.log('Copy invoice', sale?.id)
    },
    cancelInvoice: () => {
      console.log('Cancel invoice', sale?.id)
    },
    refundReceipt: () => {
      console.log('Refund receipt', sale?.id)
    },
    reissue: () => {
      console.log('Reissue invoice', sale?.id)
    },
    duplicate: () => {
      console.log('Duplicate invoice', sale?.id)
    },
  })

  if (organizationId === ORGANIZATION_NONE) {
    return <OrganizationRequiredNotice />
  }

  if (isLoading) {
    return <div className="text-sm text-slate-500">Loading invoice...</div>
  }

  if (isError) {
    return <div className="text-sm text-red-700">{error?.message}</div>
  }

  if (!sale) {
    return <div className="text-sm text-slate-500">Loading invoice...</div>
  }

  return (
    <div className="space-y-6">
      <header className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={() => {
              const search = organizationId !== ORGANIZATION_NONE ? `?org=${organizationId}` : ''
              navigate(`/invoices${search}`)
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to invoices
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold text-slate-900">
            Invoice #{sale.id}
          </h1>
          <StatusBadge status={sale.status} />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <span className="font-mono text-xs text-slate-700">
            {sale.fiscal_number ? truncate(sale.fiscal_number, 32) : 'No fiscal #'}
          </span>
          <span className="hidden sm:inline">·</span>
          <span>
            {INVOICE_TYPES.get(sale.payload?.invoiceType ?? 0) ??
              `Type ${sale.payload?.invoiceType ?? 'Unknown'}`}
          </span>
          <span className="hidden sm:inline">·</span>
          <span>{formatDateTime(sale.created_at)}</span>
        </div>
      </header>

      <InvoiceActionsPanel title="Available invoice actions" actions={actions} />

      <Dialog
        open={isTokenDialogOpen}
        onOpenChange={(open) => {
          setIsTokenDialogOpen(open)
          if (!open) {
            setConnectorToken('')
            setConnectorTokenError('')
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connector token</DialogTitle>
            <DialogDescription>
              Enter the connector token for this request. It is used only for this call and is not stored.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="connector-token">Token</Label>
            <Input
              id="connector-token"
              type="password"
              value={connectorToken}
              onChange={(event) => {
                setConnectorToken(event.target.value)
                if (connectorTokenError) {
                  setConnectorTokenError('')
                }
              }}
              placeholder="Paste connector token"
              autoComplete="off"
            />
            {connectorTokenError ? (
              <p className="text-sm text-red-600">{connectorTokenError}</p>
            ) : null}
          </div>

          <DialogFooter className="sm:justify-end">
            <Button variant="outline" type="button" onClick={() => setIsTokenDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={() => void handleConfirmCompleteSale()} disabled={isCompletingSale}>
              {isCompletingSale ? 'Sending...' : 'Confirm sale'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
    </div>
  )
}
