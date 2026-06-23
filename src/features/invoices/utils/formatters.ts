import { format } from 'date-fns'
import type { SaleStatus } from '../types/sale'
import { STATUS_LABELS } from './constants'

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return format(date, 'PPp')
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return format(date, 'PP')
}

export function formatCurrency(
  value: number | string | null | undefined,
  currency = 'EUR',
  locale = 'en-US',
): string {
  if (value === null || value === undefined) return '—'
  const n = typeof value === 'number' ? value : Number(value)
  if (Number.isNaN(n)) return '—'
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(n)
}

export function formatStatus(status: SaleStatus): string {
  return STATUS_LABELS.get(status) ?? status
}

export function truncate(text: string, max = 40): string {
  if (text.length <= max) return text
  return text.slice(0, max - 1) + '…'
}
