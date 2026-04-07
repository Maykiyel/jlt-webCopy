import { useMemo } from "react";
import { useNavigate } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Text } from "@mantine/core";
import { PageCard } from "@/components/PageCard";
import { AppTable } from "@/components/AppTable";
import {
  fetchQuotations,
  updateQuotationAssignee,
  fetchQuotation,
} from "@/features/quotations/api/quotations.api";
import { userService } from "@/services/user.service";
import { QUOTATION_STATUS } from "../../types/quotations.types";
import { useQuotationClientColumns } from "./hooks/useQuotationClientColumns";
import { useQuotationClientActions } from "./hooks/useQuotationClientActions";
import { useQuotationRouteParams } from "@/features/quotations/hooks/useQuotationRouteParams";
import { useQuotationTableSearch } from "@/features/quotations/hooks/useQuotationTableSearch";
import { requestedQueryKeys } from "./utils/requestedQueryKeys";
import { quotationRoutes } from "@/features/quotations/utils/quotationRoutes";
import { useAuthStore } from "@/stores/authStore";
import { isLeadAccountSpecialist } from "@/lib/mappers/user.mapper";

export function QuotationsClient() {
  const routeParams = useQuotationRouteParams(["tab", "clientId"] as const);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const isLeadAS = !!user && isLeadAccountSpecialist(user);
  const {
    search,
    searchQuery,
    perPage,
    setPerPage,
    handleSearch,
    handleSearchChange,
  } = useQuotationTableSearch();

  const { data, isLoading } = useQuery({
    queryKey: requestedQueryKeys.requestedClientList({
      clientId: routeParams?.clientId,
      searchQuery,
      perPage,
    }),
    queryFn: () => {
      if (!routeParams) {
        throw new Error("Missing required route parameters.");
      }

      return fetchQuotations({
        status: QUOTATION_STATUS.REQUESTED,
        clientId: Number(routeParams.clientId),
        search: searchQuery || undefined,
        perPage,
      });
    },
    enabled: Boolean(routeParams),
  });

  const { data: specialistsResponse } = useQuery({
    queryKey: requestedQueryKeys.accountSpecialists(),
    queryFn: () => userService.getAccountSpecialists(),
    enabled: isLeadAS,
  });

  const specialistOptions = useMemo(
    () =>
      (specialistsResponse?.data ?? []).map((specialist) => ({
        value: String(specialist.id),
        label: specialist.full_name,
      })),
    [specialistsResponse?.data],
  );

  const specialistIdByName = useMemo(
    () =>
      new Map(
        (specialistsResponse?.data ?? []).map((specialist) => [
          specialist.full_name,
          String(specialist.id),
        ]),
      ),
    [specialistsResponse?.data],
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
        queryKey: requestedQueryKeys.requestedRoot(),
      });
    },
  });

  const prefetchQuotationDetails = (quotationId: string) => {
    void queryClient.prefetchQuery({
      queryKey: requestedQueryKeys.quotationDetails(quotationId),
      queryFn: () => fetchQuotation(quotationId),
      staleTime: 30_000,
    });
  };

  const clientGroup = data?.quotations[0];
  const quotations = clientGroup?.quotations ?? [];
  const total = data?.pagination.total ?? 0;
  const count = data?.pagination.count ?? 0;
  const clientDisplayName = clientGroup?.name ?? "";

  const columns = useQuotationClientColumns({
    isLeadAS,
    specialistOptions,
    specialistIdByName,
    onReassign: (quotationId, asId) => {
      reassignMutation.mutate({ quotationId, asId });
    },
  });

  const actions = useQuotationClientActions({
    onMakeQuotation: (row) => {
      if (!routeParams) return;
      prefetchQuotationDetails(row.id);
      navigate(
        quotationRoutes.details({
          tab: routeParams.tab,
          clientId: routeParams.clientId,
          quotationId: row.id,
        }),
      );
    },
    onDiscard: () => {
      // TODO: wire up discard mutation
    },
  });

  if (!routeParams) {
    return (
      <PageCard title="List of request quotation">
        <Text size="0.8rem" c="dimmed">
          Invalid route parameters.
        </Text>
      </PageCard>
    );
  }

  return (
    <PageCard title={clientDisplayName} subtext="List of request quotation">
      <AppTable
        columns={columns}
        data={isLoading ? [] : quotations}
        rowKey={(row) => row.id}
        onRowHover={(row) => prefetchQuotationDetails(row.id)}
        onRowClick={(row) => {
          prefetchQuotationDetails(row.id);
          navigate(
            quotationRoutes.details({
              tab: routeParams.tab,
              clientId: routeParams.clientId,
              quotationId: row.id,
            }),
          );
        }}
        withEntryControls
        perPage={perPage}
        onPerPageChange={setPerPage}
        total={total}
        showingCount={count}
        searchPlaceholder="SEARCH QUOTATION"
        searchValue={search}
        onSearchChange={handleSearchChange}
        onSearch={handleSearch}
        actions={actions}
      />
    </PageCard>
  );
}
