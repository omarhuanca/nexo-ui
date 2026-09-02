import type { InvoiceAction } from "../components/InvoiceActionsPanel";
import type { InvoiceType } from "../types/sale";

interface InvoiceActionHandlers {
  print?: () => void | Promise<void>;
  completeSale?: () => void | Promise<void>;
  copyInvoice?: () => void | Promise<void>;
  cancelInvoice?: () => void | Promise<void>;
  refundReceipt?: () => void | Promise<void>;
  reissue?: () => void | Promise<void>;
  duplicate?: () => void | Promise<void>;
}

export function getInvoiceActions(
  invoiceType: InvoiceType | undefined,
  handlers: InvoiceActionHandlers,
): InvoiceAction[] {
  const basePrint: InvoiceAction = {
    id: "print",
    label: "Print",
    variant: "default",
    className: "bg-blue-600 text-white hover:bg-blue-700",
    onClick: handlers.print ?? (() => undefined),
  };

  const completeSaleActionBase = {
    id: "complete-sale",
    label: "Complete sale",
    variant: "secondary" as const,
    className: "bg-emerald-600 text-white hover:bg-emerald-700",
    onClick: handlers.completeSale ?? (() => undefined),
  };

  const copyAction: InvoiceAction = {
    id: "copy-invoice",
    label: "Copy invoice",
    variant: "secondary",
    className: "bg-emerald-600 text-white hover:bg-emerald-700",
    onClick: handlers.copyInvoice ?? (() => undefined),
  };

  const cancelAction: InvoiceAction = {
    id: "cancel-invoice",
    label: "Cancel invoice",
    variant: "destructive",
    className: "bg-red-600 text-white hover:bg-red-700",
    onClick: handlers.cancelInvoice ?? (() => undefined),
  };

  const refundAction: InvoiceAction = {
    id: "refund-receipt",
    label: "Refund entire receipt",
    variant: "outline",
    className:
      "border-orange-500 bg-orange-100 text-orange-700 hover:bg-orange-200",
    onClick: handlers.refundReceipt ?? (() => undefined),
  };

  switch (invoiceType) {
    case 1:
      return [basePrint, completeSaleActionBase];

    case 0:
      return [basePrint, copyAction, cancelAction, refundAction];

    case 2:
      return [
        basePrint,
        {
          id: "reissue",
          label: "Reissue",
          variant: "secondary",
          onClick: handlers.reissue ?? (() => undefined),
        },
      ];

    case 3:
      return [
        basePrint,
        {
          id: "duplicate",
          label: "Duplicate",
          variant: "secondary",
          onClick: handlers.duplicate ?? (() => undefined),
        },
      ];

    case 4:
      return [
        basePrint,
        {
          ...completeSaleActionBase,
          id: "complete-sale-advance",
        },
      ];

    default:
      return [basePrint];
  }
}
