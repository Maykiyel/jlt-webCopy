import { QUOTATION_STATUS } from "@/features/quotations/types/quotations.types";

interface RequestedListKeyParams {
  searchQuery: string;
  perPage: number;
}

interface RequestedClientListKeyParams extends RequestedListKeyParams {
  clientId?: string;
}

export const requestedQueryKeys = {
  quotationsRoot: () => ["quotations"] as const,
  requestedRoot: () =>
    [
      ...requestedQueryKeys.quotationsRoot(),
      QUOTATION_STATUS.REQUESTED,
    ] as const,
  requestedList: ({ searchQuery, perPage }: RequestedListKeyParams) =>
    [...requestedQueryKeys.requestedRoot(), searchQuery, perPage] as const,
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
    ["quotation", quotationId] as const,
  quotationFiles: (quotationId?: string) =>
    ["quotation-files", quotationId] as const,
  accountSpecialists: () => ["users", "account-specialists"] as const,
};
