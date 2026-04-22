import { useNavigate } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PageCard } from "@/components/PageCard";
import AppTable2 from "@/components/AppTable2";
import { useState } from "react";
import {
  fetchQuotation,
  fetchRequestedQuotations,
} from "@/features/quotations/api/quotations.api";
import { quotationQueryKeys } from "@/features/quotations/api/quotationQueryKeys";
import { useQuotationTableSearch } from "@/features/quotations/hooks/useQuotationTableSearch";
import { quotationRoutes } from "@/features/quotations/utils/quotationRoutes";
import { requestedQueryKeys } from "./utils/requestedQueryKeys";

export function QuotationsRequested() {
  const [jobFilter, setJobFilter] = useState<"all" | "my-jobs">("all");

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    search,
    searchQuery,
    perPage,
    setPerPage,
    handleSearch,
    handleSearchChange,
  } = useQuotationTableSearch();

  const { data, isLoading } = useQuery({
    queryKey: requestedQueryKeys.requestedList({ searchQuery, perPage }),
    queryFn: () =>
      fetchRequestedQuotations({
        search: searchQuery || undefined,
        perPage,
      }),
  });

  const rows = data?.quotations ?? [];
  const total = data?.pagination.total ?? 0;
  const count = data?.pagination.count ?? rows.length;

  const prefetchQuotationDetails = (quotationId: string) => {
    void queryClient.prefetchQuery({
      queryKey: quotationQueryKeys.quotationDetails(quotationId),
      queryFn: () => fetchQuotation(quotationId),
      staleTime: 30_000,
    });
  };

  return (
    <PageCard
      title="LIST OF NEW REQUEST"
      showJobSwitch
      jobSwitchValue={jobFilter}
      onJobSwitchChange={setJobFilter}
    >
      <AppTable2
        quotations={rows}
        isLoading={isLoading}
        searchValue={search}
        onSearchChange={handleSearchChange}
        onSearch={handleSearch}
        perPage={perPage}
        onPerPageChange={setPerPage}
        showingCount={count}
        total={total}
        onRowClick={(row) => {
          const quotationId = String(row.id);
          prefetchQuotationDetails(quotationId);
          navigate(
            quotationRoutes.details({
              tab: "requested",
              quotationId,
            }),
          );
        }}
      />
    </PageCard>
  );
}
