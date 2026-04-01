import {
  Table,
  Group,
  Text,
  Select,
  Menu,
  ActionIcon,
  Box,
} from "@mantine/core";
import {
  MoreVert,
  ChevronRight,
} from "@nine-thirty-five/material-symbols-react/rounded";
import { useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import type { ReactNode } from "react";
import type React from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AppTableColumn<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T, index: number) => ReactNode;
  width?: string;
  type?: "select";
  selectOptions?: { value: string; label: string }[] | string[];
  onSelectChange?: (row: T, value: string) => void;
  selectValue?: (row: T) => string;
}

export interface AppTableAction<T> {
  label: string;
  icon?: React.ReactNode;
  onClick: (row: T) => void;
  color?: string;
}

export interface AppTableProps<T> {
  columns: AppTableColumn<T>[];
  data: T[];
  rowKey?: (row: T) => string | number;
  actions?: AppTableAction<T>[];
  /** Enables the top bar (Show N entries + search) and the footer */
  withEntryControls?: boolean;
  perPage?: number;
  onPerPageChange?: (value: number) => void;
  total?: number;
  /** Explicit count for "Showing X out of Y" — use pagination.count from the API. Defaults to data.length if omitted. */
  showingCount?: number;
  /** Search bar placeholder — only shown when withEntryControls is true */
  searchPlaceholder?: string;
  /** Controlled search value */
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  /** Optional row click handler */
  onRowClick?: (row: T) => void;
}

const ENTRY_OPTIONS = ["5", "10", "25", "50", "100"];

// ─── Component ────────────────────────────────────────────────────────────────

export function AppTable<T>({
  columns,
  data,
  rowKey,
  actions,
  withEntryControls = false,
  perPage = 10,
  onPerPageChange,
  total,
  searchPlaceholder = "SEARCH",
  searchValue,
  onSearchChange,
  onSearch,
  showingCount: showingCountProp,
  onRowClick,
}: AppTableProps<T>) {
  const hasActions = Array.isArray(actions) && actions.length > 0;
  const showingCount = showingCountProp ?? data.length;
  const totalCount = total ?? data.length;

  // Internal search state for uncontrolled usage
  const [internalSearch, setInternalSearch] = useState("");
  const isSearchControlled = searchValue !== undefined;
  const currentSearch = isSearchControlled ? searchValue : internalSearch;

  const handleSearchChange = (val: string) => {
    if (!isSearchControlled) setInternalSearch(val);
    onSearchChange?.(val);
  };

  const renderCell = (col: AppTableColumn<T>, row: T, index: number) => {
    if (col.render) return col.render(row, index);

    const rawValue = String(
      (row as Record<string, unknown>)[String(col.key)] ?? "",
    );

    if (col.type === "select") {
      const currentValue = col.selectValue ? col.selectValue(row) : rawValue;
      return (
        <Select
          data={col.selectOptions ?? []}
          value={currentValue}
          onChange={(val) => val && col.onSelectChange?.(row, val)}
          allowDeselect={false}
          rightSection={<ChevronRight />}
          size="xs"
          styles={{
            root: {
              width: "9.375rem",
            },
            input: {
              fontSize: "0.75rem",
              border: 0,
              height: "1.8rem",
              minHeight: "1.8rem",
              cursor: "pointer",
            },
            dropdown: { fontSize: "0.75rem" },
            option: { fontSize: "0.75rem" },
          }}
          onClick={(e) => e.stopPropagation()}
        />
      );
    }

    return rawValue;
  };

  return (
    <Box>
      {/* ── Top bar: Show N entries (left) + Search (right) ── */}
      {withEntryControls && (
        <Group justify="space-between" align="center" mb="0.75rem">
          <Group gap="0.4rem" align="center">
            <Text size="0.8rem" c="dimmed">
              Show
            </Text>
            <Select
              data={ENTRY_OPTIONS}
              value={String(perPage)}
              onChange={(val) => val && onPerPageChange?.(Number(val))}
              size="xs"
              w="4rem"
              allowDeselect={false}
              styles={{
                input: {
                  textAlign: "center",
                  fontSize: "0.75rem",
                  height: "1.6rem",
                  minHeight: "1.6rem",
                  padding: "0 0.5rem",
                },
              }}
            />
            <Text size="0.8rem" c="dimmed">
              entries
            </Text>
          </Group>

          <SearchBar
            placeholder={searchPlaceholder}
            value={currentSearch}
            onChange={handleSearchChange}
            onSearch={onSearch}
          />
        </Group>
      )}

      {/* ── Table ── */}
      <Table
        withRowBorders={false}
        highlightOnHover
        styles={{
          table: { width: "100%", borderCollapse: "collapse" },
          thead: { backgroundColor: "#1e2235" },
          th: {
            color: "#ffffff",
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.04em",
            padding: "0.65rem 1rem",
            whiteSpace: "nowrap",
          },
          td: {
            fontSize: "0.75rem",
            padding: "0.65rem 1rem",
            color: "var(--mantine-color-dark-7)",
          },
          tr: {
            borderBottom: "1px solid var(--mantine-color-gray-2)",
          },
        }}
      >
        <Table.Thead>
          <Table.Tr>
            {columns.map((col) => (
              <Table.Th
                key={String(col.key)}
                style={col.width ? { width: col.width } : undefined}
              >
                {col.label}
              </Table.Th>
            ))}
            {hasActions && <Table.Th style={{ width: "3rem" }} />}
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {data.map((row, idx) => (
            <Table.Tr
              key={rowKey ? rowKey(row) : idx}
              onClick={() => onRowClick?.(row)}
              style={onRowClick ? { cursor: "pointer" } : undefined}
            >
              {columns.map((col) => (
                <Table.Td key={String(col.key)}>
                  <>{renderCell(col, row, idx)}</>
                </Table.Td>
              ))}
              {hasActions && (
                <Table.Td
                  style={{ textAlign: "right" }}
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <Menu shadow="md" width="10rem" position="left-start">
                    <Menu.Target>
                      <ActionIcon
                        variant="subtle"
                        color="dark"
                        size="sm"
                        onClick={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                      >
                        <MoreVert width={18} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      {actions!.map((action) => (
                        <Menu.Item
                          key={action.label}
                          color={action.color}
                          onClick={(e) => {
                            e.stopPropagation();
                            action.onClick(row);
                          }}
                          leftSection={action.icon}
                          styles={{ item: { fontSize: "0.75rem" } }}
                        >
                          {action.label}
                        </Menu.Item>
                      ))}
                    </Menu.Dropdown>
                  </Menu>
                </Table.Td>
              )}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      {/* ── Footer ── */}
      {withEntryControls && (
        <Text mt="0.75rem" size="0.75rem" c="dimmed">
          Showing {showingCount} out of {totalCount} entries
        </Text>
      )}
    </Box>
  );
}
