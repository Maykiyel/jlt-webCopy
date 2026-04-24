import { ActionIcon, Group, Loader, Table, Text } from "@mantine/core";
import { Delete, Edit } from "@nine-thirty-five/material-symbols-react/rounded";
import type { ReactNode } from "react";

interface ConfigRowBase {
  id: number;
  label: string;
}

interface ConfigRowsTableProps<T extends ConfigRowBase> {
  rows: T[];
  emptyLabel: string;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  renderMeta?: (item: T) => ReactNode;
  isLoading?: boolean;
  isMutating?: boolean;
}

export function ConfigRowsTable<T extends ConfigRowBase>({
  rows,
  emptyLabel,
  onEdit,
  onDelete,
  renderMeta,
  isLoading = false,
  isMutating = false,
}: ConfigRowsTableProps<T>) {
  return (
    <Table withRowBorders withColumnBorders withTableBorder>
      <Table.Tbody>
        {isLoading && (
          <Table.Tr>
            <Table.Td colSpan={3}>
              <Group justify="center" py="sm">
                <Loader size="sm" />
                <Text c="dimmed" size="sm">
                  Loading...
                </Text>
              </Group>
            </Table.Td>
          </Table.Tr>
        )}
        {rows.map((item, index) => (
          <Table.Tr key={item.id}>
            <Table.Td w={56} ta="center">
              {String(index + 1).padStart(2, "0")}
            </Table.Td>
            <Table.Td>
              {item.label}
              {renderMeta?.(item)}
            </Table.Td>
            <Table.Td w={88}>
              <Group gap={8} justify="flex-end" wrap="nowrap">
                <ActionIcon
                  variant="subtle"
                  color="jltAccent.6"
                  onClick={() => onEdit(item)}
                  disabled={isMutating || isLoading}
                >
                  <Edit width={24} height={24} />
                </ActionIcon>
                <ActionIcon
                  variant="subtle"
                  color="red"
                  onClick={() => onDelete(item)}
                  disabled={isMutating || isLoading}
                >
                  <Delete width={24} height={24} />
                </ActionIcon>
              </Group>
            </Table.Td>
          </Table.Tr>
        ))}
        {!isLoading && rows.length === 0 && (
          <Table.Tr>
            <Table.Td colSpan={3}>
              <Text c="dimmed" size="sm">
                No {emptyLabel} configs yet.
              </Text>
            </Table.Td>
          </Table.Tr>
        )}
      </Table.Tbody>
    </Table>
  );
}
