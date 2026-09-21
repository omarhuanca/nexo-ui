import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { OrganizationRequiredNotice } from '@/features/organizations/components/OrganizationRequiredNotice'
import {
  ORGANIZATION_NONE,
  useActiveOrganization,
} from '@/features/organizations/hooks/useActiveOrganization'
import { xeroKeys } from '../api/xeroKeys'
import { XeroConnectionCard } from '../components/XeroConnectionCard'

export function IntegrationsPage() {
  const { organizationId } = useActiveOrganization()
  const [searchParams, setSearchParams] = useSearchParams()
  const queryClient = useQueryClient()

  useEffect(() => {
    const xeroStatus = searchParams.get('xero')
    if (!xeroStatus) return

    if (xeroStatus === 'connected') {
      toast.success('Connected to Xero successfully.')
      queryClient.invalidateQueries({ queryKey: xeroKeys.status(organizationId) })
    } else if (xeroStatus === 'error') {
      toast.error(searchParams.get('message') ?? 'Failed to connect to Xero.')
    }

    const next = new URLSearchParams(searchParams)
    next.delete('xero')
    next.delete('message')
    setSearchParams(next, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-900">Integrations</h1>
        <p className="text-sm text-slate-500">
          Connect the active organization to third-party services.
        </p>
      </header>
      {organizationId === ORGANIZATION_NONE ? (
        <OrganizationRequiredNotice />
      ) : (
        <XeroConnectionCard organizationId={organizationId} />
      )}
    </div>
  )
}
