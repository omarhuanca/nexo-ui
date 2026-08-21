import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import {
  clearAuth,
  getStoredUser,
  getToken,
  setStoredUser,
  setToken,
} from '@/lib/auth-storage'
import { AUTH_ENDPOINTS } from '../config'
import { useLogin } from '../api/useLogin'
import type { AuthUser, LoginInput } from '../types/auth'

export interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  isHydrating: boolean
  isLoggingIn: boolean
  loginError: string | null
  login: (input: LoginInput) => Promise<void>
  logout: () => void
  clearLoginError: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

interface ApiSuccess<T> {
  success: boolean
  message: string
  data: T
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isHydrating, setIsHydrating] = useState(true)
  const [loginError, setLoginError] = useState<string | null>(null)
  const loginMutation = useLogin()
  const hydrateRanRef = useRef(false)

  const hydrate = useCallback(async () => {
    if (hydrateRanRef.current) return
    hydrateRanRef.current = true

    const token = getToken()
    if (!token) {
      setIsHydrating(false)
      return
    }

    const cachedUser = getStoredUser()
    if (cachedUser) {
      setUser(cachedUser)
    }

    try {
      const { data } = await api.get<ApiSuccess<AuthUser>>(AUTH_ENDPOINTS.me)
      setUser(data.data)
      setStoredUser(data.data)
    } catch {
      clearAuth()
      setUser(null)
    } finally {
      setIsHydrating(false)
    }
  }, [])

  useEffect(() => {
    void hydrate()
  }, [hydrate])

  const login = useCallback(
    async (input: LoginInput) => {
      setLoginError(null)
      try {
        const result = await loginMutation.mutateAsync(input)
        setToken(result.access_token)
        setStoredUser(result.user)
        setUser(result.user)
      } catch (error) {
        const apiMessage = extractErrorMessage(error)
        setLoginError(apiMessage)
        toast.error(apiMessage)
        throw error
      }
    },
    [loginMutation],
  )

  const logout = useCallback(() => {
    clearAuth()
    setUser(null)
    setLoginError(null)
  }, [])

  const clearLoginError = useCallback(() => setLoginError(null), [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isHydrating,
      isLoggingIn: loginMutation.isPending,
      loginError,
      login,
      logout,
      clearLoginError,
    }),
    [user, isHydrating, loginMutation.isPending, loginError, login, logout, clearLoginError],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function extractErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null) {
    const maybeAxios = error as {
      response?: { data?: { message?: string; errors?: Record<string, string[]> } }
      message?: string
    }
    const data = maybeAxios.response?.data
    if (data?.message) return data.message
    if (data?.errors) {
      const firstField = Object.values(data.errors)[0]
      if (firstField && firstField[0]) return firstField[0]
    }
    if (maybeAxios.message) return maybeAxios.message
  }
  return 'Login failed. Please try again.'
}
