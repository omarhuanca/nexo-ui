import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Loader2, Plus, Save, Trash2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { OrganizationRequiredNotice } from '@/features/organizations/components/OrganizationRequiredNotice'
import {
  ORGANIZATION_NONE,
  useActiveOrganization,
} from '@/features/organizations/hooks/useActiveOrganization'
import { useProducts } from '@/features/products/api/useProducts'
import type { Product } from '@/features/products/types/product'
import { saleSchema, type SaleFormValues } from '../api/saleSchema'
import { useCreateSale, type SaleMutationError } from '../api/useCreateSale'

const DEFAULT_VALUES: SaleFormValues = {
  buyerName: '',
  connectorToken: '',
  paymentType: 1,
  items: [{ productCode: '', quantity: 1 }],
}

const PAYMENT_TYPES = [
  ['0', 'Other'],
  ['1', 'Cash'],
  ['2', 'Card'],
  ['3', 'Check'],
  ['4', 'Wire transfer'],
  ['5', 'Voucher'],
  ['6', 'Mobile money'],
] as const

export function CreateSalePage() {
  const { organizationId } = useActiveOrganization()
  const productsQuery = useProducts({ page: 1, perPage: 100 })

  if (organizationId === ORGANIZATION_NONE) {
    return (
      <div className="space-y-6">
        <PageHeader />
        <OrganizationRequiredNotice />
      </div>
    )
  }

  return <SaleForm products={productsQuery.data?.data ?? []} isLoading={productsQuery.isLoading} />
}

function SaleForm({ products, isLoading }: { products: Product[]; isLoading: boolean }) {
  const createSale = useCreateSale()
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SaleFormValues>({
    resolver: zodResolver(saleSchema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onChange',
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'items' })

  const configuredProducts = products.filter((product) => product.xeroConfigured)
  const onSubmit = handleSubmit(async (values) => {
    try {
      const result = await createSale.mutateAsync({ values, products })
      toast.success(`Sale #${result.data.id} submitted for processing.`)
    } catch (error) {
      const saleError = error as SaleMutationError
      for (const [field, message] of Object.entries(saleError.fieldErrors)) {
        if (field === 'buyer.name') setError('buyerName', { type: 'server', message })
      }
    }
  })

  const mutationError = createSale.error as SaleMutationError | undefined

  return (
    <div className="space-y-6">
      <PageHeader />
      <form onSubmit={onSubmit} className="space-y-6" noValidate>
        <section className="space-y-4 rounded-md border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-semibold text-slate-900">Products</h2>
              <p className="text-sm text-slate-500">Only products configured for Xero can be sold.</p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => append({ productCode: '', quantity: 1 })}>
              <Plus aria-hidden="true" />
              Add product
            </Button>
          </div>

          {products.length > configuredProducts.length ? (
            <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900" role="status">
              Products without Xero configuration are unavailable. Configure them from the Products page first.
            </p>
          ) : null}

          {fields.map((field, index) => (
            <div key={field.id} className="grid gap-3 border-t border-slate-100 pt-4 md:grid-cols-[1fr_160px_auto] md:items-end">
              <Field label={`Product ${index + 1}`} error={errors.items?.[index]?.productCode?.message}>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  aria-invalid={errors.items?.[index]?.productCode ? 'true' : 'false'}
                  disabled={isLoading || configuredProducts.length === 0}
                  {...register(`items.${index}.productCode`)}
                >
                  <option value="">Select a product</option>
                  {configuredProducts.map((product) => (
                    <option key={product.id} value={product.code}>
                      {product.name} ({product.code})
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Quantity" error={errors.items?.[index]?.quantity?.message}>
                <Input type="number" min="0.001" step="0.001" {...register(`items.${index}.quantity`, { valueAsNumber: true })} />
              </Field>
              <Button type="button" variant="ghost" size="icon" aria-label={`Remove product ${index + 1}`} onClick={() => remove(index)} disabled={fields.length === 1}>
                <Trash2 aria-hidden="true" />
              </Button>
            </div>
          ))}
        </section>

        <section className="space-y-5 rounded-md border border-slate-200 bg-white p-5 sm:p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Buyer name" error={errors.buyerName?.message}>
              <Input aria-invalid={errors.buyerName ? 'true' : 'false'} {...register('buyerName')} />
            </Field>
            <Field label="Payment method" error={errors.paymentType?.message}>
              <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm" {...register('paymentType', { valueAsNumber: true })}>
                {PAYMENT_TYPES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Connector token" error={errors.connectorToken?.message}>
            <Input type="password" autoComplete="off" {...register('connectorToken')} />
          </Field>
        </section>

        {createSale.isError ? <p className="text-sm text-destructive" role="alert">{mutationError?.message}</p> : null}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" asChild><Link to="/invoices"><ArrowLeft aria-hidden="true" />Cancel</Link></Button>
          <Button type="submit" disabled={createSale.isPending || isLoading || configuredProducts.length === 0}>
            {createSale.isPending ? <><Loader2 className="animate-spin" aria-hidden="true" />Sending...</> : <><Save aria-hidden="true" />Submit sale</>}
          </Button>
        </div>
      </form>
    </div>
  )
}

function PageHeader() {
  return (
    <header className="space-y-3">
      <Button variant="ghost" size="sm" asChild className="-ml-3"><Link to="/invoices"><ArrowLeft aria-hidden="true" />Sales</Link></Button>
      <div className="space-y-1"><h1 className="text-2xl font-semibold text-slate-900">New sale</h1><p className="text-sm text-slate-500">Submit a configured product sale to Xero and TaxCore.</p></div>
    </header>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return <div className="space-y-1.5"><Label>{label}</Label>{children}{error ? <p className="text-sm text-destructive" role="alert">{error}</p> : null}</div>
}