import axios from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { productsKeys } from './productsKeys'
import type { CreateProductInput, ProductResponse } from '../types/product'

export interface ProductMutationError extends Error {
  fieldErrors: Record<string, string>
}

function createProductError(
  message: string,
  fieldErrors: Record<string, string> = {},
): ProductMutationError {
  const error = new Error(message) as ProductMutationError
  error.fieldErrors = fieldErrors
  return error
}

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateProductInput) => {
      try {
        const { data } = await api.post<ProductResponse>('/products', input)
        return data
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const status = error.response?.status
          const responseData = error.response?.data as
            | {
                errors?: Record<string, string | string[]>
                message?: string
              }
            | undefined

          const fieldErrors = Object.fromEntries(
            Object.entries(responseData?.errors ?? {}).map(
              ([field, messages]) => [
                field,
                Array.isArray(messages) ? messages[0] : messages,
              ],
            ),
          )

          if (status === 409) {
            throw createProductError(
              'A product with this code already exists in the selected organization.',
              { code: 'This product code is already in use.' },
            )
          }

          if (status === 422) {
            throw createProductError(
              responseData?.message ?? 'Please correct the highlighted fields.',
              fieldErrors,
            )
          }
        }

        throw createProductError(
          'Unable to create the product. Please try again.',
        )
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productsKeys.lists() })
    },
  })
}
