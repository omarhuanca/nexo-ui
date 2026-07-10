import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

interface SidebarContextValue {
  isMobileOpen: boolean
  isCollapsed: boolean
  openMobile: () => void
  closeMobile: () => void
  toggleMobile: () => void
  toggleCollapsed: () => void
  setCollapsed: (value: boolean) => void
}

const SidebarContext = createContext<SidebarContextValue | null>(null)

interface SidebarProviderProps {
  children: ReactNode
  defaultCollapsed?: boolean
}

export function SidebarProvider({
  children,
  defaultCollapsed = false,
}: SidebarProviderProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)

  const openMobile = useCallback(() => setIsMobileOpen(true), [])
  const closeMobile = useCallback(() => setIsMobileOpen(false), [])
  const toggleMobile = useCallback(() => setIsMobileOpen((v) => !v), [])
  const toggleCollapsed = useCallback(() => setIsCollapsed((v) => !v), [])

  const value = useMemo<SidebarContextValue>(
    () => ({
      isMobileOpen,
      isCollapsed,
      openMobile,
      closeMobile,
      toggleMobile,
      toggleCollapsed,
      setCollapsed: setIsCollapsed,
    }),
    [
      isMobileOpen,
      isCollapsed,
      openMobile,
      closeMobile,
      toggleMobile,
      toggleCollapsed,
    ],
  )

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSidebar(): SidebarContextValue {
  const ctx = useContext(SidebarContext)
  if (!ctx) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return ctx
}
