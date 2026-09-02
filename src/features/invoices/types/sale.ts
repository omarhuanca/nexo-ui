export type SaleStatus = 'pending' | 'processing' | 'completed' | 'failed'

export type InvoiceType = 0 | 1 | 2 | 3 | 4
export type TransactionType = 0 | 1

export interface SaleBuyer {
  id?: string | null
  name: string
}

export interface SaleItem {
  code?: string | null
  accountCode?: string | null
  name: string
  quantity: number
  unitPrice: number
  totalAmount: number
  labels: string[]
  gtin?: string | null
}

export interface SalePayment {
  amount: number
  paymentType: number
}

export interface SalePayload {
  buyer: SaleBuyer
  items: SaleItem[]
  payment: SalePayment[]
  invoiceType: InvoiceType
  transactionType: TransactionType
  taxAmount?: number | null
  taxId?: string | null
  storeName?: string | null
  address?: string | null
  cashier?: string | null
  dueDate?: string | null
  referentDocumentNumber?: string | null
}

export interface FiscalTaxItem {
  label: string
  categoryName: string
  rate: number
  amount: number
  categoryType: number
}

export interface KnownFiscalResult {
  invoiceNumber?: string
  signature?: string
  verificationUrl?: string
  verificationQRCode?: string
  journal?: string
  taxItems?: FiscalTaxItem[]
  totalAmount?: number
  sdcDateTime?: string
  businessName?: string
  tin?: string
  locationName?: string
  address?: string
}

export type FiscalResult = KnownFiscalResult & Record<string, unknown>

export interface Sale {
  id: number
  organization_id: number
  connector_id: number
  status: SaleStatus
  fiscal_number: string | null
  xero_invoice_id: string | null
  total_amount: number | null
  sdc_date_time: string | null
  attempts: number
  error_message: string | null
  processed_at: string | null
  created_at: string
  updated_at: string
  payload: SalePayload | null
  fiscal_result: FiscalResult | null
  xero_result: Record<string, unknown> | null
}

export interface PaginatedResponse<T> {
  success: boolean
  message: string
  data: T[]
  pagination: {
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number | null
    to: number | null
  }
}

export interface SingleResponse<T> {
  success: boolean
  message: string
  data: T
}
