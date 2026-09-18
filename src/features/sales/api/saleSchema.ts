import { z } from 'zod'

export const saleSchema = z.object({
  buyerName: z.string().trim().min(1, 'Buyer name is required').max(255),
  connectorToken: z.string().trim().min(1, 'Connector token is required'),
  paymentType: z.number().int().min(0).max(6),
  items: z
    .array(
      z.object({
        productCode: z.string().min(1, 'Product is required'),
        quantity: z.number().min(0.001, 'Quantity must be greater than zero'),
      }),
    )
    .min(1, 'Add at least one product'),
})

export type SaleFormValues = z.infer<typeof saleSchema>
