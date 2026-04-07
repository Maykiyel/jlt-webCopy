import type { QuotationStatus } from "@/features/quotations/types/quotations.types";

interface StatusListKeyParams {
  searchQuery: string;
  perPage: number;
}

export const quotationQueryKeys = {
  quotationsRoot: () => ["quotations"] as const,
  byStatusRoot: (status: QuotationStatus) =>
    [...quotationQueryKeys.quotationsRoot(), status] as const,
  byStatusList: (status: QuotationStatus, params: StatusListKeyParams) =>
    [
      ...quotationQueryKeys.byStatusRoot(status),
      params.searchQuery,
      params.perPage,
    ] as const,
  quotationDetails: (quotationId?: string) =>
    ["quotation", quotationId] as const,
  quotationFiles: (
    quotationId?: string,
    type: "REQUESTED" | "PROPOSAL" = "REQUESTED",
  ) => ["quotation-files", quotationId, type] as const,
};
