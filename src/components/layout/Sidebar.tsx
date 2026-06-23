import { memo } from 'react'
import { SidebarItem } from './SidebarItem'

function SidebarComponent() {
  return (
    <aside
      className="fixed left-0 top-16 z-20 h-[calc(100vh-4rem)] w-64 border-r border-slate-200 bg-slate-50"
      aria-label="Primary navigation"
    >
      <nav className="p-4">
        <SidebarItem />
      </nav>
    </aside>
  )
}

export const Sidebar = memo(SidebarComponent)
