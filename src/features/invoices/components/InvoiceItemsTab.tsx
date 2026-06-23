import { memo } from 'react'
import { ItemsTable } from './ItemsTable'
import type { SaleItem } from '../types/sale'

interface InvoiceItemsTabProps {
  items: SaleItem[] | null
}

function InvoiceItemsTabComponent({ items }: InvoiceItemsTabProps) {
  return <ItemsTable items={items ?? []} />
}

export const InvoiceItemsTab = memo(InvoiceItemsTabComponent)
