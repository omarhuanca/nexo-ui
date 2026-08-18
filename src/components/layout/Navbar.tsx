import { memo } from 'react'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { NexoLogo } from './NexoLogo'
import { useSidebar } from '@/hooks/useSidebar'
import { OrganizationSelector } from '@/features/organizations/components/OrganizationSelector'

function NavbarComponent() {
  const { openMobile } = useSidebar()

  return (
    <header className="fixed inset-x-0 top-0 z-30 h-16 border-b border-slate-200 bg-white">
      <div className="flex h-full items-center justify-between gap-2 px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={openMobile}
            className="lg:hidden"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <NexoLogo />
        </div>
        <div className="flex items-center gap-3">
          <OrganizationSelector />
          <div className="hidden flex-col text-right leading-tight sm:flex">
            <span className="text-sm font-medium text-slate-900">
              Administrator
            </span>
            <span className="text-xs text-slate-500">Admin</span>
          </div>
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-sm font-semibold text-white"
            aria-hidden="true"
          >
            A
          </div>
        </div>
      </div>
    </header>
  )
}

export const Navbar = memo(NavbarComponent)
