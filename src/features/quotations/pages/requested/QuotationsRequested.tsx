import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { PageCard } from "@/components/PageCard";
import { AppTable, type AppTableColumn } from "@/components/AppTable";
import { fetchQuotations } from "../../services/quotations.service";
import { useQuotationTableSearch } from "@/features/quotations/pages/hooks/useQuotationTableSearch";
import { requestedQueryKeys } from "./utils/requestedQueryKeys";
import { quotationRoutes } from "@/features/quotations/pages/utils/quotationRoutes";
import {
  QUOTATION_STATUS,
  type QuotationClientGroup,
} from "../../types/quotations.types";

const COLUMNS: AppTableColumn<QuotationClientGroup>[] = [
  {
    key: "no",
    label: "NO.",
    width: "10%",
    render: (_row, index) => String(index + 1).padStart(2, "0"),
  },
  {
    key: "quotations",
    label: "DATE",
    width: "15%",
    // Most recent quotation date from the client's list
    render: (row) => row.quotations?.[0]?.date ?? "—",
  },
  {
    key: "name",
    label: "FULL NAME",
    width: "55%",
    render: (row) => row.name,
  },
  {
    key: "request_count",
    label: "NO. OF REQUEST",
    width: "20%",
    render: (row) => String(row.request_count),
  },
];

export function QuotationsRequested() {
  const navigate = useNavigate();
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
      fetchQuotations({
        status: QUOTATION_STATUS.REQUESTED,
        search: searchQuery || undefined,
        perPage,
      }),
  });

  const quotations = data?.quotations ?? [];
  const total = data?.pagination.total ?? 0;
  const count = data?.pagination.count ?? 0;

  return (
    <PageCard title="LIST OF NEW REQUEST">
      <AppTable
        columns={COLUMNS}
        data={isLoading ? [] : quotations}
        rowKey={(row) => row.client_id}
        withEntryControls
        perPage={perPage}
        onPerPageChange={setPerPage}
        total={total}
        showingCount={count}
        searchPlaceholder="SEARCH CLIENT NAME"
        searchValue={search}
        onSearchChange={handleSearchChange}
        onSearch={handleSearch}
        onRowClick={(row) =>
          navigate(quotationRoutes.client("requested", row.client_id))
        }
      />
    </PageCard>
  );
}
