//Waiting for confirmation regarding the details of Permits and Licenses, so this is just a placeholder for now.
import { useState } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { PageCard } from "@/components/PageCard";
import { AppTable, type AppTableColumn } from "@/components/AppTable";
import { fetchPermits } from "../../services/shipments.service";
import type { PermitListItem, PermitClientGroup } from "../../types/shipments.types";

const COLUMNS: AppTableColumn<PermitListItem>[] = [
  {
    key: "no",
    label: "NO.",
    width: "8%",
    render: (_row, index) => String(index + 1).padStart(2, "0"),
  },
  {
    key: "permit_number",
    label: "PERMIT NUMBER",
    width: "20%",
    render: (row) => row.permit_number,
  },
  {
    key: "client_name",
    label: "CLIENT NAME",
    width: "25%",
    render: (row) => row.client_name,
  },
  {
    key: "permit_type",
    label: "PERMIT TYPE",
    width: "22%",
    render: (row) => row.permit_type,
  },
  {
    key: "issued_date",
    label: "ISSUED DATE",
    width: "15%",
    render: (row) => row.issued_date,
  },
  {
    key: "status",
    label: "STATUS",
    width: "10%",
    render: (row) => row.status,
  },
];

export function PermitsShipments() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [perPage, setPerPage] = useState(10);

  const { data, isLoading } = useQuery({
    queryKey: ["permits", searchQuery, perPage],
    queryFn: () =>
      fetchPermits({
        search: searchQuery || undefined,
        perPage,
      }),
  });

  const permits = data?.permits ?? [];
  const total = data?.pagination.total ?? 0;
  const count = data?.pagination.count ?? 0;

  return (
    <PageCard title="LIST OF PERMITS" subtext="permits" subtextColor="#17314B">
      <AppTable
        columns={COLUMNS}
        data={isLoading ? [] : permits.flatMap((group: PermitClientGroup) => group.permits)}
        rowKey={(row) => row.id}
        withEntryControls
        perPage={perPage}
        onPerPageChange={setPerPage}
        total={total}
        showingCount={count}
        searchPlaceholder="SEARCH PERMIT NO. OR CLIENT NAME"
        searchValue={search}
        onSearchChange={setSearch}
        onSearch={setSearchQuery}
        onRowClick={(row) => navigate(`/shipments/regulatory/permits/${row.id}`)}
      />
    </PageCard>
  );
}
