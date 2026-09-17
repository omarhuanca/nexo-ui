import { ORGANIZATION_NONE } from '@/features/organizations/hooks/useActiveOrganization'

export const xeroKeys = {
  all: ['xero'] as const,
  status: (organizationId: number) =>
    [
      ...xeroKeys.all,
      'status',
      organizationId === ORGANIZATION_NONE ? 'none' : organizationId,
    ] as const,
}
