import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export type InvoiceAction = {
  id: string
  label: string
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  className?: string
  disabled?: boolean
  onClick?: () => void | Promise<void>
}

interface InvoiceActionsPanelProps {
  title: string
  actions: InvoiceAction[]
}

export function InvoiceActionsPanel({
  title,
  actions,
}: InvoiceActionsPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-wrap items-center gap-2">
        {actions.map((action) => (
          <Button
            key={action.id}
            type="button"
            variant={action.variant ?? 'default'}
            disabled={action.disabled}
            onClick={() => {
              if (action.onClick) {
                void action.onClick()
              }
            }}
            className={cn('min-w-[140px] flex-1 justify-center', action.className)}
          >
            {action.label}
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
