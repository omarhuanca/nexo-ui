import {
  parseAsInteger,
  parseAsString,
  useQueryStates,
  type Nullable,
  type Options,
  type Values,
} from 'nuqs'

export const invoiceFilterParsers = {
  status: parseAsString,
  invoiceType: parseAsInteger,
  transactionType: parseAsInteger,
  fiscalNumber: parseAsString.withDefault(''),
  dateFrom: parseAsString,
  dateTo: parseAsString,
  page: parseAsInteger.withDefault(1),
  pageSize: parseAsInteger.withDefault(50),
}

export type InvoiceFilterValues = Values<typeof invoiceFilterParsers>

const KEYS_THAT_RESET_PAGE: ReadonlyArray<keyof InvoiceFilterValues> = [
  'status',
  'invoiceType',
  'transactionType',
  'fiscalNumber',
  'dateFrom',
  'dateTo',
  'pageSize',
]

function shouldResetPage(
  patch: Partial<Nullable<InvoiceFilterValues>>,
): boolean {
  return KEYS_THAT_RESET_PAGE.some((k) => k in patch)
}

export function useInvoiceFilters() {
  const [filters, setRaw] = useQueryStates(invoiceFilterParsers, {
    history: 'push',
  })

  const setFilters = (
    values:
      | Partial<Nullable<InvoiceFilterValues>>
      | ((old: InvoiceFilterValues) => Partial<Nullable<InvoiceFilterValues>>)
      | null,
    options?: Options,
  ): Promise<URLSearchParams> => {
    if (values === null) return setRaw(null, options)
    if (typeof values === 'function') {
      return setRaw((old) => {
        const patch = values(old)
        return shouldResetPage(patch) ? { ...patch, page: 1 } : patch
      }, options)
    }
    return setRaw(
      shouldResetPage(values) ? { ...values, page: 1 } : values,
      options,
    )
  }

  return [filters, setFilters] as const
}
