export const AUTH_ENDPOINTS = {
  login: '/auth/login',
  me: '/auth/me',
  logout: '/auth/logout',
  refresh: '/auth/refresh',
} as const

export const AUTH_STORAGE_KEYS = {
  token: 'nexo:auth-token',
  user: 'nexo:auth-user',
} as const
