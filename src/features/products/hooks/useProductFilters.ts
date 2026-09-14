import { parseAsInteger, useQueryStates } from 'nuqs'

interface ProductFilterValues {
  page: number
  perPage: number
}

const productFilterParsers = {
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(15),
}

export function useProductFilters() {
  const [filters, setRaw] = useQueryStates(productFilterParsers, {
    history: 'push',
  })

  const setFilters = (values: Partial<ProductFilterValues>) => {
    return setRaw({
      ...values,
      ...(values.perPage !== undefined ? { page: 1 } : {}),
    })
  }

  return [filters, setFilters] as const
}
