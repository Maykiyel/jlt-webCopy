import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { PageCard } from "@/components/PageCard";
import { AppTable, type AppTableColumn } from "@/components/AppTable";
import { fetchShipments } from "../../services/shipments.service";
import {
  SHIPMENT_STATUS,
  type ShipmentListItem,
  type ShipmentClientGroup,
} from "../../types/shipments.types";

const COLUMNS: AppTableColumn<ShipmentListItem>[] = [
  {
    key: "reference",
    label: "REFERENCE",
    width: "15%",
    render: (row) => row.reference,
  },
  {
    key: "client_name",
    label: "CLIENT NAME",
    width: "25%",
    render: (row) => row.client_name,
  },
  {
    key: "destination",
    label: "DESTINATION",
    width: "20%",
    render: (row) => row.destination,
  },
  {
    key: "eta",
    label: "ETA",
    width: "10%",
    render: (row) => row.eta,
  },
  {
    key: "etd",
    label: "ETD",
    width: "10%",
    render: (row) => row.etd,
  },
  {
    key: "status",
    label: "STATUS",
    width: "12%",
    render: (row) => row.status,
  },
];


export function OngoingShipments() {
  const navigate = useNavigate();
  const { category } = useParams();
  const tab = category || "logistics";
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [perPage, setPerPage] = useState(10);

  const { data, isLoading } = useQuery({
    queryKey: ["shipments", SHIPMENT_STATUS.ONGOING, searchQuery, perPage],
    queryFn: () =>
      fetchShipments({
        status: SHIPMENT_STATUS.ONGOING,
        search: searchQuery || undefined,
        perPage,
      }),
  });

  const shipments = data?.shipments ?? [];
  const total = data?.pagination.total ?? 0;
  const count = data?.pagination.count ?? 0;

  return (
    <PageCard title="LIST OF SHIPMENTS" subtext="ongoing" subtextColor="#17314B">
      <AppTable
        columns={COLUMNS}
        data={isLoading ? [] : shipments.flatMap((group: ShipmentClientGroup) => 
          group.shipments.map(shipment => ({ ...shipment, client_id: group.client_id }))
        )}
        rowKey={(row) => row.reference}
        withEntryControls
        perPage={perPage}
        onPerPageChange={setPerPage}
        total={total}
        showingCount={count}
        searchPlaceholder="SEARCH REFERENCE OR CLIENT NAME"
        searchValue={search}
        onSearchChange={setSearch}
        onSearch={setSearchQuery}
        onRowClick={(row) => navigate(`/shipments/${tab}/client/${row.client_id}/${row.reference}`)}
      />
    </PageCard>
  );
}
