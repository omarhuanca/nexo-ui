import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { LoadingState } from '@/components/feedback/LoadingState'

const InvoicesPage = lazy(() =>
  import('@/features/invoices/pages/InvoicesPage').then((m) => ({
    default: m.InvoicesPage,
  })),
)

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/invoices" replace /> },
      {
        path: 'invoices',
        element: (
          <Suspense fallback={<LoadingState />}>
            <InvoicesPage />
          </Suspense>
        ),
      },
    ],
  },
])
