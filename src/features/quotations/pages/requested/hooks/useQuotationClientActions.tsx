import { useMemo } from "react";
import {
  NoteAdd,
  Delete,
} from "@nine-thirty-five/material-symbols-react/rounded";
import type { AppTableAction } from "@/components/AppTable";
import type { QuotationListItem } from "@/features/quotations/types/quotations.types";

interface UseQuotationClientActionsParams {
  onMakeQuotation: (row: QuotationListItem) => void;
  onDiscard: (row: QuotationListItem) => void;
}

export function useQuotationClientActions({
  onMakeQuotation,
  onDiscard,
}: UseQuotationClientActionsParams) {
  return useMemo<AppTableAction<QuotationListItem>[]>(() => {
    return [
      {
        label: "Make Quotation",
        icon: <NoteAdd width={16} height={16} />,
        onClick: onMakeQuotation,
      },
      {
        label: "Discard",
        icon: <Delete width={16} height={16} />,
        color: "red",
        onClick: onDiscard,
      },
    ];
  }, [onDiscard, onMakeQuotation]);
}
