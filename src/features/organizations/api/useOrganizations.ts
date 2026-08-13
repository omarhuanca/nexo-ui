import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { organizationsKeys } from './organizationsKeys'
import type { Organization } from '../types/organization'
import type { PaginatedResponse } from '@/types/api'

export function useOrganizations(): UseQueryResult<
  PaginatedResponse<Organization>,
  Error
> {
  return useQuery({
    queryKey: organizationsKeys.list(),
    staleTime: 5 * 60_000,
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Organization>>(
        '/organizations?perPage=100',
      )
      return data
    },
  })
}
