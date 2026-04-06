import { Paper, Group, Text, Box as MantineBox, UnstyledButton } from "@mantine/core";
import { ChevronRight, InboxTextPerson } from "@nine-thirty-five/material-symbols-react/outlined";
import { DetailGrid } from "@/components/DetailGrid";
import type { ShipmentResource } from "@/features/shipments/types/shipments.types";

interface ConsigneeDetailsProps {
  shipment: ShipmentResource;
  expanded: boolean;
  onToggle: () => void;
}

export function ConsigneeDetails({ shipment, expanded, onToggle }: ConsigneeDetailsProps) {
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
                <InboxTextPerson width="1.5rem" height="1.5rem" />
              </MantineBox>
              <Text fw={700} tt="uppercase" c="jltBlue.8">
                Consignee Details
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
                { label: "Company Name", value: shipment.consignee_details.company_name },
                { label: "Company Address", value: shipment.consignee_details.company_address },
                { label: "Contact Person", value: shipment.consignee_details.contact_person },
                { label: "Contact Number", value: shipment.consignee_details.contact_number },
                { label: "Email Address", value: shipment.consignee_details.email },
              ]}
            />
          </MantineBox>
        )}
      </Paper>
    </UnstyledButton>
  );
}
