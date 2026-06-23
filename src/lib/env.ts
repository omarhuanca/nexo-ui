import { z } from 'zod'

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().min(1),
  VITE_DEFAULT_ORGANIZATION_ID: z.coerce
    .number()
    .int()
    .positive()
    .optional(),
})

export const env = envSchema.parse(import.meta.env)
