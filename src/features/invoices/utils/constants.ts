import type { InvoiceType, SaleStatus, TransactionType } from '../types/sale'

export const STATUS_LABELS = new Map<SaleStatus, string>([
  ['pending', 'Pending'],
  ['processing', 'Processing'],
  ['completed', 'Completed'],
  ['failed', 'Failed'],
])

export const INVOICE_TYPES = new Map<InvoiceType, string>([
  [0, 'Normal'],
  [1, 'ProForma'],
  [2, 'Copy'],
  [3, 'Training'],
  [4, 'Advance'],
])

export const TRANSACTION_TYPES = new Map<TransactionType, string>([
  [0, 'Sale'],
  [1, 'Refund'],
])

export const PAYMENT_TYPES = new Map<number, string>([
  [0, 'Other'],
  [1, 'Cash'],
  [2, 'Card'],
  [3, 'Check'],
  [4, 'Wire Transfer'],
  [5, 'Voucher'],
  [6, 'Mobile Money'],
])

export const STATUS_ORDER: SaleStatus[] = [
  'pending',
  'processing',
  'completed',
  'failed',
]

export const DEFAULT_PAGE_SIZE = 50
