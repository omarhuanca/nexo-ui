import { memo } from 'react'
import { NavLink } from 'react-router-dom'
import { FileText } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { useSidebar } from '@/hooks/useSidebar'

interface SidebarItemProps {
  label: string
  to: string
  defaultOpen?: boolean
}

function SidebarItemComponent({ label, to, defaultOpen = true }: SidebarItemProps) {
  const { isCollapsed } = useSidebar()

  const item = (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
          isActive
            ? 'bg-blue-50 font-medium text-blue-700'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
          isCollapsed && 'lg:justify-center lg:px-2',
        )
      }
    >
      {({ isActive }) => (
        <>
          <FileText
            className={cn(
              'h-4 w-4 shrink-0',
              isActive ? 'text-blue-700' : 'text-slate-400',
            )}
            aria-hidden="true"
          />
          <span className={cn(isCollapsed && 'lg:hidden')}>{label}</span>
        </>
      )}
    </NavLink>
  )

  if (isCollapsed) {
    return (
      <ul className="space-y-0.5">
        <li>
          <Tooltip>
            <TooltipTrigger asChild>{item}</TooltipTrigger>
            <TooltipContent side="right">{label}</TooltipContent>
          </Tooltip>
        </li>
      </ul>
    )
  }

  return (
    <Collapsible defaultOpen={defaultOpen} className="group/collapsible">
      <CollapsibleTrigger
        className={cn(
          'flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition-colors',
          'hover:bg-slate-100 hover:text-slate-900',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        )}
      >
        <span>Sales</span>
        <svg
          className="h-4 w-4 text-slate-400 transition-transform group-data-[state=open]/collapsible:rotate-90"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M6 4L10 8L6 12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden">
        <ul className="mt-1 space-y-0.5 pl-2">
          <li>{item}</li>
        </ul>
      </CollapsibleContent>
    </Collapsible>
  )
}

export const SidebarItem = memo(SidebarItemComponent)
