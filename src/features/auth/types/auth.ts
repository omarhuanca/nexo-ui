export interface AuthUser {
  id: number
  name: string
  email: string
  scopes: string[]
}

export interface LoginInput {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
  expires_in: number
  user: AuthUser
}
