import { z } from 'zod'

export const xeroProductSchema = z.object({
  salesAccountCode: z
    .string()
    .trim()
    .min(1, 'Sales account code is required')
    .max(10, 'Sales account code cannot exceed 10 characters'),
  purchaseAccountCode: z
    .string()
    .trim()
    .min(1, 'Purchase account code is required')
    .max(10, 'Purchase account code cannot exceed 10 characters'),
})

export type XeroProductFormValues = z.infer<typeof xeroProductSchema>
