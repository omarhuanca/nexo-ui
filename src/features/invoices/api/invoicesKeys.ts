import type { InvoicesFilters } from './useInvoices'

function serializeFilters(filters: InvoicesFilters): string {
  const sorted = Object.entries(filters)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .sort(([a], [b]) => a.localeCompare(b))
  return JSON.stringify(sorted)
}

export const invoicesKeys = {
  all: ['invoices'] as const,
  lists: () => [...invoicesKeys.all, 'list'] as const,
  list: (filters: InvoicesFilters) =>
    [...invoicesKeys.lists(), serializeFilters(filters)] as const,
  details: () => [...invoicesKeys.all, 'detail'] as const,
  detail: (id: number) => [...invoicesKeys.details(), id] as const,
}
