import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import {
  Download,
  RequestQuote,
  Print,
} from "@nine-thirty-five/material-symbols-react/outlined";
import {
  AppTable,
  type AppTableAction,
  type AppTableColumn,
} from "@/components/AppTable";
import { PageCard } from "@/components/PageCard";
import { useQuotationTableSearch } from "@/features/quotations/pages/hooks/useQuotationTableSearch";
import { fetchRespondedQuotations } from "@/features/quotations/services/quotations.service";
import type { RespondedQuotationListItem } from "@/features/quotations/types/quotations.types";
import { respondedQueryKeys } from "@/features/quotations/pages/responded/utils/respondedQueryKeys";
import { quotationRoutes } from "@/features/quotations/pages/utils/quotationRoutes";

const COLUMNS: AppTableColumn<RespondedQuotationListItem>[] = [
  {
    key: "no",
    label: "NO.",
    width: "8%",
    render: (_row, index) => String(index + 1).padStart(2, "0"),
  },
  {
    key: "reference_number",
    label: "REFERENCE",
    width: "18%",
    render: (row) => row.reference_number,
  },
  {
    key: "date",
    label: "DATE CREATED",
    width: "14%",
    render: (row) => row.date,
  },
  {
    key: "client_name",
    label: "CLIENT NAME",
    width: "24%",
    render: (row) => row.client_name,
  },
  {
    key: "service_type",
    label: "SERVICE TYPE",
    width: "14%",
    render: (row) => row.service_type ?? "—",
  },
  {
    key: "prepared_by",
    label: "PREPARED BY",
    width: "18%",
    render: (row) => row.prepared_by ?? "—",
  },
];

export function QuotationsResponded() {
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
    queryKey: respondedQueryKeys.list({ searchQuery, perPage }),
    queryFn: () =>
      fetchRespondedQuotations({
        search: searchQuery || undefined,
        perPage,
      }),
  });

  const rows = data?.quotations ?? [];
  const total = data?.pagination.total ?? 0;
  const count = data?.pagination.count ?? rows.length;

  const actions = useMemo<AppTableAction<RespondedQuotationListItem>[]>(
    () => [
      {
        label: "Update Quotation",
        icon: <RequestQuote width={16} height={16} />,
        onClick: () => {
          // TODO: connect to responded quotation update flow.
        },
      },
      {
        label: "Print",
        icon: <Print width={16} height={16} />,
        onClick: () => {
          // TODO: connect to responded quotation print flow.
        },
      },
      {
        label: "Download",
        icon: <Download width={16} height={16} />,
        onClick: () => {
          // TODO: connect to responded quotation download flow.
        },
      },
    ],
    [],
  );

  return (
    <PageCard title="LIST OF RESPONDED QUOTATION">
      <AppTable
        columns={COLUMNS}
        data={isLoading ? [] : rows}
        rowKey={(row) => row.id}
        onRowClick={(row) =>
          navigate(
            quotationRoutes.details({
              tab: "responded",
              quotationId: row.id,
            }),
            {
              state: row.issued_quotation_id
                ? { issuedQuotationId: String(row.issued_quotation_id) }
                : undefined,
            },
          )
        }
        actions={actions}
        withEntryControls
        perPage={perPage}
        onPerPageChange={setPerPage}
        total={total}
        showingCount={count}
        searchPlaceholder="SEARCH REFERENCE OR CLIENT"
        searchValue={search}
        onSearchChange={handleSearchChange}
        onSearch={handleSearch}
      />
    </PageCard>
  );
}
