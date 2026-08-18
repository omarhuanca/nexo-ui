import { useCallback, useEffect, useRef } from 'react'
import { parseAsInteger, useQueryState } from 'nuqs'

const STORAGE_KEY = 'nexo:active-organization-id'

function readStoredOrg(): number | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const n = Number(raw)
    return Number.isInteger(n) && n > 0 ? n : null
  } catch {
    return null
  }
}

function writeStoredOrg(id: number | null): void {
  if (typeof window === 'undefined') return
  try {
    if (id === null) {
      window.localStorage.removeItem(STORAGE_KEY)
    } else {
      window.localStorage.setItem(STORAGE_KEY, String(id))
    }
  } catch {
    /* ignore quota / private mode */
  }
}

export function useActiveOrganization(): {
  organizationId: number | null
  setOrganizationId: (id: number) => void
} {
  const [orgId, setOrgId] = useQueryState('org', parseAsInteger)
  const seededRef = useRef(false)

  useEffect(() => {
    if (seededRef.current) return
    seededRef.current = true
    if (orgId !== null) {
      writeStoredOrg(orgId)
      return
    }
    const stored = readStoredOrg()
    if (stored !== null) {
      setOrgId(stored)
    }
  }, [orgId, setOrgId])

  useEffect(() => {
    if (!seededRef.current) return
    writeStoredOrg(orgId)
  }, [orgId])

  const setOrganizationId = useCallback(
    (id: number) => {
      setOrgId(id)
    },
    [setOrgId],
  )

  return { organizationId: orgId, setOrganizationId }
}
