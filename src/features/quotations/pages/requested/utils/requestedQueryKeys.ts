import { QUOTATION_STATUS } from "@/features/quotations/types/quotations.types";
import { quotationQueryKeys } from "@/features/quotations/pages/utils/quotationQueryKeys";

interface RequestedListKeyParams {
  searchQuery: string;
  perPage: number;
}

interface RequestedClientListKeyParams extends RequestedListKeyParams {
  clientId?: string;
}

export const requestedQueryKeys = {
  quotationsRoot: quotationQueryKeys.quotationsRoot,
  requestedRoot: () =>
    quotationQueryKeys.byStatusRoot(QUOTATION_STATUS.REQUESTED),
  requestedList: ({ searchQuery, perPage }: RequestedListKeyParams) =>
    quotationQueryKeys.byStatusList(QUOTATION_STATUS.REQUESTED, {
      searchQuery,
      perPage,
    }),
  requestedClientList: ({
    clientId,
    searchQuery,
    perPage,
  }: RequestedClientListKeyParams) =>
    [
      ...requestedQueryKeys.requestedRoot(),
      clientId,
      searchQuery,
      perPage,
    ] as const,
  quotationDetails: (quotationId?: string) =>
    quotationQueryKeys.quotationDetails(quotationId),
  quotationFiles: (
    quotationId?: string,
    type: "REQUESTED" | "PROPOSAL" = "REQUESTED",
  ) => quotationQueryKeys.quotationFiles(quotationId, type),
  accountSpecialists: () => ["users", "account-specialists"] as const,
};
