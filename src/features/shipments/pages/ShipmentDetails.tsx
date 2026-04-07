import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Stack } from "@mantine/core";
import { useState } from "react";
import { PageCard } from "@/components/PageCard";
import { fetchShipment } from "@/features/shipments/services/shipments.service";
import { ReferenceHeader } from "@/features/shipments/components/details/ReferenceHeader";
import { ShipmentInformation } from "@/features/shipments/components/details/ShipmentInfo";
import { ConsigneeDetails } from "@/features/shipments/components/details/ConsigneeDetails";
import { PersonInCharge } from "@/features/shipments/components/details/PersonInCharge";
import { BillingSummary } from "@/features/shipments/components/details/BillingSummary";

interface ExpandedSections {
  shipment: boolean;
  consignee: boolean;
  personInCharge: boolean;
  billingSummary: boolean;
}

export function ShipmentDetailsPage() {
  const { shipmentId } = useParams<{
    tab: string;
    clientId: string;
    shipmentId: string;
  }>();

  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    shipment: false,
    consignee: false,
    personInCharge: false,
    billingSummary: false,
  });

  const { data: shipment, isLoading, error } = useQuery({
    queryKey: ["shipment", shipmentId],
    queryFn: () => fetchShipment(shipmentId!),
    enabled: !!shipmentId,
  });

  if (isLoading) return <div>Loading...</div>;

  if (error) {
    return (
      <PageCard title="Shipment Details">
        <div style={{ padding: "2rem", textAlign: "center", color: "var(--mantine-color-red-6)" }}>
          <p>Failed to load shipment details. Please try again.</p>
          <p style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </div>
      </PageCard>
    );
  }

  if (!shipment) return <div>No shipment data available</div>;

  const toggleSection = (section: keyof ExpandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <PageCard title={`${shipment.reference}`}>
      <Stack gap="lg">
        {/* Reference Header */}
        <ReferenceHeader shipment={shipment} />

        {/* Shipment Information */}
        <ShipmentInformation
          shipment={shipment}
          expanded={expandedSections.shipment}
          onToggle={() => toggleSection("shipment")}
        />

        {/* Consignee Details */}
        <ConsigneeDetails
          shipment={shipment}
          expanded={expandedSections.consignee}
          onToggle={() => toggleSection("consignee")}
        />

        {/* Person In-Charge */}
        <PersonInCharge
          shipment={shipment}
          expanded={expandedSections.personInCharge}
          onToggle={() => toggleSection("personInCharge")}
        />

        {/* Billing Summary */}
        <BillingSummary
          shipment={shipment}
          expanded={expandedSections.billingSummary}
          onToggle={() => toggleSection("billingSummary")}
        />
      </Stack>
    </PageCard>
  );
}
