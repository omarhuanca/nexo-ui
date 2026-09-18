import type { PaginatedResponse, SingleResponse } from '@/types/api'

export interface Product {
  id: number
  organization_id: number
  code: string
  name: string
  description: string
  salePrice: number
  costPrice: number
  xeroConfigured: boolean
  salesAccountCode: string
  purchaseAccountCode: string
  created_at: string
  updated_at: string
}

export interface CreateProductInput {
  organization_id: number
  code: string
  name: string
  description: string
  salePrice: number
  costPrice: number
}

export interface ProductsFilters {
  page: number
  perPage: number
}

export type ProductsResponse = PaginatedResponse<Product>
export type ProductResponse = SingleResponse<Product>
