import { z } from 'zod'

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().min(1),
  VITE_DEFAULT_ORGANIZATION_ID: z.string().optional(),
})

export const env = envSchema.parse(import.meta.env)
