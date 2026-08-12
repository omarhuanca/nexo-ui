import { SidebarItem } from './SidebarItem'
import { useSidebar } from '@/hooks/useSidebar'
import { cn } from '@/lib/utils'

export function SidebarContent() {
  const { isCollapsed } = useSidebar()
  return (
    <nav className={cn('p-4', isCollapsed && 'lg:p-2')}>
      <SidebarItem label="Sales" to="/invoices" defaultOpen />
    </nav>
  )
}
