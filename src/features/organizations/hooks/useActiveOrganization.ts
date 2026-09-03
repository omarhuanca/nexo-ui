import { useCallback, useEffect, useRef } from 'react'
import { parseAsInteger, useQueryState } from 'nuqs'

export const ORGANIZATION_NONE = 0

const STORAGE_KEY = 'nexo:active-organization-id'

function readStoredOrg(): number {
  if (typeof window === 'undefined') return ORGANIZATION_NONE
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return ORGANIZATION_NONE
    const n = Number(raw)
    return Number.isInteger(n) && n > 0 ? n : ORGANIZATION_NONE
  } catch {
    return ORGANIZATION_NONE
  }
}

function writeStoredOrg(id: number): void {
  if (typeof window === 'undefined') return
  try {
    if (id === ORGANIZATION_NONE) {
      window.localStorage.removeItem(STORAGE_KEY)
    } else {
      window.localStorage.setItem(STORAGE_KEY, String(id))
    }
  } catch {
    /* ignore quota / private mode */
  }
}

export function useActiveOrganization(): {
  organizationId: number
  setOrganizationId: (id: number) => void
} {
  const [rawOrgId, setOrgId] = useQueryState('org', parseAsInteger)
  const storedOrgId = readStoredOrg()
  const organizationId = rawOrgId ?? storedOrgId
  const seededRef = useRef(false)

  useEffect(() => {
    if (seededRef.current) return
    seededRef.current = true

    if (rawOrgId == null && storedOrgId !== ORGANIZATION_NONE) {
      setOrgId(storedOrgId)
      return
    }

    writeStoredOrg(organizationId)
  }, [organizationId, rawOrgId, setOrgId, storedOrgId])

  useEffect(() => {
    if (!seededRef.current) return
    writeStoredOrg(organizationId)
  }, [organizationId])

  const setOrganizationId = useCallback(
    (id: number) => {
      setOrgId(id)
    },
    [setOrgId],
  )

  return { organizationId, setOrganizationId }
}
