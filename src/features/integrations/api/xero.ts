import { env } from '@/lib/env'

export function buildXeroConnectUrl(organizationId: number): string {
  const base = env.VITE_API_BASE_URL.replace(/\/$/, '')
  return `${base}/integrations/xero/connect?organization_id=${organizationId}`
}
