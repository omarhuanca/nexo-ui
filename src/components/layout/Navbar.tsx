import { memo } from 'react'
import { NexoLogo } from './NexoLogo'

function NavbarComponent() {
  return (
    <header className="fixed inset-x-0 top-0 z-30 h-16 border-b border-slate-200 bg-white">
      <div className="flex h-full items-center justify-between px-6">
        <NexoLogo />
        <div className="flex items-center gap-3">
          <div className="flex flex-col text-right leading-tight">
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
