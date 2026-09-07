import {
  keepPreviousData,
  useQuery,
  type UseQueryResult,
} from '@tanstack/react-query'
import { api } from '@/lib/api'
import {
  ORGANIZATION_NONE,
  useActiveOrganization,
} from '@/features/organizations/hooks/useActiveOrganization'
import { productsKeys } from './productsKeys'
import type { ProductsFilters, ProductsResponse } from '../types/product'

export function useProducts(
  filters: ProductsFilters,
): UseQueryResult<ProductsResponse, Error> {
  const { organizationId } = useActiveOrganization()

  return useQuery({
    queryKey: productsKeys.list({ ...filters, organizationId }),
    enabled: organizationId !== ORGANIZATION_NONE,
    placeholderData: keepPreviousData,
    staleTime: 15_000,
    queryFn: async () => {
      const params = new URLSearchParams({
        organization_id: String(organizationId),
        perPage: String(filters.perPage),
        page: String(filters.page),
      })

      const { data } = await api.get<ProductsResponse>(
        `/products?${params.toString()}`,
      )

      return data
    },
  })
}
