import { memo, Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'
import { LoadingState } from '@/components/feedback/LoadingState'

function AppShellComponent() {
  return (
    <div className="min-h-full bg-white">
      <Navbar />
      <Sidebar />
      <main className="ml-64 pt-16">
        <div className="mx-auto max-w-screen-2xl p-8">
          <Suspense fallback={<LoadingState />}>
            <Outlet />
          </Suspense>
        </div>
      </main>
    </div>
  )
}

export const AppShell = memo(AppShellComponent)
