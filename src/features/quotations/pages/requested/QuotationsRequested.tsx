import { useState } from "react";
import { Box, Stack } from "@mantine/core";
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

import { RequestFilterClient } from "./components/RequestFilterClient";
import { RequestFilterTable } from "./components/RequestFilterTable";
import { RequestTable } from "./components/requestTable";
import ReassignModal from "./components/ReassignModal";
import AcceptModal from "./components/AcceptModal";

export function QuotationsRequested() {
  const [selectedQuotation, setSelectedQuotation] =
    useState<RequestedQuotationListItem | null>(null);

  const [acceptModalOpen, setAcceptModalOpen] = useState(false);
  const [reassignModalOpen, setReassignModalOpen] = useState(false);

  const [jobFilter, setJobFilter] = useState<"all" | "my-items">("all");

  const [clientFilter, setClientFilter] = useState<"ALL" | "NEW" | "OLD">(
    "ALL",
  );

  const [serviceFilter, setServiceFilter] = useState<
    "LOGISTICS" | "REGULATORY" | null
  >(null);

  const [statusFilter, setStatusFilter] = useState<
    "AVAILABLE" | "REASSIGN REQUESTED" | null
  >(null);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    search,
    searchQuery,
    secondarySearch,
    secondarySearchQuery,
    perPage,
    setPerPage,
    handleSearch,
    handleSearchChange,
    handleSecondarySearch,
    handleSecondarySearchChange,
  } = useQuotationTableSearch();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: requestedQueryKeys.requestedList({
      searchQuery,
      asSearchQuery: secondarySearchQuery,
      clientFilter,
      perPage,
    }),
    queryFn: () =>
      fetchRequestedQuotations({
        "filter[assignment_status]": statusFilter || undefined,
        "filter[service]": serviceFilter || undefined,
        search: searchQuery || undefined,
        as_search: secondarySearchQuery || undefined,
        client_type: clientFilter === "ALL" ? undefined : clientFilter,
        perPage,
      }),
  });

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
    setReassignModalOpen(true);
  };

  const handleJobSwitchChange = (value: "all" | "my-items") => {
    setJobFilter(value);
  };

  return (
    <>
      <PageCard
        title="LIST OF NEW REQUEST"
        showJobSwitch
        jobSwitchValue={jobFilter}
        onJobSwitchChange={handleJobSwitchChange}
        jobSwitchSecondaryValue="my-items"
        jobSwitchSecondaryLabel="MY ITEMS"
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
                clientSearchValue={search}
                onClientSearchChange={handleSearchChange}
                onClientSearch={handleSearch}
                asSearchValue={secondarySearch}
                onAsSearchChange={handleSecondarySearchChange}
                onAsSearch={handleSecondarySearch}
                perPage={perPage}
                setPerPage={setPerPage}
                serviceFilter={serviceFilter}
                setServiceFilter={setServiceFilter}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                total={data?.counts.all_quotations}
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
