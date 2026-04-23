import { useState, useEffect } from "react";
import { Box, Button, Group, Modal, Stack, Text } from "@mantine/core";
import { useNavigate } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { PageCard } from "@/components/PageCard";
import {
  fetchQuotation,
  fetchRequestedQuotations,
} from "@/features/quotations/api/quotations.api";
import { quotationQueryKeys } from "@/features/quotations/api/quotationQueryKeys";
import { useQuotationTableSearch } from "@/features/quotations/hooks/useQuotationTableSearch";
import { quotationRoutes } from "@/features/quotations/utils/quotationRoutes";
import type { RequestedQuotationListItem } from "@/features/quotations/types/quotations.types";

import { requestedQueryKeys } from "./utils/requestedQueryKeys";

import { RequestFilterClient } from "./components/requestFilterClient";
import { RequestFilterTable } from "./components/requestFilterTable";
import { RequestTable } from "./components/requestTable";
import ReassignModal from "./components/ReassignModal";
import AcceptModal from "./components/AcceptModal";

export function QuotationsRequested() {
  const [selectedQuotation, setSelectedQuotation] =
    useState<RequestedQuotationListItem | null>(null);
  const [acceptModalOpen, setAcceptModalOpen] = useState(false);
  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [selectedReassignAsId, setSelectedReassignAsId] = useState<
    string | null
  >(null);

  const [jobFilter, setJobFilter] = useState<"all" | "my-jobs" | "my-quotes">(
    "all",
  );
  const [clientFilter, setClientFilter] = useState<"ALL" | "NEW" | "OLD">(
    "ALL",
  );

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    search,
    searchQuery,
    perPage,
    setPerPage,
    handleSearch,
    handleSearchChange,
  } = useQuotationTableSearch();

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: requestedQueryKeys.requestedList({ searchQuery, perPage }),
    queryFn: () =>
      fetchRequestedQuotations({
        search: searchQuery || undefined,
        client_type: clientFilter === "ALL" ? undefined : clientFilter,
        perPage,
      }),
  });

  useEffect(() => {
  void refetch();
}, [clientFilter, refetch])

  console.log("khate", data)

  const rows =
    jobFilter === "all" ? data?.quotations || [] : data?.my_quotations || [];
  const total = data?.pagination.total ?? 0;
  // assigning ops or client
  // const { data: specialistsResponse } = useQuery({
  //   queryKey: requestedQueryKeys.accountSpecialists(),
  //   queryFn: () => userService.getAccountSpecialists(),
  // });

  // const specialistOptions = (specialistsResponse?.data ?? []).map((specialist) => ({
  //   value: String(specialist.id),
  //   label: specialist.full_name,
  // }));

  const prefetchQuotationDetails = (quotationId: string) => {
    void queryClient.prefetchQuery({
      queryKey: quotationQueryKeys.quotationDetails(quotationId),
      queryFn: () => fetchQuotation(quotationId),
      staleTime: 30_000,
    });
  };

  const openAcceptModal = (row: RequestedQuotationListItem) => {
    setSelectedQuotation(row);
    setAcceptModalOpen(true);
  };

  const openReassignModal = (row: RequestedQuotationListItem) => {
    setSelectedQuotation(row);
    setSelectedReassignAsId(null);
    setReassignModalOpen(true);
  };

  return (
    <>
      <PageCard
        title="LIST OF NEW REQUEST"
        showJobSwitch
        jobSwitchValue={jobFilter}
        onJobSwitchChange={setJobFilter}
        jobSwitchSecondaryValue="my-quotes"
        jobSwitchSecondaryLabel="MY QUOTES"
      >
        <Stack gap="xs">

          <RequestFilterClient
            clientFilter={clientFilter}
            setClientFilter={setClientFilter}
            clientCounts={data?.counts}
          />

          <Box
            p="xs"
            style={{
              borderRadius: "0.75rem",
              border: "1px solid #e0e5eb",
            }}
          >
            <Box>
              <RequestFilterTable
                quotations={rows}
                searchValue={search}
                onSearchChange={handleSearchChange}
                onSearch={handleSearch}
                perPage={perPage}
                onPerPageChange={setPerPage}
              />

              <RequestTable
                rows={rows}
                isLoading={isLoading || isFetching}
                showingCount={data?.pagination.count}
                total={total}
                onAcceptClick={openAcceptModal}
                onReassignClick={openReassignModal}
                onRowClick={(row: RequestedQuotationListItem) => {
                  const quotationId = String(row.id);
                  prefetchQuotationDetails(quotationId);
                  navigate(
                    quotationRoutes.details({
                      tab: "requested",
                      quotationId,
                    }),
                  );
                }}
              />
            </Box>
          </Box>
        </Stack>
      </PageCard>

      {/* underconstruction */}
      <ReassignModal
        reassignModalOpen={reassignModalOpen}
        setReassignModalOpen={setReassignModalOpen}
        selectedQuotation={selectedQuotation}
      />

      <AcceptModal
        acceptModalOpen={acceptModalOpen}
        setAcceptModalOpen={setAcceptModalOpen}
      />
    </>
  );
}
