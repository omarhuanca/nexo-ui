import axios from 'axios'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Product } from '@/features/products/types/product'
import type { SaleFormValues } from './saleSchema'

interface CreateSaleInput {
  values: SaleFormValues
  products: Product[]
}

interface SaleResponse {
  success: boolean
  message: string
  data: { id: number; status: string }
}

export interface SaleMutationError extends Error {
  fieldErrors: Record<string, string>
}

function createSaleError(
  message: string,
  fieldErrors: Record<string, string> = {},
): SaleMutationError {
  const error = new Error(message) as SaleMutationError
  error.fieldErrors = fieldErrors
  return error
}

function buildPayload({ values, products }: CreateSaleInput) {
  const productsByCode = new Map(
    products.map((product) => [product.code, product]),
  )
  const items = values.items.map((item) => {
    const product = productsByCode.get(item.productCode)

    if (!product || !product.xeroConfigured) {
      throw createSaleError(
        'Every selected product must be configured for Xero.',
      )
    }

    const unitPrice = Number(product.salePrice)
    const quantity = Number(item.quantity)

    return {
      code: product.code,
      name: product.name,
      quantity,
      unitPrice,
      totalAmount: Number((quantity * unitPrice).toFixed(2)),
      labels: ['A'],
      accountCode: product.salesAccountCode,
      gtin: '',
    }
  })

  const amount = items.reduce((total, item) => total + item.totalAmount, 0)

  return {
    // TODO: Replace temporary sale defaults with user/configuration-driven values.
    invoiceType: 1,
    transactionType: 0,
    cashier: 'Juan Pérez',
    dueDate: '2026-05-29',
    referentDocumentNumber: '',
    buyer: {
      name: values.buyerName,
      // TODO: The UI does not collect a buyer document number yet.
      id: null,
    },
    items,
    payment: [
      { amount: Number(amount.toFixed(2)), paymentType: values.paymentType },
    ],
  }
}

export function useCreateSale() {
  return useMutation({
    mutationFn: async (input: CreateSaleInput) => {
      const payload = buildPayload(input)

      try {
        const { data } = await api.post<SaleResponse>('/sales', payload, {
          headers: {
            Authorization: `Bearer ${input.values.connectorToken.trim()}`,
          },
        })

        return data
      } catch (error) {
        if (axios.isAxiosError(error)) {
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

          throw createSaleError(
            responseData?.message ?? 'Unable to submit the sale.',
            fieldErrors,
          )
        }

        throw createSaleError('Unable to submit the sale. Please try again.')
      }
    },
  })
}
