/* Waiting for confirmation regarding the details of Permits and Licenses, so this is just a placeholder for now.
import { useState } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { PageCard } from "@/components/PageCard";
import { AppTable, type AppTableColumn } from "@/components/AppTable";
import { fetchPermits, fetchLicenses } from "../services/shipments.service";
import type {
  PermitListItem,
  LicenseListItem,
  PermitClientGroup,
  LicenseClientGroup,
} from "../types/shipments.types";

type CombinedItem = PermitListItem | LicenseListItem;

const COLUMNS: AppTableColumn<CombinedItem>[] = [
  {
    key: "no",
    label: "NO.",
    width: "8%",
    render: (_row, index) => String(index + 1).padStart(2, "0"),
  },
  {
    key: "permit_number",
    label: "REFERENCE",
    width: "20%",
    render: (row) =>
      "permit_number" in row ? row.permit_number : row.license_number,
  },
  {
    key: "client_name",
    label: "CLIENT NAME",
    width: "30%",
    render: (row) => row.client_name,
  },
  {
    key: "permit_type",
    label: "TYPE",
    width: "25%",
    render: (row) =>
      "permit_type" in row ? row.permit_type : row.license_type,
  },
  {
    key: "issued_date",
    label: "ISSUED DATE",
    width: "17%",
    render: (row) => row.issued_date,
  },
];

export function ShipmentRegulatory() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [perPage, setPerPage] = useState(10);

  // Fetch both permits and licenses
  const { data: permitsData, isLoading: permitsLoading } = useQuery({
    queryKey: ["permits", searchQuery, perPage],
    queryFn: () =>
      fetchPermits({
        search: searchQuery || undefined,
        perPage,
      }),
  });

  const { data: licensesData, isLoading: licensesLoading } = useQuery({
    queryKey: ["licenses", searchQuery, perPage],
    queryFn: () =>
      fetchLicenses({
        search: searchQuery || undefined,
        perPage,
      }),
  });

  // Combine both datasets
  const allPermits = permitsData?.permits ?? [];
  const allLicenses = licensesData?.licenses ?? [];

  const allFlatItems: CombinedItem[] = [
    ...allPermits.flatMap((group: PermitClientGroup) => group.permits),
    ...allLicenses.flatMap((group: LicenseClientGroup) => group.licenses),
  ];

  const totalPermits = permitsData?.pagination.total ?? 0;
  const totalLicenses = licensesData?.pagination.total ?? 0;
  const total = totalPermits + totalLicenses;

  const countPermits = permitsData?.pagination.count ?? 0;
  const countLicenses = licensesData?.pagination.count ?? 0;
  const count = countPermits + countLicenses;

  const isLoading = permitsLoading || licensesLoading;

  return (
    <PageCard title="LIST OF REGULATORY" subtext="permits and licenses" subtextColor="#17314B">
      <AppTable
        columns={COLUMNS}
        data={isLoading ? [] : allFlatItems}
        rowKey={(row) => row.id}
        withEntryControls
        perPage={perPage}
        onPerPageChange={setPerPage}
        total={total}
        showingCount={count}
        searchPlaceholder="SEARCH REFERENCE OR CLIENT NAME"
        searchValue={search}
        onSearchChange={setSearch}
        onSearch={setSearchQuery}
        onRowClick={(row) => {
          if ("permit_number" in row) {
            navigate(`/shipments/regulatory/permits/${row.id}`);
          } else {
            navigate(`/shipments/regulatory/licenses/${row.id}`);
          }
        }}
      />
    </PageCard>
  );
}
*/