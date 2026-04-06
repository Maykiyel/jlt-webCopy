import { Group, Paper, Stack, Text, Image, Avatar, ActionIcon, Box as MantineBox } from "@mantine/core";
import chatbubble from "@/assets/icons/chatbubble.svg";
import shipmentLogo from "@/assets/logos/ShipmentLogo.png";
import type { ShipmentResource } from "@/features/shipments/types/shipments.types";

interface ReferenceHeaderProps {
  shipment: ShipmentResource;
}

export function ReferenceHeader({ shipment }: ReferenceHeaderProps) {
  return (
    <Group align="stretch" grow>
      {/* First Paper: Client Header */}
      <Paper
        radius="md"
        withBorder
        style={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <MantineBox
          bg="#D4DAE0"
          p="xs"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Group gap="xl">
            <Avatar
              src={shipment.client?.imageUrl ?? "/assets/logos/default-client.png"}
              alt={shipment.client?.full_name ?? "Client Picture"}
              size={50}
              radius="xl"
              color="jltOrange"
            />
            <Text fw={700} size="xl" c="jltBlue.8">
              {shipment.client?.full_name ?? "—"}
            </Text>
          </Group>
          <ActionIcon
            variant="transparent"
            color="transparent"
            radius="xxl"
            size="lg"
            aria-label="Chat"
            onClick={() => console.log("Chat clicked")}
          >
            <Image src={chatbubble} alt="Chat Icon" width={35} height={35} />
          </ActionIcon>
        </MantineBox>

        <MantineBox p="lg" bg="white" style={{ flex: 1 }}>
          <Stack gap="sm">
            <Group style={{ minHeight: "1rem" }}>
              <Text c="gray.6">COMPANY NAME:</Text>
              <Text fw={450}>{shipment.client?.company_name ?? "—"}</Text>
            </Group>
            <Group style={{ minHeight: "1rem" }}>
              <Text c="gray.6">COMPANY NUMBER:</Text>
              <Text fw={450}>{shipment.client?.contact_number ?? "—"}</Text>
            </Group>
            <Group style={{ minHeight: "1rem" }}>
              <Text c="gray.6">EMAIL:</Text>
              <Text fw={450}>{shipment.client?.email ?? "—"}</Text>
            </Group>
          </Stack>
        </MantineBox>
      </Paper>

      {/* Second Paper: Shipment Status */}
      <Paper
        radius="md"
        withBorder
        style={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <MantineBox
          bg="#D4DAE0"
          p="md"
          style={{
            flex: "0 0 20%",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Text fw={600} size="xl" c="green">
            {shipment.status ?? "—"}
          </Text>
        </MantineBox>

        <MantineBox
          p="lg"
          bg="white"
          style={{
            flex: 1,
            position: "relative",
          }}
        >
          <Stack gap="sm" style={{ zIndex: 2, position: "relative" }}>
            <Group gap="xs" wrap="nowrap" style={{ minHeight: "1rem" }}>
              <Text c="gray.6">COMMODITY:</Text>
              <Text fw={450}>{shipment.commodity ?? "—"}</Text>
            </Group>
            <Group gap="xs" wrap="nowrap" style={{ minHeight: "1rem" }}>
              <Text c="gray.6">ORIGIN:</Text>
              <Text fw={450}>{shipment.origin ?? "—"}</Text>
            </Group>
            <Group gap="xs" wrap="nowrap" style={{ minHeight: "1rem" }}>
              <Text c="gray.6">DESTINATION:</Text>
              <Text fw={450}>{shipment.destination ?? "—"}</Text>
            </Group>
          </Stack>

          <Image
            src={shipmentLogo}
            alt="Shipment Logo"
            width={110}
            height={110}
            fit="contain"
            style={{
              position: "absolute",
              right: "-10rem",
              bottom: "0rem",
              zIndex: 1,
            }}
          />
        </MantineBox>
      </Paper>
    </Group>
  );
}
