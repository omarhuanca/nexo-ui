import { z } from 'zod'

const dateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
  .optional()
  .or(z.literal('').transform(() => undefined))

export const invoiceFilterSchema = z
  .object({
    status: z.enum(['pending', 'processing', 'completed', 'failed']).optional().or(z.literal('').transform(() => undefined)),
    invoiceType: z.coerce.number().int().min(0).max(4).optional().or(z.literal('').transform(() => undefined)),
    transactionType: z.coerce.number().int().min(0).max(1).optional().or(z.literal('').transform(() => undefined)),
    fiscalNumber: z.string().optional(),
    dateFrom: dateString,
    dateTo: dateString,
    page: z.coerce.number().int().positive().optional(),
    pageSize: z.coerce.number().int().positive().max(100).optional(),
  })
  .refine(
    (data) => {
      if (data.dateFrom && data.dateTo) {
        return data.dateFrom <= data.dateTo
      }
      return true
    },
    { message: 'dateTo must be greater than or equal to dateFrom', path: ['dateTo'] },
  )

export type InvoiceFilterFormValues = z.infer<typeof invoiceFilterSchema>
