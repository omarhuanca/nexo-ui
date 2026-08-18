export interface ApiPagination {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number | null
  to: number | null
}

export interface PaginatedResponse<T> {
  success: boolean
  message: string
  data: T[]
  pagination: ApiPagination
}

export interface SingleResponse<T> {
  success: boolean
  message: string
  data: T
}
