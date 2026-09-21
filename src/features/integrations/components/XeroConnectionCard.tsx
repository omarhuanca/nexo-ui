import { useState } from 'react'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { useDisconnectXeroConnection } from '../api/useDisconnectXeroConnection'
import { useXeroConnectionStatus } from '../api/useXeroConnectionStatus'
import { useXeroOauthConnect } from '../hooks/useXeroOauthConnect'

interface XeroConnectionCardProps {
  organizationId: number
}

export function XeroConnectionCard({ organizationId }: XeroConnectionCardProps) {
  const { data, isLoading } = useXeroConnectionStatus(organizationId)
  const status = data?.data
  const { connect, isConnecting } = useXeroOauthConnect(organizationId)
  const disconnectMutation = useDisconnectXeroConnection(organizationId)
  const [isDisconnectDialogOpen, setIsDisconnectDialogOpen] = useState(false)

  const handleDisconnect = async () => {
    await disconnectMutation.mutateAsync()
    setIsDisconnectDialogOpen(false)
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
      <CardContent className="flex items-center gap-2">
        <Button size="sm" onClick={connect} disabled={isConnecting}>
          {isConnecting
            ? 'Connecting...'
            : status?.connected
              ? 'Reconnect to Xero'
              : 'Connect to Xero'}
          <ExternalLink aria-hidden="true" />
        </Button>
        {status?.connected && (
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setIsDisconnectDialogOpen(true)}
          >
            Disconnect
          </Button>
        )}
      </CardContent>

      <Dialog open={isDisconnectDialogOpen} onOpenChange={setIsDisconnectDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Disconnect from Xero?</DialogTitle>
            <DialogDescription>
              Invoice syncing with {status?.tenant_name ?? 'this Xero account'} will
              stop. You can reconnect at any time.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsDisconnectDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={disconnectMutation.isPending}
              onClick={() => void handleDisconnect()}
            >
              {disconnectMutation.isPending ? 'Disconnecting...' : 'Disconnect'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
