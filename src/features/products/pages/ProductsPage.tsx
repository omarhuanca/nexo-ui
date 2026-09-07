import { useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Plus, RefreshCw } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { OrganizationRequiredNotice } from '@/features/organizations/components/OrganizationRequiredNotice'
import {
  ORGANIZATION_NONE,
  useActiveOrganization,
} from '@/features/organizations/hooks/useActiveOrganization'
import { productsKeys } from '../api/productsKeys'
import { useProducts } from '../api/useProducts'
import { ProductsPagination } from '../components/ProductsPagination'
import { ProductsTable } from '../components/ProductsTable'
import { useProductFilters } from '../hooks/useProductFilters'

export function ProductsPage() {
  const queryClient = useQueryClient()
  const { organizationId } = useActiveOrganization()
  const [filters, setFilters] = useProductFilters()
  const apiFilters = useMemo(
    () => ({
      page: filters.page,
      perPage: filters.perPage,
    }),
    [filters.page, filters.perPage],
  )
  const { data, isLoading, isError, error, isFetching, refetch } = useProducts(apiFilters)

  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: productsKeys.lists() })
    refetch()
  }, [queryClient, refetch])

  const handlePageChange = useCallback(
    (page: number) => setFilters({ page }),
    [setFilters],
  )

  if (organizationId === ORGANIZATION_NONE) {
    return (
      <div className="space-y-6">
        <PageHeader isFetching={false} onRefresh={handleRefresh} />
        <OrganizationRequiredNotice />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader isFetching={isFetching} onRefresh={handleRefresh} />
      <ProductsTable
        products={data?.data ?? []}
        isLoading={isLoading}
        isError={isError}
        errorMessage={error?.message}
        onRetry={refetch}
      />
      <ProductsPagination
        pagination={data?.pagination}
        onPageChange={handlePageChange}
      />
    </div>
  )
}

function PageHeader({
  isFetching,
  onRefresh,
}: {
  isFetching: boolean
  onRefresh: () => void
}) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-900">Products</h1>
        <p className="text-sm text-slate-500">
          Manage the base product catalog for the active organization.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={onRefresh} disabled={isFetching}>
          <RefreshCw className={isFetching ? 'animate-spin' : ''} aria-hidden="true" />
          Refresh
        </Button>
        <Button size="sm" asChild>
          <Link to="/products/new">
            <Plus aria-hidden="true" />
            New product
          </Link>
        </Button>
      </div>
    </header>
  )
}
