import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { PageCard } from "@/components/PageCard";
import { AppTable, type AppTableColumn } from "@/components/AppTable";
import {
  NoteAdd,
  Delete,
} from "@nine-thirty-five/material-symbols-react/rounded";
import { fetchQuotations } from "../services/quotations.service";
import { userService } from "@/services/user.service";
import {
  QUOTATION_STATUS,
  type QuotationListItem,
} from "../types/quotations.types";

export function QuotationsClient() {
  const { clientId } = useParams<{
    clientId: string;
  }>();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [perPage, setPerPage] = useState(10);

  // ── Fetch this client's quotations ──
  const { data, isLoading } = useQuery({
    queryKey: [
      "quotations",
      QUOTATION_STATUS.REQUESTED,
      clientId,
      searchQuery,
      perPage,
    ],
    queryFn: () =>
      fetchQuotations({
        status: QUOTATION_STATUS.REQUESTED,
        clientId: Number(clientId),
        search: searchQuery || undefined,
        perPage,
      }),
    enabled: !!clientId,
  });

  // ── Fetch account specialists for the person-in-charge dropdown ──
  const { data: specialistsResponse } = useQuery({
    queryKey: ["users", "account-specialists"],
    queryFn: () => userService.getAll(),
  });

  const specialistOptions = (specialistsResponse?.data ?? []).map((name) => ({
    value: name,
    label: name,
  }));

  const quotations = data?.quotations[0]?.quotations ?? [];
  const total = data?.pagination.total ?? 0;
  const count = data?.pagination.count ?? 0;
  const clientDisplayName = data?.quotations[0]?.name ?? "";

  const COLUMNS: AppTableColumn<QuotationListItem>[] = [
    {
      key: "date",
      label: "DATE",
      width: "20%",
      render: (row) => row.date,
    },
    {
      key: "commodity",
      label: "COMMODITY",
      width: "40%",
      render: (row) => row.commodity,
    },
    {
      key: "person_in_charge",
      label: "PERSON IN CHARGE",
      width: "40%",
      type: "select",
      selectOptions: specialistOptions,
      selectValue: (row) => row.person_in_charge ?? "",
      onSelectChange: (_row, _value) => {
        // TODO: wire up assign specialist mutation
      },
    },
  ];

  return (
    <PageCard title={clientDisplayName} subtext="List of request quotation">
      <AppTable
        columns={COLUMNS}
        data={isLoading ? [] : quotations}
        rowKey={(row) => row.id}
        withEntryControls
        perPage={perPage}
        onPerPageChange={setPerPage}
        total={total}
        showingCount={count}
        searchPlaceholder="SEARCH SHIPMENT DETAILS"
        searchValue={search}
        onSearchChange={setSearch}
        onSearch={setSearchQuery}
        actions={[
          {
            label: "Make Quotation",
            icon: <NoteAdd width={16} height={16} />,
            onClick: (row) => navigate(`/quotations/${row.id}/make`),
          },
          {
            label: "Discard",
            icon: <Delete width={16} height={16} />,
            color: "red",
            onClick: (row) => {
              // TODO: wire up discard mutation
            },
          },
        ]}
      />
    </PageCard>
  );
}
