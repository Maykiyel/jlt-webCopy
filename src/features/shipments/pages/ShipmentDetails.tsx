import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Stack, Group, Image, Paper, Text, Box as MantineBox, UnstyledButton } from "@mantine/core";
import { useState } from "react";
import {
  InboxTextPerson,
  Box,
  AccountBox,
  ChevronRight,
  ChatBubble,
} from "@nine-thirty-five/material-symbols-react/outlined";
import { PageCard } from "@/components/PageCard";
import { DetailGrid } from "@/components/DetailGrid";
import { fetchShipment } from "@/features/shipments/services/shipments.service";

interface ExpandedSections {
  shipment: boolean;
  consignee: boolean;
  personInCharge: boolean;
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
        {/* Client Header */}
        <Paper
          radius="md"
          p="lg"
          style={{
            backgroundColor: "#f8f9fa",
            border: "1px solid var(--mantine-color-gray-2)",
          }}
        >
          <Group align="center" gap="lg">
            <Image
              src="/assets/logos/default-client.png"
              alt="Client Picture"
              width={60}
              radius="xl"
            />
            <MantineBox flex={1}>
              <Text fw={700} size="lg" c="jltBlue.8">
                {shipment.client?.full_name ?? "—"}
              </Text>
              <Text size="sm" c="dimmed">
                {shipment.client?.company_name ?? "—"}
              </Text>
            </MantineBox>
            <MantineBox
              style={{
                color: "var(--mantine-color-jltBlue-8)",
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <ChatBubble width="1.5rem" height="1.5rem" />
            </MantineBox>
          </Group>
        </Paper>

        {/* Shipment Details - Collapsible */}
        <UnstyledButton
          w="100%"
          onClick={() => toggleSection("shipment")}
          style={{ textAlign: "left" }}
        >
          <Paper
            radius="md"
            p="lg"
            style={{
              backgroundColor: expandedSections.shipment ? "#fff" : "#f8f9fa",
              border: "1px solid var(--mantine-color-gray-2)",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
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
                  Shipment Details
                </Text>
              </Group>
              <ChevronRight
                width="1.5rem"
                height="1.5rem"
                style={{
                  transform: expandedSections.shipment ? "rotate(90deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                }}
              />
            </Group>

            {expandedSections.shipment && (
              <MantineBox mt="lg">
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

        {/* Consignee Details - Collapsible */}
        <UnstyledButton
          w="100%"
          onClick={() => toggleSection("consignee")}
          style={{ textAlign: "left" }}
        >
          <Paper
            radius="md"
            p="lg"
            style={{
              backgroundColor: expandedSections.consignee ? "#fff" : "#f8f9fa",
              border: "1px solid var(--mantine-color-gray-2)",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
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
                  transform: expandedSections.consignee ? "rotate(90deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                }}
              />
            </Group>

            {expandedSections.consignee && (
              <MantineBox mt="lg">
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

        {/* Person In-Charge - Collapsible */}
        <UnstyledButton
          w="100%"
          onClick={() => toggleSection("personInCharge")}
          style={{ textAlign: "left" }}
        >
          <Paper
            radius="md"
            p="lg"
            style={{
              backgroundColor: expandedSections.personInCharge ? "#fff" : "#f8f9fa",
              border: "1px solid var(--mantine-color-gray-2)",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
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
                  transform: expandedSections.personInCharge ? "rotate(90deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                }}
              />
            </Group>

            {expandedSections.personInCharge && (
              <MantineBox mt="lg">
                <DetailGrid
                  rows={[
                    { label: "Name", value: shipment.person_in_charge?.name ?? "—" },
                  ]}
                />
              </MantineBox>
            )}
          </Paper>
        </UnstyledButton>
      </Stack>
    </PageCard>
  );
}
