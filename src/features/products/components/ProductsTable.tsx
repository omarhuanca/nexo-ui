import { memo, useState } from 'react'
import { Check, Settings2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { XeroProductDialog } from './XeroProductDialog'
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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

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
    <>
      <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead>Code</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Sale price</TableHead>
            <TableHead className="text-right">Cost price</TableHead>
            <TableHead className="w-28 text-right">Xero</TableHead>
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
              <TableCell className="text-right">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={
                          product.xeroConfigured
                            ? 'Xero configuration already saved'
                            : `Configure Xero for ${product.name}`
                        }
                        onClick={() => {
                          setSelectedProduct(product)
                          setDialogOpen(true)
                        }}
                      >
                        {product.xeroConfigured ? (
                          <Check aria-hidden="true" />
                        ) : (
                          <Settings2 aria-hidden="true" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {product.xeroConfigured
                        ? 'Xero configuration saved'
                        : 'Configure Xero account codes'}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
      <XeroProductDialog
        product={selectedProduct}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  )
}

export const ProductsTable = memo(ProductsTableComponent)
