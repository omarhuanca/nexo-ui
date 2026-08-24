import { SidebarItem } from './SidebarItem'
import { useSidebar } from '@/hooks/useSidebar'
import { cn } from '@/lib/utils'

export function SidebarContent() {
  const { isCollapsed } = useSidebar()
  return (
    <nav className={cn('p-4', isCollapsed && 'lg:p-2')}>
      <SidebarItem label="Sales" to="/invoices" groupLabel="Sales" defaultOpen />
      <SidebarItem label="Audit logs" to="/audit-logs" groupLabel="Audit" defaultOpen />
    </nav>
  )
}
