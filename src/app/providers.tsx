import { type ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import { queryClient } from '@/lib/query-client'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <TooltipProvider delayDuration={150}>
          {children}
          <Toaster richColors closeButton position="top-right" />
        </TooltipProvider>
      </NuqsAdapter>
    </QueryClientProvider>
  )
}
