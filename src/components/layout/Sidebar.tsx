import { memo, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ChevronsLeft, ChevronsRight } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { SidebarContent } from './SidebarContent'
import { useSidebar } from '@/hooks/useSidebar'
import { cn } from '@/lib/utils'

function SidebarComponent() {
  const { isMobileOpen, closeMobile, isCollapsed, toggleCollapsed } = useSidebar()
  const location = useLocation()

  useEffect(() => {
    closeMobile()
  }, [location.pathname, closeMobile])

  return (
    <>
      <Sheet open={isMobileOpen} onOpenChange={(open) => !open && closeMobile()}>
        <SheetContent
          side="left"
          className="w-72 gap-0 border-r-slate-200 bg-slate-50 p-0 sm:max-w-xs"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <div className="h-16" aria-hidden="true" />
          <SidebarContent />
        </SheetContent>
      </Sheet>

      <aside
        className={cn(
          'fixed left-0 top-16 z-20 hidden h-[calc(100vh-4rem)] border-r border-slate-200 bg-slate-50 transition-[width] duration-200 ease-in-out lg:block',
          isCollapsed ? 'w-16' : 'w-64',
        )}
        aria-label="Primary navigation"
      >
        <div className="flex h-full flex-col">
          <div className="flex-1 overflow-y-auto">
            <SidebarContent />
          </div>
          <div className="border-t border-slate-200 p-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleCollapsed}
                  className="w-full"
                  aria-label={
                    isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'
                  }
                >
                  {isCollapsed ? (
                    <ChevronsRight className="h-4 w-4" />
                  ) : (
                    <ChevronsLeft className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right">Expand sidebar</TooltipContent>
              )}
            </Tooltip>
          </div>
        </div>
      </aside>
    </>
  )
}

export const Sidebar = memo(SidebarComponent)
