import { env } from '@/lib/env'

export function buildXeroConnectUrl(
  organizationId: number,
  opts?: { mode?: 'popup' },
): string {
  const base = env.VITE_API_BASE_URL.replace(/\/$/, '')
  const mode = opts?.mode ? `&mode=${opts.mode}` : ''
  return `${base}/integrations/xero/connect?organization_id=${organizationId}${mode}`
}
