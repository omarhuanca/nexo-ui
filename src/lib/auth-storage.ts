import { AUTH_STORAGE_KEYS } from '@/features/auth/config'
import type { AuthUser } from '@/features/auth/types/auth'

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage.getItem(AUTH_STORAGE_KEYS.token)
  } catch {
    return null
  }
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(AUTH_STORAGE_KEYS.token, token)
  } catch {
    /* ignore quota / private mode */
  }
}

export function clearToken(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(AUTH_STORAGE_KEYS.token)
  } catch {
    /* ignore */
  }
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEYS.user)
    if (!raw) return null
    const parsed = JSON.parse(raw) as AuthUser
    return parsed
  } catch {
    return null
  }
}

export function setStoredUser(user: AuthUser): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(AUTH_STORAGE_KEYS.user, JSON.stringify(user))
  } catch {
    /* ignore */
  }
}

export function clearStoredUser(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(AUTH_STORAGE_KEYS.user)
  } catch {
    /* ignore */
  }
}

export function clearAuth(): void {
  clearToken()
  clearStoredUser()
}
