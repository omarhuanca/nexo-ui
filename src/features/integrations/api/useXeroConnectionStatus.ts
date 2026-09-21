import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { SingleResponse } from '@/types/api'
import { ORGANIZATION_NONE } from '@/features/organizations/hooks/useActiveOrganization'
import { xeroKeys } from './xeroKeys'
import type { XeroConnectionStatus } from '../types/xero'

export function useXeroConnectionStatus(
  organizationId: number,
): UseQueryResult<SingleResponse<XeroConnectionStatus>, Error> {
  return useQuery({
    queryKey: xeroKeys.status(organizationId),
    enabled: organizationId !== ORGANIZATION_NONE,
    staleTime: 15_000,
    queryFn: async () => {
      const { data } = await api.get<SingleResponse<XeroConnectionStatus>>(
        `/integrations/xero/status?organization_id=${organizationId}`,
      )
      return data
    },
  })
}
