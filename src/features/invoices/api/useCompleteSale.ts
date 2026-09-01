import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { invoicesKeys } from "./invoicesKeys";
import type { Sale, SalePayload } from "../types/sale";

interface ApiSuccess<T> {
  success: boolean;
  message: string;
  data: T;
}

interface CompleteSaleInput {
  sale: Sale;
  connectorToken: string;
}

const SALE_INVOICE_TYPE = 0;

function buildSalePayload(sale: Sale): SalePayload {
  const payload = sale.payload ?? {
    buyer: { name: "Customer" },
    items: [],
    payment: [],
    invoiceType: SALE_INVOICE_TYPE,
    transactionType: 0,
  };

  const items = (payload.items ?? []).map((item) => ({
    code: item.code ?? "N/A",
    name: item.name,
    quantity: Number(item.quantity),
    unitPrice: Number(item.unitPrice),
    totalAmount: Number(item.totalAmount),
    labels: item.labels?.length ? item.labels : ["A"],
    accountCode: item.accountCode ?? "200",
    gtin: item.gtin ?? null,
  }));

  const payment = (payload.payment ?? []).map((entry) => ({
    amount: Number(entry.amount),
    paymentType: Number(entry.paymentType),
  }));

  const nextPayload: SalePayload = {
    buyer: {
      name: payload.buyer?.name ?? "Customer",
      id: payload.buyer?.id ?? null,
    },
    items,
    payment,
    invoiceType: SALE_INVOICE_TYPE,
    transactionType: 0,
    cashier: payload.cashier ?? null,
    dueDate: payload.dueDate ?? null,
    referentDocumentNumber: sale.fiscal_number ?? null,
  };

  if (items.length === 0 || payment.length === 0) {
    throw new Error(
      "This invoice does not contain sale items or payment data.",
    );
  }

  return nextPayload;
}

export function useCompleteSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sale, connectorToken }: CompleteSaleInput) => {
      const trimmedToken = connectorToken.trim();

      if (!trimmedToken) {
        throw new Error("Connector token is required.");
      }

      const payload = buildSalePayload(sale);

      const { data } = await api.post<
        ApiSuccess<{ id: number; status: string }>
      >("/sales", payload, {
        headers: {
          Authorization: `Bearer ${trimmedToken}`,
        },
      });

      return data;
    },
    onSuccess: async (_data, { sale }) => {
      toast.success("Sale submitted for processing.");
      await queryClient.invalidateQueries({
        queryKey: invoicesKeys.detail(
          sale.id,
          Number(sale.organization_id ?? 0),
        ),
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to complete sale.");
    },
  });
}
