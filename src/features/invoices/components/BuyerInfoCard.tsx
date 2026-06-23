import { memo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { SaleBuyer } from '../types/sale'

interface BuyerInfoCardProps {
  buyer: SaleBuyer | null | undefined
  tin?: string | null
}

function BuyerInfoCardComponent({ buyer, tin }: BuyerInfoCardProps) {
  if (!buyer) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Buyer</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500">No buyer data</p>
        </CardContent>
      </Card>
    )
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Buyer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Name</p>
          <p className="font-medium text-slate-900">{buyer.name}</p>
        </div>
        {buyer.id ? (
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Buyer ID
            </p>
            <p className="font-mono text-slate-700">{buyer.id}</p>
          </div>
        ) : null}
        {tin ? (
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">TIN</p>
            <p className="font-mono text-slate-700">{tin}</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

export const BuyerInfoCard = memo(BuyerInfoCardComponent)
