import { memo } from 'react'
import { AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { BuyerInfoCard } from './BuyerInfoCard'
import { formatCurrency, formatDateTime } from '../utils/formatters'
import {
  INVOICE_TYPES,
  PAYMENT_TYPES,
  TRANSACTION_TYPES,
} from '../utils/constants'
import type { Sale } from '../types/sale'

interface InvoiceOverviewTabProps {
  sale: Sale
}

function InvoiceOverviewTabComponent({ sale }: InvoiceOverviewTabProps) {
  const { payload, fiscal_result: fiscal, status, error_message: error, attempts } = sale
  const buyer = payload?.buyer
  const tin = fiscal?.tin ?? null
  const invoiceType = payload
    ? (INVOICE_TYPES.get(payload.invoiceType) ?? `Type ${payload.invoiceType}`)
    : '—'
  const transactionType = payload
    ? (TRANSACTION_TYPES.get(payload.transactionType) ??
        `Type ${payload.transactionType}`)
    : '—'

  return (
    <div className="space-y-6">
      {status === 'failed' && error ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-md border border-red-200 bg-red-50 p-4 text-sm"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 text-red-600" aria-hidden="true" />
          <div>
            <p className="font-medium text-red-900">
              Fiscalization failed (attempt {attempts})
            </p>
            <p className="mt-0.5 text-red-700">{error}</p>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <BuyerInfoCard buyer={buyer} tin={tin} />

        <Card>
          <CardHeader>
            <CardTitle>Payment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {payload?.payment && payload.payment.length > 0 ? (
              payload.payment.map((p, idx) => (
                <div
                  key={`${p.paymentType}-${idx}`}
                  className="flex items-center justify-between"
                >
                  <span className="text-slate-600">
                    {PAYMENT_TYPES.get(p.paymentType) ?? `Type ${p.paymentType}`}
                  </span>
                  <span className="font-medium tabular-nums text-slate-900">
                    {formatCurrency(p.amount)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-slate-500">No payment recorded</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Metadata</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm md:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">
                Invoice type
              </dt>
              <dd className="text-slate-900">{invoiceType}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">
                Transaction type
              </dt>
              <dd className="text-slate-900">{transactionType}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">
                Cashier
              </dt>
              <dd className="text-slate-900">{payload?.cashier ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">
                Total
              </dt>
              <dd className="font-medium text-slate-900">
                {formatCurrency(sale.total_amount)}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">
                SDC Date
              </dt>
              <dd className="text-slate-900">{formatDateTime(sale.sdc_date_time)}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">
                Processed at
              </dt>
              <dd className="text-slate-900">{formatDateTime(sale.processed_at)}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">
                Created at
              </dt>
              <dd className="text-slate-900">{formatDateTime(sale.created_at)}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">
                Due date
              </dt>
              <dd className="text-slate-900">{payload?.dueDate ?? '—'}</dd>
            </div>
          </dl>
          <Separator className="my-4" />
          {fiscal ? (
            <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm md:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">
                  Business name
                </dt>
                <dd className="text-slate-900">{fiscal.businessName ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">
                  Location
                </dt>
                <dd className="text-slate-900">{fiscal.locationName ?? '—'}</dd>
              </div>
              <div className="md:col-span-2">
                <dt className="text-xs uppercase tracking-wide text-slate-500">
                  Address
                </dt>
                <dd className="text-slate-900">{fiscal.address ?? '—'}</dd>
              </div>
            </dl>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}

export const InvoiceOverviewTab = memo(InvoiceOverviewTabComponent)
