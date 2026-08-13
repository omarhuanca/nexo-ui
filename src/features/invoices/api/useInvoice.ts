import {
  useQuery,
  type UseQueryResult,
} from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useActiveOrganization } from '@/features/organizations/hooks/useActiveOrganization'
import { invoicesKeys } from './invoicesKeys'
import type { Sale, SingleResponse } from '../types/sale'

export function useInvoice(
  id: number | null,
): UseQueryResult<SingleResponse<Sale>, Error> {
  const { organizationId } = useActiveOrganization()

  return useQuery({
    queryKey: id
      ? invoicesKeys.detail(id, organizationId)
      : ['invoices', 'detail', 'disabled'],
    enabled: id !== null && organizationId !== null,
    staleTime: 60_000,
    queryFn: async () => {
      const params = new URLSearchParams()
      if (organizationId !== null) {
        params.set('organization_id', String(organizationId))
      }
      const qs = params.toString()
      const { data } = await api.get<SingleResponse<Sale>>(
        `/integrations/taxcore/invoices/${id}${qs ? `?${qs}` : ''}`,
      )
      return data
    },
  })
}
