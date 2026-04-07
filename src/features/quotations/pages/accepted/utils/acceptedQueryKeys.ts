import { quotationQueryKeys } from "@/features/quotations/api/quotationQueryKeys";
import { QUOTATION_STATUS } from "@/features/quotations/types/quotations.types";

export const acceptedQueryKeys = {
  root: () => quotationQueryKeys.byStatusRoot(QUOTATION_STATUS.ACCEPTED),
  list: ({ searchQuery, perPage }: { searchQuery: string; perPage: number }) =>
    quotationQueryKeys.byStatusList(QUOTATION_STATUS.ACCEPTED, {
      searchQuery,
      perPage,
    }),
};
