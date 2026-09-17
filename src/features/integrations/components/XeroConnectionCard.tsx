import { CheckCircle2, ExternalLink, Plug, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { buildXeroConnectUrl } from '../api/xero'
import { useXeroConnectionStatus } from '../api/useXeroConnectionStatus'

interface XeroConnectionCardProps {
  organizationId: number
}

export function XeroConnectionCard({ organizationId }: XeroConnectionCardProps) {
  const { data, isLoading } = useXeroConnectionStatus(organizationId)
  const status = data?.data

  const handleConnect = () => {
    window.location.href = buildXeroConnectUrl(organizationId)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
            <Plug className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <CardTitle>Xero</CardTitle>
            <CardDescription>
              {status?.connected
                ? `Connected to ${status.tenant_name ?? 'a Xero account'}.`
                : 'Connect the active organization to a Xero account to sync invoices and contacts.'}
            </CardDescription>
          </div>
        </div>
        {isLoading ? (
          <Skeleton className="h-5 w-20" />
        ) : status?.connected ? (
          <Badge className="gap-1 border-transparent bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
            Active
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="gap-1 border-slate-200 text-slate-500"
          >
            <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
            Inactive
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <Button size="sm" onClick={handleConnect}>
          {status?.connected ? 'Reconnect to Xero' : 'Connect to Xero'}
          <ExternalLink aria-hidden="true" />
        </Button>
      </CardContent>
    </Card>
  )
}
