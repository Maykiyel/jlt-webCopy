import { Paper, Group, Text, Box as MantineBox, UnstyledButton } from "@mantine/core";
import { ChevronRight, InboxTextPerson } from "@nine-thirty-five/material-symbols-react/outlined";
import type { ShipmentResource } from "@/features/shipments/types/shipments.types";

interface BillingSummaryProps {
  shipment: ShipmentResource;
  expanded: boolean;
  onToggle: () => void;
}

export function BillingSummary({ shipment, expanded, onToggle }: BillingSummaryProps) {
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
                Billing Summary
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
            {/* Terms of Payment */}
            <Group justify="space-between" align="center" mb="xs" mt="-xs">
              <Text fw={600} c="jltBlue.8">Terms Of Payment</Text>
              <Text c="jltBlue.8">{shipment.billing_summary?.terms_of_payment ?? "—"}</Text>
            </Group>

            {/* Description of Charges */}
            <Paper withBorder={false} radius={0} bg="#E9EFF4" mx="-lg">
              <Group justify="space-between" align="center" px="lg" py="xs" mb="sm">
                <Text fw={700} c="jltBlue.8">Description Of Charges</Text>
                <Text fw={700} c="jltBlue.8">{shipment.billing_summary?.description_of_charges.value ?? "—"}</Text>
              </Group>
            </Paper>

            <Group justify="space-between" align="center" mb="xs">
              <Text c="gray.8">Bureau Of Customs Accreditation Fee</Text>
              <Text c="jltBlue.8">{shipment.billing_summary?.description_of_charges.fields.bureau_of_customs_accreditation_fee ?? "—"}</Text>
            </Group>
            <Group justify="space-between" align="center" mb="xs">
              <Text c="gray.8">Certificate Of Accreditation</Text>
              <Text c="jltBlue.8">{shipment.billing_summary?.description_of_charges.fields.certificate_of_accreditation ?? "—"}</Text>
            </Group>

            {/* JLTCB Service Charges */}
            <Paper withBorder={false} radius={0} bg="#E9EFF4" mx="-lg">
              <Group justify="space-between" align="center" px="lg" py="xs" mb="sm">
                <Text fw={700} c="jltBlue.8">JLTCB Service Charges</Text>
                <Text fw={700} c="jltBlue.8">
                  {shipment.billing_summary?.jltcb_service_charges.value ?? "—"}
                </Text>
              </Group>
            </Paper>

            <Group justify="space-between" align="center" mb="xs">
              <Text c="gray.8">Certificate Of Accreditation</Text>
              <Text c="jltBlue.8">{shipment.billing_summary?.jltcb_service_charges.fields.certificate_of_accreditation ?? "—"}</Text>
            </Group>
            <Group justify="space-between" align="center" mb="xs">
              <Text c="gray.8">Royal Fee</Text>
              <Text c="jltBlue.8">{shipment.billing_summary?.jltcb_service_charges.fields.royal_fee ?? "—"}</Text>
            </Group>

            {/* Estimated Total Landed Cost */}
            <Paper
              withBorder={false}
              bg="#E9EFF4"
              mx="-lg"
              mb="-sm"
              style={{ borderBottomLeftRadius: 8, borderBottomRightRadius: 8, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
            >
              <Group justify="space-between" align="center" px="lg" py="xs">
                <Text fw={700}>ESTIMATED TOTAL LANDED COST</Text>
                <Text fw={700} c="jltBlue.8">
                  {shipment.billing_summary?.estimated_total_landed_cost ?? "—"}
                </Text>
              </Group>
            </Paper>
          </MantineBox>
        )}
      </Paper>
    </UnstyledButton>
  );
}
