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

export function ShipmentLogistics() {
  const navigate = useNavigate();
  const { category } = useParams();
  const tab = category || "logistics";
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [perPage, setPerPage] = useState(10);

  // Fetch both ongoing and delivered shipments
  const { data: ongoingData, isLoading: ongoingLoading } = useQuery({
    queryKey: ["shipments", SHIPMENT_STATUS.ONGOING, searchQuery, perPage],
    queryFn: () =>
      fetchShipments({
        status: SHIPMENT_STATUS.ONGOING,
        search: searchQuery || undefined,
        perPage,
      }),
  });

  const { data: deliveredData, isLoading: deliveredLoading } = useQuery({
    queryKey: ["shipments", SHIPMENT_STATUS.DELIVERED, searchQuery, perPage],
    queryFn: () =>
      fetchShipments({
        status: SHIPMENT_STATUS.DELIVERED,
        search: searchQuery || undefined,
        perPage,
      }),
  });

  // Combine both datasets and preserve client_id
  const allShipments = [
    ...(ongoingData?.shipments ?? []),
    ...(deliveredData?.shipments ?? []),
  ];
  const allFlatShipments = allShipments.flatMap((group: ShipmentClientGroup) =>
    group.shipments.map(shipment => ({ ...shipment, client_id: group.client_id }))
  );

  const totalOngoing = ongoingData?.pagination.total ?? 0;
  const totalDelivered = deliveredData?.pagination.total ?? 0;
  const total = totalOngoing + totalDelivered;

  const countOngoing = ongoingData?.pagination.count ?? 0;
  const countDelivered = deliveredData?.pagination.count ?? 0;
  const count = countOngoing + countDelivered;

  const isLoading = ongoingLoading || deliveredLoading;

  return (
    <PageCard title="LIST OF LOGISTICS" subtext="shipments" subtextColor="#17314B">
      <AppTable
        columns={COLUMNS}
        data={isLoading ? [] : allFlatShipments}
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
