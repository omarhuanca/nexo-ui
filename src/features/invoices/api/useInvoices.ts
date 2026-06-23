import {
  keepPreviousData,
  useQuery,
  type UseQueryResult,
} from '@tanstack/react-query'
import { api } from '@/lib/api'
import { env } from '@/lib/env'
import { invoicesKeys } from './invoicesKeys'
import type {
  PaginatedResponse,
  Sale,
  SaleStatus,
} from '../types/sale'

export interface InvoicesFilters {
  status?: SaleStatus
  invoiceType?: number
  transactionType?: number
  fiscalNumber?: string
  dateFrom?: string
  dateTo?: string
  page?: number
  pageSize?: number
}

export function useInvoices(
  filters: InvoicesFilters,
): UseQueryResult<PaginatedResponse<Sale>, Error> {
  return useQuery({
    queryKey: invoicesKeys.list(filters),
    placeholderData: keepPreviousData,
    staleTime: 15_000,
    queryFn: async () => {
      const params = new URLSearchParams()
      if (env.VITE_DEFAULT_ORGANIZATION_ID !== undefined) {
        params.set(
          'organization_id',
          String(env.VITE_DEFAULT_ORGANIZATION_ID),
        )
      }
      for (const [k, v] of Object.entries(filters)) {
        if (v !== undefined && v !== null && v !== '') {
          params.set(k, String(v))
        }
      }
      const { data } = await api.get<PaginatedResponse<Sale>>(
        `/integrations/taxcore/invoices?${params.toString()}`,
      )
      return data
    },
  })
}
