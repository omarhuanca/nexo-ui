import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { OrganizationRequiredNotice } from '@/features/organizations/components/OrganizationRequiredNotice'
import {
  ORGANIZATION_NONE,
  useActiveOrganization,
} from '@/features/organizations/hooks/useActiveOrganization'
import { ProductForm } from '../components/ProductForm'

export function CreateProductPage() {
  const { organizationId } = useActiveOrganization()

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <Button variant="ghost" size="sm" asChild className="-ml-3">
          <Link to="/products">
            <ArrowLeft aria-hidden="true" />
            Products
          </Link>
        </Button>
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-slate-900">New product</h1>
          <p className="text-sm text-slate-500">
            Add a reusable product to the active organization catalog.
          </p>
        </div>
      </header>

      {organizationId === ORGANIZATION_NONE ? (
        <OrganizationRequiredNotice />
      ) : (
        <section className="rounded-md border border-slate-200 bg-white p-5 sm:p-6">
          <ProductForm />
        </section>
      )}
    </div>
  )
}
