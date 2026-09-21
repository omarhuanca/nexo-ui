import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { LoadingState } from '@/components/feedback/LoadingState'

const InvoicesPage = lazy(() =>
  import('@/features/invoices/pages/InvoicesPage').then((m) => ({
    default: m.InvoicesPage,
  })),
)

const InvoiceDetailPage = lazy(() =>
  import('@/features/invoices/pages/InvoiceDetailPage').then((m) => ({
    default: m.InvoiceDetailPage,
  })),
)

const AuditLogsPage = lazy(() =>
  import('@/features/audit-logs/pages/AuditLogsPage').then(
    (module) => ({
      default: module.AuditLogsPage,
    }),
  ),
)

const ProductsPage = lazy(() =>
  import('@/features/products/pages/ProductsPage').then((m) => ({
    default: m.ProductsPage,
  })),
)

const CreateProductPage = lazy(() =>
  import('@/features/products/pages/CreateProductPage').then((m) => ({
    default: m.CreateProductPage,
  })),
)

const CreateSalePage = lazy(() =>
  import('@/features/sales/pages/CreateSalePage').then((m) => ({
    default: m.CreateSalePage,
  })),
)

const IntegrationsPage = lazy(() =>
  import('@/features/integrations/pages/IntegrationsPage').then((m) => ({
    default: m.IntegrationsPage,
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
      {
        path: 'invoices/:invoiceId',
        element: (
          <Suspense fallback={<LoadingState />}>
            <InvoiceDetailPage />
          </Suspense>
        ),
      },
      {
        path: 'sales/new',
        element: (
          <Suspense fallback={<LoadingState />}>
            <CreateSalePage />
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
      {
        path: 'products',
        element: (
          <Suspense fallback={<LoadingState />}>
            <ProductsPage />
          </Suspense>
        ),
      },
      {
        path: 'products/new',
        element: (
          <Suspense fallback={<LoadingState />}>
            <CreateProductPage />
          </Suspense>
        ),
      },
      {
        path: 'settings/integrations',
        element: (
          <Suspense fallback={<LoadingState />}>
            <IntegrationsPage />
          </Suspense>
        ),
      },
    ],
  },
])
