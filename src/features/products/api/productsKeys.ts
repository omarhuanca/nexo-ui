import type { ProductsFilters } from '../types/product'

export const productsKeys = {
  all: ['products'] as const,
  lists: () => [...productsKeys.all, 'list'] as const,
  list: (filters: ProductsFilters & { organizationId: number }) =>
    [...productsKeys.lists(), JSON.stringify(filters)] as const,
}
