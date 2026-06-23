import { memo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatDateTime } from '../utils/formatters'
import { EmptyState } from '@/components/feedback/EmptyState'

interface InvoiceXeroTabProps {
  xero: Record<string, unknown> | null
}

const XERO_KEYS: ReadonlyArray<{ key: string; label: string; format?: 'currency' | 'date' }> = [
  { key: 'InvoiceID', label: 'Invoice ID' },
  { key: 'Id', label: 'Xero ID' },
  { key: 'Status', label: 'Status' },
  { key: 'Type', label: 'Type' },
  { key: 'Total', label: 'Total', format: 'currency' },
  { key: 'SubTotal', label: 'Subtotal', format: 'currency' },
  { key: 'TotalTax', label: 'Total tax', format: 'currency' },
  { key: 'AmountDue', label: 'Amount due', format: 'currency' },
  { key: 'AmountPaid', label: 'Amount paid', format: 'currency' },
  { key: 'DueDate', label: 'Due date', format: 'date' },
  { key: 'Date', label: 'Date', format: 'date' },
  { key: 'InvoiceNumber', label: 'Invoice number' },
  { key: 'Reference', label: 'Reference' },
  { key: 'CurrencyCode', label: 'Currency' },
]

function renderValue(value: unknown, format?: 'currency' | 'date'): string {
  if (value === null || value === undefined) return '—'
  if (format === 'currency') return formatCurrency(value as number)
  if (format === 'date') return formatDateTime(value as string)
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

function InvoiceXeroTabComponent({ xero }: InvoiceXeroTabProps) {
  if (!xero) {
    return <EmptyState message="No Xero data" description="This sale has not been synced with Xero." />
  }

  const inner = Array.isArray(xero.Invoices) && xero.Invoices.length > 0
    ? (xero.Invoices[0] as Record<string, unknown>)
    : null

  const source = inner ?? xero

  const known = XERO_KEYS.filter((k) => k.key in source).map((k) => ({
    label: k.label,
    value: renderValue(source[k.key], k.format),
  }))

  const knownKeys = new Set(XERO_KEYS.map((k) => k.key))
  const extras = Object.entries(source)
    .filter(([k]) => !knownKeys.has(k))
    .map(([k, v]) => ({ label: k, value: renderValue(v) }))

  const rows = [...known, ...extras]

  if (rows.length === 0) {
    return <EmptyState message="No Xero data" />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Xero</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm md:grid-cols-2">
          {rows.map((row) => (
            <div key={row.label}>
              <dt className="text-xs uppercase tracking-wide text-slate-500">
                {row.label}
              </dt>
              <dd className="break-all font-mono text-xs text-slate-900">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  )
}

export const InvoiceXeroTab = memo(InvoiceXeroTabComponent)
