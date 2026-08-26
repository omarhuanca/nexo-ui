import type { InvoicesFilters } from './useInvoices'
import { ORGANIZATION_NONE } from '@/features/organizations/hooks/useActiveOrganization'

function serializeFilters(filters: InvoicesFilters): string {
  const sorted = Object.entries(filters)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .sort(([a], [b]) => a.localeCompare(b))
  return JSON.stringify(sorted)
}

export const invoicesKeys = {
  all: ['invoices'] as const,
  lists: () => [...invoicesKeys.all, 'list'] as const,
  list: (filters: InvoicesFilters, organizationId: number) =>
    [
      ...invoicesKeys.lists(),
      organizationId === ORGANIZATION_NONE ? 'none' : organizationId,
      serializeFilters(filters),
    ] as const,
  details: () => [...invoicesKeys.all, 'detail'] as const,
  detail: (id: number, organizationId: number) =>
    [
      ...invoicesKeys.details(),
      organizationId === ORGANIZATION_NONE ? 'none' : organizationId,
      id,
    ] as const,
}
