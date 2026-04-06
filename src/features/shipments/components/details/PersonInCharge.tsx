import { Paper, Group, Text, Box as MantineBox, UnstyledButton } from "@mantine/core";
import { ChevronRight, AccountBox } from "@nine-thirty-five/material-symbols-react/outlined";
import { DetailGrid } from "@/components/DetailGrid";
import type { ShipmentResource } from "@/features/shipments/types/shipments.types";

interface PersonInChargeProps {
  shipment: ShipmentResource;
  expanded: boolean;
  onToggle: () => void;
}

export function PersonInCharge({ shipment, expanded, onToggle }: PersonInChargeProps) {
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
                <AccountBox width="1.5rem" height="1.5rem" />
              </MantineBox>
              <Text fw={700} tt="uppercase" c="jltBlue.8">
                Person In Charge
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
          <MantineBox p="lg" pb="xs">
            <DetailGrid
              rows={[
                { label: "Name", value: shipment.person_in_charge?.name ?? "—" },
                { label: "Remarks", value: shipment.person_in_charge?.remarks ?? "—" },
              ]}
            />
          </MantineBox>
        )}
      </Paper>
    </UnstyledButton>
  );
}
