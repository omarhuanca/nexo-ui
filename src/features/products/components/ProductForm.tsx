import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Loader2, Save } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useActiveOrganization } from '@/features/organizations/hooks/useActiveOrganization'
import {
  useCreateProduct,
  type ProductMutationError,
} from '../api/useCreateProduct'
import { productSchema, type ProductFormValues } from '../api/productSchema'

const DEFAULT_VALUES: Partial<ProductFormValues> = {
  code: '',
  name: '',
  description: '',
}

const PRODUCT_FORM_FIELDS = [
  'code',
  'name',
  'description',
  'salePrice',
  'costPrice',
] as const

export function ProductForm() {
  const navigate = useNavigate()
  const { organizationId } = useActiveOrganization()
  const createProduct = useCreateProduct()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onChange',
    reValidateMode: 'onChange',
  })

  const onSubmit = handleSubmit(async (values) => {
    try {
      await createProduct.mutateAsync({
        organization_id: organizationId,
        ...values,
      })
      toast.success('Product created successfully.')
      navigate('/products')
    } catch (error) {
      const productError = error as ProductMutationError

      for (const [field, message] of Object.entries(
        productError.fieldErrors,
      )) {
        if (
          PRODUCT_FORM_FIELDS.includes(
            field as (typeof PRODUCT_FORM_FIELDS)[number],
          )
        ) {
          setError(field as keyof ProductFormValues, {
            type: 'server',
            message,
          })
        }
      }
    }
  })

  const mutationError = createProduct.error as ProductMutationError | undefined
  const errorMessage =
    mutationError?.message ?? 'Unable to create the product.'
  const hasFieldErrors = Object.keys(mutationError?.fieldErrors ?? {}).length > 0

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="product-code">Code</Label>
          <Input
            id="product-code"
            placeholder="PROD-001"
            aria-invalid={errors.code ? 'true' : 'false'}
            {...register('code')}
          />
          {errors.code && <FieldError message={errors.code.message} />}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="product-name">Name</Label>
          <Input
            id="product-name"
            placeholder="Product name"
            aria-invalid={errors.name ? 'true' : 'false'}
            {...register('name')}
          />
          {errors.name && <FieldError message={errors.name.message} />}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="product-sale-price">Sale price</Label>
          <Input
            id="product-sale-price"
            type="number"
            min="0"
            step="0.01"
            required
            {...register('salePrice', { valueAsNumber: true })}
          />
          {errors.salePrice && <FieldError message={errors.salePrice.message} />}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="product-cost-price">Cost price</Label>
          <Input
            id="product-cost-price"
            type="number"
            min="0"
            step="0.01"
            required
            {...register('costPrice', { valueAsNumber: true })}
          />
          {errors.costPrice && <FieldError message={errors.costPrice.message} />}
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="product-description">Description</Label>
          <textarea
            id="product-description"
            rows={4}
            placeholder="Product description"
            className="flex w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
            {...register('description')}
          />
          {errors.description && <FieldError message={errors.description.message} />}
        </div>
      </div>

      {createProduct.isError && !hasFieldErrors && (
        <p className="text-sm text-destructive" role="alert">
          {errorMessage}
        </p>
      )}

      <div className="flex flex-col-reverse gap-2 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" asChild>
          <Link to="/products">
            <ArrowLeft aria-hidden="true" />
            Cancel
          </Link>
        </Button>
        <Button type="submit" disabled={createProduct.isPending}>
          {createProduct.isPending ? (
            <>
              <Loader2 className="animate-spin" aria-hidden="true" />
              Saving...
            </>
          ) : (
            <>
              <Save aria-hidden="true" />
              Save product
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

function FieldError({ message = '' }: { message?: string }) {
  return message ? (
    <p className="text-sm text-destructive" role="alert">
      {message}
    </p>
  ) : undefined
}
