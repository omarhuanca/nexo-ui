import { memo, Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'
import { SidebarProvider, useSidebar } from '@/hooks/useSidebar'
import { LoadingState } from '@/components/feedback/LoadingState'
import { cn } from '@/lib/utils'

function AppShellContent() {
  const { isCollapsed } = useSidebar()
  return (
    <div className="min-h-full bg-white">
      <Navbar />
      <Sidebar />
      <main
        className={cn(
          'pt-16 transition-[margin] duration-200 ease-in-out',
          isCollapsed ? 'lg:ml-16' : 'lg:ml-64',
        )}
      >
        <div className="mx-auto max-w-screen-2xl p-4 sm:p-6 lg:p-8">
          <Suspense fallback={<LoadingState />}>
            <Outlet />
          </Suspense>
        </div>
      </main>
    </div>
  )
}

function AppShellComponent() {
  return (
    <SidebarProvider>
      <AppShellContent />
    </SidebarProvider>
  )
}

export const AppShell = memo(AppShellComponent)
