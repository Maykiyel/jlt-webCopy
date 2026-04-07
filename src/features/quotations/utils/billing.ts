import type { ChargeRow } from "@/features/quotations/schemas/compose.schema";
import type {
  BillingSection,
  QuotationTemplate,
} from "@/features/quotations/types/compose.types";
import type { BillingDetailsValues } from "@/features/quotations/schemas/compose.schema";

export interface BillingSectionWithRows {
  section: BillingSection;
  rows: ChargeRow[];
}

export function hasChargeContent(row: ChargeRow): boolean {
  return Boolean(
    row.description?.trim() ||
    row.currency?.trim() ||
    row.uom?.trim() ||
    row.amount != null,
  );
}

export function hasAnyCharge(
  sections: BillingDetailsValues["sections"],
): boolean {
  return Object.values(sections ?? {}).some((rows) =>
    rows.some(hasChargeContent),
  );
}

export function getBillingSectionsWithCharges(
  template: QuotationTemplate,
  billingDetails: BillingDetailsValues,
): BillingSectionWithRows[] {
  return template.billing_sections
    .map((section) => {
      const rows = (billingDetails.sections?.[section.id] ?? []).filter(
        hasChargeContent,
      );
      return { section, rows };
    })
    .filter(({ rows }) => rows.length > 0);
}

export function getRowsTotal(rows: ChargeRow[]): number {
  return rows.reduce((sum, row) => sum + (row.amount ?? 0), 0);
}

export function getBillingGrandTotal(
  sectionsWithRows: BillingSectionWithRows[],
): number {
  return sectionsWithRows.reduce(
    (sum, { rows }) => sum + getRowsTotal(rows),
    0,
  );
}
