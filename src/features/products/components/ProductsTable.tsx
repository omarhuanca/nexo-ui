import { memo } from 'react'
import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { LoadingState } from '@/components/feedback/LoadingState'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Product } from '../types/product'

interface ProductsTableProps {
  products: Product[]
  isLoading: boolean
  isError: boolean
  errorMessage?: string
  onRetry: () => void
}

const currencyFormatter = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'EUR',
})

function ProductsTableComponent({
  products,
  isLoading,
  isError,
  errorMessage = 'Unable to load products.',
  onRetry,
}: ProductsTableProps) {
  if (isLoading) return <LoadingState />

  if (isError) {
    return (
      <ErrorState
        message={errorMessage}
        onRetry={onRetry}
      />
    )
  }

  if (products.length === 0) {
    return (
      <EmptyState
        message="No products yet"
        description="Create your first product to build the catalog."
      />
    )
  }

  return (
    <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead>Code</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Sale price</TableHead>
            <TableHead className="text-right">Cost price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="whitespace-nowrap font-medium text-slate-900">
                {product.code}
              </TableCell>
              <TableCell className="font-medium text-slate-900">
                {product.name}
              </TableCell>
              <TableCell className="max-w-sm truncate text-slate-600">
                {product.description || 'No description'}
              </TableCell>
              <TableCell className="whitespace-nowrap text-right tabular-nums">
                {currencyFormatter.format(product.salePrice)}
              </TableCell>
              <TableCell className="whitespace-nowrap text-right tabular-nums text-slate-600">
                {currencyFormatter.format(product.costPrice)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export const ProductsTable = memo(ProductsTableComponent)
