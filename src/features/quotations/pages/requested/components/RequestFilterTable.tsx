import { useMemo, useState } from "react";
import {
  Button,
  Divider,
  Grid,
  Group,
  Select,
  Text,
  TextInput,
  Input,
} from "@mantine/core";
import {
  ChevronRight,
  CalendarMonth,
  Search,
} from "@nine-thirty-five/material-symbols-react/rounded";
import type { RequestedQuotationListItem } from "@/features/quotations/types/quotations.types";

type RequestedQuotationRow = RequestedQuotationListItem;

interface RequestFilterTableProps {
  quotations: RequestedQuotationRow[];
  clientSearchValue: string;
  onClientSearchChange: (value: string) => void;
  onClientSearch: (value: string) => void;
  asSearchValue: string;
  onAsSearchChange: (value: string) => void;
  onAsSearch: (value: string) => void;
  perPage: number;
  setPerPage?: (value: number) => void;
  searchPlaceholder?: string;
  total?: number;
}

function getStatusLabel(row: RequestedQuotationRow) {
  return row.assignment_status === "AVAILABLE"
    ? "Accept"
    : row.assignment_status === "ASSIGNED"
      ? "Accepted"
      : "Reassignment Requested";
}

export function RequestFilterTable({
  quotations,
  clientSearchValue,
  onClientSearchChange,
  onClientSearch,
  asSearchValue,
  onAsSearchChange,
  onAsSearch,
  perPage,
  setPerPage,
  total = 10,
}: RequestFilterTableProps) {
  const [dateFilter, setDateFilter] = useState("");
  const [serviceFilter, setServiceFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  //for drop down ahow entries
  const entryOptions = useMemo(() => {
    if (total <= 0) return ["10"];

    const options = new Set<number>();
    const increment = 10;

    // Add increments of 10
    for (let i = increment; i < total; i += increment) {
      options.add(i);
    }

    // Always add the total at the end
    options.add(total);

    return Array.from(options)
      .sort((a, b) => a - b)
      .map(String);
  }, [total]);

  const serviceOptions = useMemo(() => {
    const values = new Set<string>();

    quotations.forEach((row) => {
      if (row.service) {
        values.add(row.service);
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
      <Grid gutter="xs" mb="sm" align="end">
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Input
            w="100%"
            size="sm"
            rightSectionWidth={45}
            placeholder={"SEARCH CLIENT OR REF NO."}
            value={clientSearchValue}
            onChange={(event) => onClientSearchChange(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                onClientSearch(clientSearchValue);
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
                onClick={() => onClientSearch(clientSearchValue)}
              >
                <Search width={24} height={24} fill="white" />
              </Button>
            }
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 2 }}>
          <TextInput
            w="100%"
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
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 2 }}>
          <Select
            w="100%"
            size="sm"
            placeholder="ALL SERVICES"
            data={serviceOptions}
            value={serviceFilter}
            onChange={setServiceFilter}
            rightSection={<ChevronRight width={16} />}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 2 }}>
          <Select
            w="100%"
            size="sm"
            placeholder="SELECT STATUS"
            data={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            rightSection={<ChevronRight width={16} />}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 2 }}>
          <Input
            w="100%"
            size="sm"
            rightSectionWidth={45}
            placeholder={"SEARCH AS"}
            value={asSearchValue}
            onChange={(event) => onAsSearchChange(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                onAsSearch(asSearchValue);
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
                onClick={() => onAsSearch(asSearchValue)}
              >
                <Search width={24} height={24} fill="white" />
              </Button>
            }
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 1 }}>
          <Button
            type="button"
            h={36}
            w="100%"
            px="sm"
            radius="sm"
            color="#4f657d"
            onClick={() => {
              setDateFilter("");
              setServiceFilter(null);
              setStatusFilter(null);
              onClientSearchChange("");
              onClientSearch("");
              onAsSearchChange("");
              onAsSearch("");
            }}
          >
            RESET
          </Button>
        </Grid.Col>
      </Grid>

      <Divider color="#e5e8ed" mb="xs" />

      <Group gap="xs" align="center">
        <Text c="#7a808a" fz="0.9rem">
          Show
        </Text>
        <Select
          w={70}
          size="xs"
          data={entryOptions}
          value={String(perPage)}
          onChange={(value) => {
            if (value) {
              setPerPage?.(Number(value));
            }
          }}
        />
        <Text c="#7a808a" fz="0.9rem">
          entries
        </Text>
      </Group>
    </>
  );
}
