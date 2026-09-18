import axios from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { productsKeys } from './productsKeys'

export interface XeroProductMutationError extends Error {
  fieldErrors: Record<string, string>
}

interface ConfigureXeroProductInput {
  productId: number
  organizationId: number
  salesAccountCode: string
  purchaseAccountCode: string
}

function createMutationError(
  message: string,
  fieldErrors: Record<string, string> = {},
): XeroProductMutationError {
  const error = new Error(message) as XeroProductMutationError
  error.fieldErrors = fieldErrors
  return error
}

export function useConfigureXeroProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      productId,
      organizationId,
      salesAccountCode,
      purchaseAccountCode,
    }: ConfigureXeroProductInput) => {
      try {
        const { data } = await api.post(`/products/${productId}/xero`, {
          organization_id: organizationId,
          sales_account_code: salesAccountCode,
          purchase_account_code: purchaseAccountCode,
        })

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
            throw createMutationError(
              'This product already has Xero configuration.',
            )
          }

          if (status === 422) {
            throw createMutationError(
              responseData?.message ?? 'Please correct the highlighted fields.',
              fieldErrors,
            )
          }

          if (status === 404) {
            throw createMutationError(
              'The product could not be found for the selected organization.',
            )
          }
        }

        throw createMutationError(
          'Unable to save the Xero configuration. Please try again.',
        )
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productsKeys.lists() })
    },
  })
}
