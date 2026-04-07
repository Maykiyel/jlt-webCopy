import { quotationQueryKeys } from "@/features/quotations/api/quotationQueryKeys";
import { QUOTATION_STATUS } from "@/features/quotations/types/quotations.types";

export const respondedQueryKeys = {
  root: () => quotationQueryKeys.byStatusRoot(QUOTATION_STATUS.RESPONDED),
  list: ({ searchQuery, perPage }: { searchQuery: string; perPage: number }) =>
    quotationQueryKeys.byStatusList(QUOTATION_STATUS.RESPONDED, {
      searchQuery,
      perPage,
    }),
};
