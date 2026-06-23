import { memo } from 'react'
import { FiscalInfoCard } from './FiscalInfoCard'
import type { FiscalResult } from '../types/sale'

interface InvoiceFiscalTabProps {
  fiscal: FiscalResult | null
}

function InvoiceFiscalTabComponent({ fiscal }: InvoiceFiscalTabProps) {
  return <FiscalInfoCard fiscal={fiscal} />
}

export const InvoiceFiscalTab = memo(InvoiceFiscalTabComponent)
