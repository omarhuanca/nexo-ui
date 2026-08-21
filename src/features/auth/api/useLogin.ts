import { useMutation, type UseMutationResult } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { AUTH_ENDPOINTS } from '../config'
import type { LoginInput, LoginResponse } from '../types/auth'

interface ApiSuccess<T> {
  success: boolean
  message: string
  data: T
}

export function useLogin(): UseMutationResult<LoginResponse, Error, LoginInput> {
  return useMutation({
    mutationFn: async (input) => {
      const { data } = await api.post<ApiSuccess<LoginResponse>>(
        AUTH_ENDPOINTS.login,
        input,
      )
      return data.data
    },
  })
}
