import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { LoadingState } from '@/components/feedback/LoadingState'

const InvoicesPage = lazy(() =>
  import('@/features/invoices/pages/InvoicesPage').then((m) => ({
    default: m.InvoicesPage,
  })),
)

const AuditLogsPage = lazy(() =>
  import('@/features/audit-logs/pages/AuditLogsPage').then(
    (module) => ({
      default: module.AuditLogsPage,
    }),
  ),
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
      {
        path: 'audit-logs',
        element: (
          <Suspense fallback={<LoadingState />}>
            <AuditLogsPage />
          </Suspense>
        ),
      },
    ],
  },
])
