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
import type { Sale } from '../types/sale'
import { printSale } from '../printing/printDocument'
type PrintMode = 'invoice' | 'slip'

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function buildPrintableHtml(sale: Sale, mode: PrintMode) {
  const payload = sale.payload
  const fiscalResult = sale.fiscal_result
  const items = payload?.items ?? []
  const invoiceNumber = sale.fiscal_number ?? sale.id
  const total = items.reduce(
    (sum, item) => sum + Number(item.totalAmount ?? item.unitPrice * item.quantity),
    0,
  )
  const tax = Number(payload?.taxAmount ?? 0)
  const vendor = payload?.buyer?.name ?? ''
  const storeName = payload?.storeName ?? ''
  const address = payload?.address ?? ''
  const buyer = payload?.buyer?.name ?? ''
  const verificationQr = fiscalResult?.verificationQRCode
  const qrValue = `${invoiceNumber}|${sale.created_at}`
  const qrImageUrl = verificationQr
    ? `data:image/gif;base64,${verificationQr}`
    : `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrValue)}`

  const rows = items.length
    ? items
        .map(
          (item) => `
            <tr>
              <td>${escapeHtml(item.name)}</td>
              <td>${Number(item.unitPrice ?? 0).toFixed(2)}</td>
              <td>${Number(item.quantity ?? 0)}</td>
              <td>${Number(item.totalAmount ?? Number(item.unitPrice ?? 0) * Number(item.quantity ?? 0)).toFixed(2)}</td>
            </tr>
          `,
        )
        .join('')
    : `
      <tr>
        <td colspan="4">No items available.</td>
      </tr>
    `

  if (mode === 'slip') {
    const journal = fiscalResult?.journal ?? ''
    const journalLines = journal ? journal.split(/\r?\n/) : []
    const journalBefore = verificationQr && journalLines.length > 1 ? journalLines.slice(0, -1).join('\n') : journal
    const journalFooter = verificationQr && journalLines.length > 1 ? journalLines[journalLines.length - 1] ?? '' : ''

    return `
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Slip Print</title>
          <style>
            @page { size: A4; margin: 10mm; }
            * { box-sizing: border-box; }
            body {
              margin: 0;
              background: #fff;
              color: #111;
              font-family: "Courier New", monospace;
              display: flex;
              justify-content: center;
              align-items: flex-start;
            }
            .page {
              width: 92mm;
              margin: 0 auto;
              padding: 8mm 0 0;
            }
            .header-row {
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 11px;
              line-height: 1.4;
            }
            .journal-flow {
              width: 100%;
              font-size: 10px;
              line-height: 1.35;
              margin: 0 auto;
            }
            .journal-flow pre {
              margin: 0;
              white-space: pre-wrap;
              word-break: break-word;
              font-family: "Courier New", monospace;
            }
            .qr-inline {
              float: right;
              width: 220px;
              height: 220px;
              margin: 4px 115px 8px 0;
              background: #fff;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 0;
              border: none;
            }
            .qr-inline img {
              display: block;
              width: 100%;
              height: 100%;
              object-fit: contain;
            }
            .journal-footer {
              clear: right;
              margin-top: 0;
            }
            @media print {
              body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <div class="page">
            <div class="header-row">
              <span>${new Date(sale.created_at).toLocaleDateString('en-CA')}</span>
                <span>${escapeHtml(String(invoiceNumber))}</span>
            </div>

            <div class="journal-flow">
              ${journalBefore ? `<pre>${escapeHtml(journalBefore)}</pre>` : ''}

              ${verificationQr ? `
                <div class="qr-inline">
                  <img data-qr="true" src="data:image/gif;base64,${verificationQr}" alt="Verification QR code" />
                </div>
              ` : ''}

              ${journalFooter ? `<pre class="journal-footer">${escapeHtml(journalFooter)}</pre>` : ''}
            </div>
          </div>
        </body>
      </html>
    `
  }

  return `
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Invoice Print</title>
        <style>
          body { margin: 0; font-family: Arial, sans-serif; background: #fff; color: #111; }
          .page { width: 210mm; min-height: 297mm; margin: 0 auto; padding: 14mm 12mm; box-sizing: border-box; }
          .header { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 14px; }
          .layout { display: grid; grid-template-columns: 1.2fr 220px; gap: 18px; align-items: start; }
          .info { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 18px; font-size: 12px; }
          .section { border-top: 1px solid #d1d5db; border-bottom: 1px solid #d1d5db; margin-top: 12px; padding: 6px 0; font-size: 12px; font-weight: 700; text-transform: uppercase; }
          table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 12px; }
          th, td { border-bottom: 1px solid #d1d5db; padding: 6px 4px; text-align: left; }
          .totals { margin-top: 18px; display: grid; grid-template-columns: 1fr auto; gap: 8px 18px; font-size: 12px; }
          .qr-box { width: 180px; height: 180px; border: 1px solid #111; margin: 0 auto; overflow: hidden; }
          .qr-box img { display: block; width: 100%; height: 100%; }
          @media print { body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="header">
            <span>${new Date(sale.created_at).toLocaleString()}</span>
            <strong>${escapeHtml(String(invoiceNumber))}</strong>
          </div>

          <div class="layout">
            <div>
              <div class="info">
                <div><strong>TIN:</strong> ${escapeHtml(String(payload?.taxId ?? ''))}</div>
                <div><strong>Invoice No:</strong> ${escapeHtml(String(invoiceNumber))}</div>
                <div><strong>Vendor:</strong> ${escapeHtml(vendor)}</div>
                <div><strong>Invoice is verified</strong></div>
                <div><strong>Store:</strong> ${escapeHtml(storeName)}</div>
                <div><strong>Status:</strong> ${escapeHtml(sale.status)}</div>
                <div><strong>Address:</strong> ${escapeHtml(address)}</div>
                <div><strong>Buyer:</strong> ${escapeHtml(buyer)}</div>
              </div>

              <div class="section">Items</div>

              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${rows}
                </tbody>
              </table>

              <div class="totals">
                <div><strong>Total Purchase:</strong></div>
                <div>${Number(total).toFixed(2)}</div>
                <div><strong>Total Tax:</strong></div>
                <div>${Number(tax).toFixed(2)}</div>
                <div><strong>Payment Method:</strong></div>
                <div>Cash</div>
                <div><strong>Invoice Type:</strong></div>
                <div>Proforma Sale</div>
              </div>
            </div>

            <div>
              <div class="qr-box">
                <img data-qr="true" src="${qrImageUrl}" alt="Invoice QR" />
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `
}

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
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false)
  const [printType, setPrintType] = useState<PrintMode>('invoice')
  const sale = data?.data

  const handleOpenPrintDialog = (type: PrintMode) => {
    setPrintType(type)
    setIsPrintDialogOpen(true)
  }

  const handlePrintConfirm = () => {
    if (!sale) return
    printSale(sale, (currentSale) => buildPrintableHtml(currentSale, printType))
    setIsPrintDialogOpen(false)
  }

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
      handleOpenPrintDialog('invoice')
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

      <Dialog
        open={isPrintDialogOpen}
        onOpenChange={(open) => {
          setIsPrintDialogOpen(open)
          if (!open) {
            setPrintType('invoice')
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select print type</DialogTitle>
            <DialogDescription>Choose the format you want to print.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input
                type="radio"
                name="printType"
                checked={printType === 'slip'}
                onChange={() => setPrintType('slip')}
              />
              <span>Print as slip</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="radio"
                name="printType"
                checked={printType === 'invoice'}
                onChange={() => setPrintType('invoice')}
              />
              <span>Print as invoice</span>
            </label>
          </div>

          <DialogFooter className="sm:justify-end">
            <Button variant="outline" type="button" onClick={() => setIsPrintDialogOpen(false)}>
              Close
            </Button>
            <Button type="button" onClick={handlePrintConfirm}>
              Print
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
