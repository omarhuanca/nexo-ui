import { Building2 } from 'lucide-react'
import { Banner } from '@/components/feedback/Banner'

export function OrganizationRequiredNotice() {
  return (
    <Banner
      variant="info"
      icon={Building2}
      title="Select an organization to continue"
      description="Invoices are scoped to a specific organization. Pick one from the selector in the top-right corner to view its invoices."
    />
  )
}