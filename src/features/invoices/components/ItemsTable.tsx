import { memo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency } from '../utils/formatters'
import type { SaleItem } from '../types/sale'

interface ItemsTableProps {
  items: SaleItem[]
}

function ItemsTableComponent({ items }: ItemsTableProps) {
  if (!items || items.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-slate-200 py-10 text-center text-sm text-slate-500">
        No items
      </div>
    )
  }
  const total = items.reduce((sum, item) => sum + (item.totalAmount ?? 0), 0)
  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Qty</TableHead>
            <TableHead className="text-right">Unit price</TableHead>
            <TableHead>Labels</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, idx) => (
            <TableRow key={`${item.code ?? 'item'}-${idx}`}>
              <TableCell className="font-mono text-xs text-slate-500">
                {item.code ?? '—'}
              </TableCell>
              <TableCell className="font-medium text-slate-900">
                {item.name}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {item.quantity}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatCurrency(item.unitPrice)}
              </TableCell>
              <TableCell>
                {item.labels && item.labels.length > 0 ? (
                  <span className="inline-flex flex-wrap gap-1">
                    {item.labels.map((label) => (
                      <span
                        key={label}
                        className="inline-flex items-center rounded bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-700"
                      >
                        {label}
                      </span>
                    ))}
                  </span>
                ) : (
                  <span className="text-slate-400">—</span>
                )}
              </TableCell>
              <TableCell className="text-right font-medium tabular-nums">
                {formatCurrency(item.totalAmount)}
              </TableCell>
            </TableRow>
          ))}
          <TableRow className="bg-slate-50/60 font-medium">
            <TableCell colSpan={5} className="text-right text-slate-700">
              Total
            </TableCell>
            <TableCell className="text-right tabular-nums text-slate-900">
              {formatCurrency(total)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

export const ItemsTable = memo(ItemsTableComponent)
