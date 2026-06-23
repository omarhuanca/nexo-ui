import { memo } from 'react'
import { ExternalLink } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { SignatureBlock } from './SignatureBlock'
import { JournalBlock } from './JournalBlock'
import { EmptyState } from '@/components/feedback/EmptyState'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency } from '../utils/formatters'
import type { FiscalResult } from '../types/sale'

interface FiscalInfoCardProps {
  fiscal: FiscalResult | null
}

function FiscalInfoCardComponent({ fiscal }: FiscalInfoCardProps) {
  if (!fiscal) {
    return <EmptyState message="No fiscal data" description="This sale has not been signed by TaxCore yet." />
  }
  const { verificationQRCode, verificationUrl, taxItems } = fiscal

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Verification</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-start gap-3">
          {verificationQRCode ? (
            <img
              src={`data:image/gif;base64,${verificationQRCode}`}
              alt="Verification QR code"
              width={192}
              height={192}
              className="h-48 w-48 rounded border border-slate-200 object-contain"
            />
          ) : (
            <Skeleton className="h-48 w-48" />
          )}
          {verificationUrl ? (
            <Button asChild variant="outline" size="sm">
              <a
                href={verificationUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center"
              >
                Verify online
                <ExternalLink className="ml-1 h-3 w-3" aria-hidden="true" />
              </a>
            </Button>
          ) : null}
        </CardContent>
      </Card>

      <SignatureBlock signature={fiscal.signature} />
      <JournalBlock journal={fiscal.journal} />

      <Card>
        <CardHeader>
          <CardTitle>Tax breakdown</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Label</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Rate (%)</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {taxItems && taxItems.length > 0 ? (
                  taxItems.map((item) => (
                    <TableRow key={`${item.label}-${item.categoryName}`}>
                      <TableCell className="font-medium">{item.label}</TableCell>
                      <TableCell>{item.categoryName}</TableCell>
                      <TableCell className="text-right">{item.rate}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.amount)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="py-6 text-center text-sm text-slate-500"
                    >
                      No tax items
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export const FiscalInfoCard = memo(FiscalInfoCardComponent)
