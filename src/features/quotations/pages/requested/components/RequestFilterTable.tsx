import { useMemo, useState } from "react";
import {
  ActionIcon,
  Button,
  Divider,
  Group,
  Select,
  Text,
  TextInput,
  Input
} from "@mantine/core";
import { ChevronRight, CalendarMonth, Search } from "@nine-thirty-five/material-symbols-react/rounded";
import type { RequestedQuotationListItem } from "@/features/quotations/types/quotations.types";

const entryOptions = ["10", "25", "50"];

type RequestedQuotationRow = RequestedQuotationListItem;

interface RequestFilterTableProps {
  quotations: RequestedQuotationRow[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearch: (value: string) => void;
  perPage: number;
  onPerPageChange: (value: number) => void;
  searchPlaceholder?: string;
}

function toTitleCase(value: string) {
  return value
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getStatusLabel(row: RequestedQuotationRow) {
  return toTitleCase(
    row.assignment_status === "AVAILABLE"
      ? "Accept"
      : row.assignment_status === "ASSIGNED"
        ? "Accepted"
        : "Reassignment Requested",
  );
}

export function RequestFilterTable({
  quotations,
  searchValue,
  onSearchChange,
  onSearch,
  perPage,
  onPerPageChange,
  searchPlaceholder = "SEARCH REFERENCE OR CLIENT",
}: RequestFilterTableProps) {
  const [dateFilter, setDateFilter] = useState("");
  const [serviceFilter, setServiceFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const serviceOptions = useMemo(() => {
    const values = new Set<string>();

    quotations.forEach((row) => {
      if (row.service) {
        values.add(toTitleCase(row.service));
      }
    });

    return Array.from(values).map((value) => ({ value, label: value }));
  }, [quotations]);

  const statusOptions = useMemo(() => {
    const values = new Set<string>();

    quotations.forEach((row) => {
      values.add(getStatusLabel(row));
    });

    return Array.from(values).map((value) => ({ value, label: value }));
  }, [quotations]);

  return (
    <>
      <Group gap="xs" wrap="wrap" mb="sm">
        <Input
          w={300}
          size="sm"
          rightSectionWidth={45}
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(event) => onSearchChange(event.currentTarget.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              onSearch(searchValue);
            }
          }}
          rightSection={
            <Button
              type="button"
              h={36}
              w={45}
              p={0}
              radius="sm"
              color="#4f657d"
              aria-label="Search"
              onClick={() => onSearch(searchValue)}
            >
              <Search width={24} height={24} fill="white" />
            </Button>
          }
        />

        <TextInput
          w={170}
          size="sm"
          rightSectionWidth={45}
          placeholder="REQ. DATE"
          value={dateFilter}
          onChange={(event) => setDateFilter(event.currentTarget.value)}
          rightSection={
            <Button
               type="button"
              h={36}
              w={45}
              p={0}
              radius="sm"
              color="#4f657d"
            >
              <CalendarMonth width={24} height={24} fill="white" />
            </Button>
          }
        />

        <Select
          w={185}
          size="sm"
          placeholder="ALL SERVICES"
          data={serviceOptions}
          value={serviceFilter}
          onChange={setServiceFilter}
          rightSection={<ChevronRight width={16} />}
        />

        <Select
          w={185}
          size="sm"
          placeholder="SELECT STATUS"
          data={statusOptions}
          value={statusFilter}
          onChange={setStatusFilter}
          rightSection={<ChevronRight width={16} />}
        />

        <Button
          type="button"
          h={36}
          px="md"
          radius="sm"
          color="#4f657d"
          onClick={() => {
            setDateFilter("");
            setServiceFilter(null);
            setStatusFilter(null);
            onSearchChange("");
            onSearch("");
          }}
        >
          RESET
        </Button>
      </Group>

      <Divider color="#e5e8ed" mb="xs" />

      <Group gap="xs" align="center">
        <Text c="#7a808a" fz="0.9rem">Show</Text>
        <Select
          w={70}
          size="xs"
          data={entryOptions}
          value={String(perPage)}
          onChange={(value) => {
            if (value) {
              onPerPageChange(Number(value));
            }
          }}
        />
        <Text c="#7a808a" fz="0.9rem">entries</Text>
      </Group>
    </>
  );
}
