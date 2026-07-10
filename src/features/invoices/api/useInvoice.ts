import {
  useQuery,
  type UseQueryResult,
} from '@tanstack/react-query'
import { api } from '@/lib/api'
import { env } from '@/lib/env'
import { invoicesKeys } from './invoicesKeys'
import type { Sale, SingleResponse } from '../types/sale'

export function useInvoice(
  id: number | null,
): UseQueryResult<SingleResponse<Sale>, Error> {
  return useQuery({
    queryKey: id ? invoicesKeys.detail(id) : ['invoices', 'detail', 'disabled'],
    enabled: id !== null,
    staleTime: 60_000,
    queryFn: async () => {
      const params = new URLSearchParams()
      const orgId = env.VITE_DEFAULT_ORGANIZATION_ID
      if (orgId) {
        params.set('organization_id', orgId)
      }
      const qs = params.toString()
      const { data } = await api.get<SingleResponse<Sale>>(
        `/integrations/taxcore/invoices/${id}${qs ? `?${qs}` : ''}`,
      )
      return data
    },
  })
}
