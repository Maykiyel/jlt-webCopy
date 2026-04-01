import { Card, Group, Table, Text, Title } from "@mantine/core";
import type { ClientRow } from "../types/dashboard";
import classes from "../modules/AccountSpecialistDashboard.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ClientsTableProps {
  clients: ClientRow[];
  totalCount: number;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ClientsTable({
  clients,
  totalCount,
}: ClientsTableProps) {
  return (
    <Card radius={"sm"} padding={0} withBorder={false} shadow="sm">
      <Group
        justify="space-between"
        px={"sm"}
        py={"xs"}
        className={classes.tableHeader}
      >
        <Title order={5} fw={600}>
          CLIENTS
        </Title>
        <Text fw={600}>{totalCount}</Text>
      </Group>

      <Table.ScrollContainer
        minWidth={500}
        h="16.5rem"
        style={{ overflowY: "auto" }}
      >
        <Table highlightOnHover>
          <Table.Thead>
            <Table.Tr className={classes.tableHeadRow}>
              <Table.Th w={"15%"}>
                <Text size="xs" fw={500} c="white">
                  ID NO.
                </Text>
              </Table.Th>
              <Table.Th w={"65%"}>
                <Text size="xs" fw={500} c="white">
                  FULL NAME
                </Text>
              </Table.Th>
              <Table.Th w={"20%"}>
                <Text size="xs" fw={500} c="white">
                  TOTAL NO. OF SHIPMENT
                </Text>
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {clients.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={3}>
                  <Text c="dimmed" ta="center" py="xl" size="sm">
                    No clients found
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              clients.map((client, i) => (
                <Table.Tr key={client.id ?? i}>
                  <Table.Td w={"15%"}>
                    <Text size="sm">{client.id}</Text>
                  </Table.Td>
                  <Table.Td w={"65%"}>
                    <Text size="sm">{client.full_name}</Text>
                  </Table.Td>
                  <Table.Td w={"20%"}>
                    <Text size="sm">{client.total_shipment}</Text>
                  </Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Card>
  );
}
