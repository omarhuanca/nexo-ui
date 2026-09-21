import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Save } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  useConfigureXeroProduct,
  type XeroProductMutationError,
} from '../api/useConfigureXeroProduct'
import {
  xeroProductSchema,
  type XeroProductFormValues,
} from '../api/xeroProductSchema'
import type { Product } from '../types/product'

interface XeroProductDialogProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DEFAULT_VALUES: XeroProductFormValues = {
  salesAccountCode: '',
  purchaseAccountCode: '',
}

const FORM_FIELDS = ['salesAccountCode', 'purchaseAccountCode'] as const

export function XeroProductDialog({
  product,
  open,
  onOpenChange,
}: XeroProductDialogProps) {
  const {
    error: configureError,
    isError: hasConfigureError,
    isPending,
    mutateAsync,
    reset: resetMutation,
  } = useConfigureXeroProduct()
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<XeroProductFormValues>({
    resolver: zodResolver(xeroProductSchema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onChange',
    reValidateMode: 'onChange',
  })

  useEffect(() => {
    if (!product || !open) return

    reset({
      salesAccountCode: product.salesAccountCode,
      purchaseAccountCode: product.purchaseAccountCode,
    })
    resetMutation()
  }, [open, product, reset, resetMutation])

  const onSubmit = handleSubmit(async (values) => {
    if (!product) return

    try {
      await mutateAsync({
        productId: product.id,
        organizationId: product.organization_id,
        ...values,
      })
      toast.success('Xero configuration saved successfully.')
      onOpenChange(false)
    } catch (error) {
      const mutationError = error as XeroProductMutationError

      for (const [field, message] of Object.entries(
        mutationError.fieldErrors,
      )) {
        if (FORM_FIELDS.includes(field as (typeof FORM_FIELDS)[number])) {
          setError(field as keyof XeroProductFormValues, {
            type: 'server',
            message,
          })
        }
      }
    }
  })

  const mutationError = configureError as XeroProductMutationError | undefined
  const hasFieldErrors = Object.keys(mutationError?.fieldErrors ?? {}).length > 0

  if (!product) return null

  const isReadOnly = product.xeroConfigured

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isReadOnly ? 'Xero configuration' : 'Configure Xero product'}
          </DialogTitle>
          <DialogDescription>
            {isReadOnly
              ? `Saved Xero account codes for ${product.name}.`
              : `Set the Xero sales and purchase account codes for ${product.name}.`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={isReadOnly ? undefined : onSubmit} className="space-y-5" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="sales-account-code">Sales account code</Label>
            <Input
              id="sales-account-code"
              placeholder="200"
              autoComplete="off"
              aria-invalid={errors.salesAccountCode ? 'true' : 'false'}
              disabled={isPending}
              readOnly={isReadOnly}
              {...register('salesAccountCode')}
            />
            {errors.salesAccountCode ? (
              <FieldError message={errors.salesAccountCode.message} />
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="purchase-account-code">Purchase account code</Label>
            <Input
              id="purchase-account-code"
              placeholder="310"
              autoComplete="off"
              aria-invalid={errors.purchaseAccountCode ? 'true' : 'false'}
              disabled={isPending}
              readOnly={isReadOnly}
              {...register('purchaseAccountCode')}
            />
            {errors.purchaseAccountCode ? (
              <FieldError message={errors.purchaseAccountCode.message} />
            ) : null}
          </div>

          {hasConfigureError && !hasFieldErrors ? (
            <p className="text-sm text-destructive" role="alert">
              {mutationError?.message}
            </p>
          ) : null}

          <DialogFooter>
            {isReadOnly ? (
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="animate-spin" aria-hidden="true" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save aria-hidden="true" />
                      Save configuration
                    </>
                  )}
                </Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function FieldError({ message = '' }: { message?: string }) {
  return message ? (
    <p className="text-sm text-destructive" role="alert">
      {message}
    </p>
  ) : null
}