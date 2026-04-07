import { useMemo } from "react";
import type { AppTableColumn } from "@/components/AppTable";
import type { QuotationListItem } from "@/features/quotations/types/quotations.types";

interface SelectOption {
  value: string;
  label: string;
}

interface UseQuotationClientColumnsParams {
  isLeadAS: boolean;
  specialistOptions: SelectOption[];
  specialistIdByName: Map<string, string>;
  onReassign: (quotationId: string, asId: number) => void;
}

export function useQuotationClientColumns({
  isLeadAS,
  specialistOptions,
  specialistIdByName,
  onReassign,
}: UseQuotationClientColumnsParams) {
  return useMemo<AppTableColumn<QuotationListItem>[]>(() => {
    return [
      {
        key: "date",
        label: "DATE",
        width: "20%",
        render: (row) => row.date,
      },
      {
        key: "commodity",
        label: "COMMODITY",
        width: "30%",
        render: (row) => row.commodity,
      },
      {
        key: "service_type",
        label: "SERVICE TYPE",
        width: "20%",
        render: (row) => row.service_type ?? "—",
      },
      {
        key: "person_in_charge",
        label: "PERSON IN CHARGE",
        width: "30%",
        ...(isLeadAS
          ? {
              type: "select" as const,
              selectOptions: specialistOptions,
              selectValue: (row: QuotationListItem) =>
                specialistIdByName.get(row.person_in_charge ?? "") ?? "",
              onSelectChange: (row: QuotationListItem, value: string) => {
                const asId = Number(value);
                if (!Number.isFinite(asId)) return;

                const currentAsId = Number(
                  specialistIdByName.get(row.person_in_charge ?? "") ?? NaN,
                );

                if (currentAsId === asId) return;

                onReassign(row.id, asId);
              },
            }
          : {
              render: (row: QuotationListItem) => row.person_in_charge ?? "—",
            }),
      },
    ];
  }, [isLeadAS, onReassign, specialistIdByName, specialistOptions]);
}
