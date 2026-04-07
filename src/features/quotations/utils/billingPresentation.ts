import type { ChargeRow } from "@/features/quotations/schemas/compose.schema";

export interface BillingPresentationRow {
  description: string;
  currency: string;
  uom: string;
  amountText: string;
  totalText: string;
}

export function formatQuotationAmount(
  amount: number | null | undefined,
): string {
  return amount != null
    ? amount.toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : "-";
}

export function getBillingPresentationRows(
  rows: ChargeRow[],
  formatAmount: (amount: number | null | undefined) => string,
): BillingPresentationRow[] {
  return rows.map((row) => {
    const amountText = formatAmount(row.amount);

    return {
      description: row.description?.trim() || "-",
      currency: row.currency?.trim() || "-",
      uom: row.uom?.trim() || "-",
      amountText,
      totalText: amountText,
    };
  });
}
