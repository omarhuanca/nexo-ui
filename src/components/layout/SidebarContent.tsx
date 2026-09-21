import { Plug } from 'lucide-react'
import { SidebarItem } from './SidebarItem'
import { useSidebar } from '@/hooks/useSidebar'
import { cn } from '@/lib/utils'

export function SidebarContent() {
  const { isCollapsed } = useSidebar()
  return (
    <nav className={cn('p-4', isCollapsed && 'lg:p-2')}>
      <SidebarItem
        groupLabel="Sales"
        defaultOpen
        items={[
          { label: 'Invoices', to: '/invoices' },
          { label: 'New sale', to: '/sales/new' },
        ]}
      />
      <SidebarItem label="Products" to="/products" groupLabel="Catalog" defaultOpen />
      <SidebarItem label="Audit logs" to="/audit-logs" groupLabel="Audit" defaultOpen />
      <SidebarItem
        label="Integrations"
        to="/settings/integrations"
        groupLabel="Settings"
        icon={Plug}
        defaultOpen
      />
    </nav>
  )
}
