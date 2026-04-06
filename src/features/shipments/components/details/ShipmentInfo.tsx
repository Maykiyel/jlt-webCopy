import { Paper, Group, Text, Box as MantineBox, UnstyledButton } from "@mantine/core";
import { ChevronRight, Box } from "@nine-thirty-five/material-symbols-react/outlined";
import { DetailGrid } from "@/components/DetailGrid";
import type { ShipmentResource } from "@/features/shipments/types/shipments.types";

interface ShipmentInformationProps {
  shipment: ShipmentResource;
  expanded: boolean;
  onToggle: () => void;
}

export function ShipmentInformation({ shipment, expanded, onToggle }: ShipmentInformationProps) {
  return (
    <UnstyledButton w="100%" onClick={onToggle} style={{ textAlign: "left" }}>
      <Paper
        radius="md"
        p={0}
        style={{
          border: "1px solid var(--mantine-color-gray-2)",
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
      >
        {/* Top header strip */}
        <MantineBox
          w="100%"
          bg="#D4DAE0"
          p="lg"
          style={{ borderBottom: "1px solid var(--mantine-color-gray-2)" }}
        >
          <Group justify="space-between" align="center">
            <Group gap="sm">
              <MantineBox
                style={{
                  color: "var(--mantine-color-jltBlue-8)",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Box width="1.5rem" height="1.5rem" />
              </MantineBox>
              <Text fw={700} tt="uppercase" c="jltBlue.8">
                Shipment Information
              </Text>
            </Group>
            <ChevronRight
              width="1.5rem"
              height="1.5rem"
              style={{
                transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
              }}
            />
          </Group>
        </MantineBox>

        {/* Collapsible content */}
        {expanded && (
          <MantineBox p="lg" pb="sm">
            <DetailGrid
              rows={[
                { label: "Service Type", value: shipment.shipment_details.service_type },
                { label: "Freight Transport Mode", value: shipment.shipment_details.freight_transport_mode },
                { label: "Service", value: shipment.shipment_details.service },
                { label: "Commodity", value: shipment.shipment_details.commodity },
                { label: "Volume (Dimension)", value: shipment.shipment_details.volume_dimension },
                { label: "Origin", value: shipment.shipment_details.origin },
                { label: "Destination", value: shipment.shipment_details.destination },
                ...(shipment.shipment_details.details_remarks
                  ? [{ label: "Details / Remarks", value: shipment.shipment_details.details_remarks }]
                  : []),
              ]}
            />
          </MantineBox>
        )}
      </Paper>
    </UnstyledButton>
  );
}
