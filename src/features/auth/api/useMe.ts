import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { AUTH_ENDPOINTS } from '../config'
import { authKeys } from './authKeys'
import type { AuthUser } from '../types/auth'

interface ApiSuccess<T> {
  success: boolean
  message: string
  data: T
}

export function useMe(enabled = true): UseQueryResult<AuthUser | null, Error> {
  return useQuery({
    queryKey: authKeys.me(),
    enabled,
    staleTime: 5 * 60_000,
    retry: false,
    queryFn: async () => {
      const { data } = await api.get<ApiSuccess<AuthUser>>(AUTH_ENDPOINTS.me)
      return data.data
    },
  })
}
