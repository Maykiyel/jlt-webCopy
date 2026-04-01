import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PageCard } from "@/components/PageCard";
import { AppTable, type AppTableColumn } from "@/components/AppTable";
import {
  NoteAdd,
  Delete,
} from "@nine-thirty-five/material-symbols-react/rounded";
import {
  fetchQuotations,
  updateQuotationAssignee,
} from "../../services/quotations.service";
import { userService } from "@/services/user.service";
import {
  QUOTATION_STATUS,
  type QuotationListItem,
} from "../../types/quotations.types";
import { useAuthStore } from "@/stores/authStore";
import { isLeadAccountSpecialist } from "@/lib/mappers/user.mapper";

export function QuotationsClient() {
  const { tab, clientId } = useParams<{ tab: string; clientId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const isLeadAS = !!user && isLeadAccountSpecialist(user);

  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [perPage, setPerPage] = useState(10);

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

  const { data: specialistsResponse } = useQuery({
    queryKey: ["users", "account-specialists"],
    queryFn: () => userService.getAccountSpecialists(),
    enabled: isLeadAS,
  });

  const specialistOptions = (specialistsResponse?.data ?? []).map(
    (specialist) => ({
      value: String(specialist.id),
      label: specialist.full_name,
    }),
  );

  const specialistIdByName = new Map(
    (specialistsResponse?.data ?? []).map((specialist) => [
      specialist.full_name,
      String(specialist.id),
    ]),
  );

  const reassignMutation = useMutation({
    mutationFn: ({
      quotationId,
      asId,
    }: {
      quotationId: string;
      asId: number;
    }) => updateQuotationAssignee(quotationId, asId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["quotations", QUOTATION_STATUS.REQUESTED],
      });
    },
  });

  const clientGroup = data?.quotations[0];
  const quotations = clientGroup?.quotations ?? [];
  const total = data?.pagination.total ?? 0;
  const count = data?.pagination.count ?? 0;
  const clientDisplayName = clientGroup?.name ?? "";

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
      ...(isLeadAS
        ? {
            type: "select" as const,
            selectOptions: specialistOptions,
            selectValue: (row: QuotationListItem) =>
              specialistIdByName.get(row.person_in_charge ?? "") ?? "",
            onSelectChange: (row: QuotationListItem, value: string) => {
              const asId = Number(value);
              if (!Number.isFinite(asId)) return;

              const currentAsId = Number(
                specialistIdByName.get(row.person_in_charge ?? "") ?? NaN,
              );

              if (currentAsId === asId) return;

              reassignMutation.mutate({
                quotationId: row.id,
                asId,
              });
            },
          }
        : {
            render: (row: QuotationListItem) => row.person_in_charge ?? "—",
          }),
    },
  ];

  return (
    <PageCard title={clientDisplayName} subtext="List of request quotation">
      <AppTable
        columns={COLUMNS}
        data={isLoading ? [] : quotations}
        rowKey={(row) => row.id}
        onRowClick={(row) =>
          navigate(`/quotations/${tab}/client/${clientId}/${row.id}`)
        }
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
            onClick: (row) =>
              navigate(`/quotations/${tab}/client/${clientId}/${row.id}`),
          },
          {
            label: "Discard",
            icon: <Delete width={16} height={16} />,
            color: "red",
            onClick: () => {
              // TODO: wire up discard mutation
            },
          },
        ]}
      />
    </PageCard>
  );
}
