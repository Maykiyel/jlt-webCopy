import { Button, Box, Select, Stack, Table, TextInput } from "@mantine/core";
import {
  MoreVert,
  Search,
} from "@nine-thirty-five/material-symbols-react/rounded";
import {
  ArrowRightAlt,
  CheckCircle,
  Autorenew,
  PanToolAlt
} from "@nine-thirty-five/material-symbols-react/outlined";
import type { RequestedQuotationListItem } from "@/features/quotations/types/quotations.types";
import classes from "./AppTable2.module.css";

const entryOptions = ["10", "25", "50"];

type RequestedQuotationRow = RequestedQuotationListItem;

const tableHead = ["REQUEST", "DETAILS", "STATUS", ""] as const;

export interface AppTable2Props {
  quotations: RequestedQuotationRow[];
  isLoading?: boolean;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearch: (value: string) => void;
  perPage: number;
  onPerPageChange: (value: number) => void;
  showingCount?: number;
  total?: number;
  onRowClick?: (row: RequestedQuotationRow) => void;
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

function getServiceLabel(service: string) {
  return toTitleCase(service);
}

export default function AppTable2({
  quotations,
  isLoading = false,
  searchValue,
  onSearchChange,
  onSearch,
  perPage,
  onPerPageChange,
  showingCount,
  total,
  onRowClick,
  searchPlaceholder = "SEARCH REFERENCE OR CLIENT",
}: AppTable2Props) {
  const currentShowingCount = showingCount ?? quotations.length;
  const currentTotal = total ?? quotations.length;

  return (
    <Stack gap="md">
      <Box className={classes.filtersPanel}>
        <div className={classes.filters}>
          <TextInput
            className={classes.searchInput}
            size="sm"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(event) => onSearchChange(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                onSearch(searchValue);
              }
            }}
          />

          <Button
            type="button"
            className={classes.searchButton}
            aria-label="Search"
            onClick={() => onSearch(searchValue)}
          >
            <Search width={16} />
          </Button>

          <Button
            type="button"
            className={classes.resetButton}
            onClick={() => {
              onSearchChange("");
              onSearch("");
            }}
          >
            RESET
          </Button>
        </div>

        <div className={classes.entryRow}>
          <span>Show</span>
          <Select
            className={classes.entrySelect}
            size="xs"
            data={entryOptions}
            value={String(perPage)}
            onChange={(value) => {
              if (value) {
                onPerPageChange(Number(value));
              }
            }}
          />
          <span>entries</span>
        </div>
      </Box>

      <div className={classes.tableShell}>
        <Table withTableBorder withColumnBorders={false}>
          <Table.Thead style={{ backgroundColor: "#17324f", color: "white" }}>
            <Table.Tr>
              {tableHead.map((heading, index) => (
                <Table.Th key={`${heading}-${index}`}>{heading}</Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {isLoading ? (
              <Table.Tr>
                <Table.Td colSpan={4} className={classes.subText}>
                  Loading quotations...
                </Table.Td>
              </Table.Tr>
            ) : quotations.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={4} className={classes.subText}>
                  No quotations found.
                </Table.Td>
              </Table.Tr>
            ) : (
              quotations.map((row) => (
                <Table.Tr
                  key={String(row.id)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  style={onRowClick ? { cursor: "pointer" } : undefined}
                >
                  <Table.Td className={classes.cellRequest}>
                    <div className={classes.requestCode}>
                      {row.reference_number}
                    </div>
                    <div className={classes.subText}>
                      {row.client_full_name}
                    </div>
                    <div className={classes.subText}>Req. Date: {row.date}</div>
                  </Table.Td>

                  <Table.Td className={classes.cellDetails}>
                    <div className={classes.detailTitle}>
                      {getServiceLabel(row.service)}
                    </div>
                    {row.logistics_service ? (
                      <>
                        <div className={classes.subText}>
                          {row.logistics_service.commodity}
                        </div>
                        <div className={classes.subText}>
                          {toTitleCase(row.logistics_service.service_type)} ·{" "}
                          {toTitleCase(row.logistics_service.transport_mode)}
                        </div>
                        <div className={classes.routeLine}>
                          <span className={classes.subText}>
                            {row.logistics_service.origin}
                          </span>
                          <ArrowRightAlt width={15} />
                          <span className={classes.subText}>
                            {row.logistics_service.destination}
                          </span>
                        </div>
                      </>
                    ) : row.regulatory_service ? (
                      <>
                        <div className={classes.subText}>Application Type</div>
                        <div className={classes.detailTitle}>
                          {toTitleCase(row.regulatory_service.application_type)}
                        </div>
                      </>
                    ) : (
                      <div className={classes.subText}>—</div>
                    )}
                  </Table.Td>

                  <Table.Td className={classes.cellStatus}>
                    <Button
                      color={
                        row.assignment_status === "AVAILABLE"
                          ? "#007406"
                          : row.assignment_status === "ASSIGNED"
                            ? "#3B82F6"
                            : "#1D274E"
                      }
                      leftSection={row.assignment_status === "AVAILABLE"
                          ? <PanToolAlt width={20} />
                          : row.assignment_status === "ASSIGNED"
                            ? <CheckCircle width={20} />
                            : <Autorenew width={20} />}
                    >
                      {getStatusLabel(row)}
                    </Button>
                    {row.account_specialist && (
                      <div className={classes.statusOwner}>
                        {row.account_specialist}
                      </div>
                    )}
                    {row.assignment_status === "AVAILABLE" && (
                      <div
                        className={`${classes.statusOwner} ${classes.statusNote}`}
                      >
                        {toTitleCase(row.assignment_status)}
                      </div>
                    )}
                    {row.assigned_at && (
                      <div className={classes.statusOwner}>
                        Assigned at: {row.assigned_at}
                      </div>
                    )}
                    {row.prepared_by && (
                      <div className={classes.statusOwner}>
                        Prepared by: {row.prepared_by}
                      </div>
                    )}
                  </Table.Td>

                  <Table.Td className={classes.cellActions}>
                    <MoreVert width={16} />
                  </Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </div>

      <div className={classes.footer}>
        Showing {currentShowingCount} out of {currentTotal} entries
      </div>
    </Stack>
  );
}
