import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { PageCard } from "@/components/PageCard";
import { AppTable, type AppTableColumn } from "@/components/AppTable";

// Define a local type for static test rows
interface DeliveredShipment {
  reference: string;
  client_name: string;
  client_id: number;
  destination: string;
  eta: string;
  etd: string;
  status: string;
}

const COLUMNS: AppTableColumn<DeliveredShipment>[] = [
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

export function DeliveredShipments() {
  const navigate = useNavigate();
  const { category } = useParams();
  const tab = category || "logistics";
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [perPage, setPerPage] = useState(10);

  // Static test data
  const deliveredShipments: DeliveredShipment[] = [
    {
      reference: "IM-09-2025-001",
      client_name: "JENNY CARLA DELA CRUZ",
      client_id: 1,
      destination: "CLARK -> MANILA",
      eta: "2026-03-20",
      etd: "2026-03-15",
      status: "Delivered",
    },
    {
      reference: "EX-09-2025-002",
      client_name: "JUAN DELA CRUZ",
      client_id: 2,
      destination: "MANILA -> CLARK",
      eta: "2026-03-22",
      etd: "2026-03-16",
      status: "Delivered",
    },
    {
      reference: "IM-09-2025-003",
      client_name: "TRISHA NUESTRO",
      client_id: 3,
      destination: "CHINA -> MANILA",
      eta: "2026-03-25",
      etd: "2026-03-18",
      status: "Delivered",
    },
  ];

  return (
    <PageCard title="LIST OF SHIPMENTS" subtext="Delivered" subtextColor="#17314B">
      <AppTable
        columns={COLUMNS}
        data={deliveredShipments.filter(
          (row) =>
            !searchQuery ||
            row.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
            row.client_name.toLowerCase().includes(searchQuery.toLowerCase())
        )}
        rowKey={(row) => row.reference}
        withEntryControls
        perPage={perPage}
        onPerPageChange={setPerPage}
        total={deliveredShipments.length}
        showingCount={deliveredShipments.length}
        searchPlaceholder="SEARCH REFERENCE OR CLIENT NAME"
        searchValue={search}
        onSearchChange={setSearch}
        onSearch={setSearchQuery}
        onRowClick={(row) => navigate(`/shipments/${tab}/client/${row.client_id}/${row.reference}`)}
      />
    </PageCard>
  );
}
