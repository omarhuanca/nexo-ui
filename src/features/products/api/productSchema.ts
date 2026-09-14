import { z } from 'zod'

export const productSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, 'Code is required')
    .max(30, 'Code cannot exceed 30 characters'),
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(255, 'Name cannot exceed 255 characters'),
  description: z
    .string()
    .max(2048, 'Description cannot exceed 2048 characters'),
  salePrice: z
    .number({ error: 'Sale price is required' })
    .min(0, 'Sale price cannot be negative'),
  costPrice: z
    .number({ error: 'Cost price is required' })
    .min(0, 'Cost price cannot be negative'),
})

export type ProductFormValues = z.infer<typeof productSchema>
