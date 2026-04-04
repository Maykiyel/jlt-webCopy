/* Waiting for confirmation regarding the details of Permits and Licenses, so this is just a placeholder for now.
import { useState } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { PageCard } from "@/components/PageCard";
import { AppTable, type AppTableColumn } from "@/components/AppTable";
import { fetchLicenses } from "../services/shipments.service";
import type { LicenseListItem, LicenseClientGroup } from "../types/shipments.types";

const COLUMNS: AppTableColumn<LicenseListItem>[] = [
  {
    key: "no",
    label: "NO.",
    width: "8%",
    render: (_row, index) => String(index + 1).padStart(2, "0"),
  },
  {
    key: "license_number",
    label: "LICENSE NUMBER",
    width: "20%",
    render: (row) => row.license_number,
  },
  {
    key: "client_name",
    label: "CLIENT NAME",
    width: "25%",
    render: (row) => row.client_name,
  },
  {
    key: "license_type",
    label: "LICENSE TYPE",
    width: "22%",
    render: (row) => row.license_type,
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

export function LicensesShipments() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [perPage, setPerPage] = useState(10);

  const { data, isLoading } = useQuery({
    queryKey: ["licenses", searchQuery, perPage],
    queryFn: () =>
      fetchLicenses({
        search: searchQuery || undefined,
        perPage,
      }),
  });

  const licenses = data?.licenses ?? [];
  const total = data?.pagination.total ?? 0;
  const count = data?.pagination.count ?? 0;

  return (
    <PageCard title="LIST OF LICENSES" subtext="licenses" subtextColor="#17314B">
      <AppTable
        columns={COLUMNS}
        data={isLoading ? [] : licenses.flatMap((group: LicenseClientGroup) => group.licenses)}
        rowKey={(row) => row.id}
        withEntryControls
        perPage={perPage}
        onPerPageChange={setPerPage}
        total={total}
        showingCount={count}
        searchPlaceholder="SEARCH LICENSE NO. OR CLIENT NAME"
        searchValue={search}
        onSearchChange={setSearch}
        onSearch={setSearchQuery}
        onRowClick={(row) => navigate(`/shipments/regulatory/licenses/${row.id}`)}
      />
    </PageCard>
  );
}
*/