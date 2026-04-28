import { useState } from "react";
import { Box, Stack } from "@mantine/core";
import { useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { PageCard } from "@/components/PageCard";

import {
  fetchQuotation,
  fetchRequestedQuotations,
  acceptQuotation,
  reassignQuotationEnums,
  reassignQuotationSpecificDetails,
} from "@/features/quotations/api/quotations.api";

import { quotationQueryKeys } from "@/features/quotations/api/quotationQueryKeys";
import { useQuotationTableSearch } from "@/features/quotations/hooks/useQuotationTableSearch";
import { quotationRoutes } from "@/features/quotations/utils/quotationRoutes";
import type { RequestedQuotationListItem } from "@/features/quotations/types/quotations.types";

import { requestedQueryKeys } from "./utils/requestedQueryKeys";

import { RequestFilterClient } from "./components/RequestFilterClient";
import { RequestFilterTable } from "./components/RequestFilterTable";
import { RequestTable } from "./components/RequestTable";
import ReassignModal from "./components/ReassignModal";
import AcceptModal from "./components/AcceptModal";

export function QuotationsRequested() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedQuotation, setSelectedQuotation] =
    useState<RequestedQuotationListItem | null>(null);

  const [acceptModalOpen, setAcceptModalOpen] = useState(false);
  const [reassignModalOpen, setReassignModalOpen] = useState(false);

  const [reassignStatus, setReassignStatus] = useState<string>("");
  const [reassignASId, setReassignASId] = useState<number | null>(null);

  const [jobFilter, setJobFilter] = useState<"all" | "my-items">("all");

  const [clientFilter, setClientFilter] = useState<"ALL" | "NEW" | "OLD">(
    "ALL",
  );

  const [serviceFilter, setServiceFilter] = useState<
    "LOGISTICS" | "REGULATORY" | "ALL"
  >("ALL");

  const [statusFilter, setStatusFilter] = useState<
    "AVAILABLE" | "ASSIGNED" | "REASSIGNMENT REQUESTED" | "ALL"
  >("ALL");

  const [dateFilter, setDateFilter] = useState("");

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
      serviceFilter,
      statusFilter,
      dateFilter,
      perPage,
      jobFilter,
    }),
    queryFn: () =>
      fetchRequestedQuotations({
        "filter[assignment_status]":
          statusFilter === "ALL" ? undefined : statusFilter,
        "filter[service]": serviceFilter === "ALL" ? undefined : serviceFilter,
        "filter[created_at]": dateFilter || undefined,
        search: searchQuery || undefined,
        as_search: secondarySearchQuery || undefined,
        client_type: clientFilter === "ALL" ? undefined : clientFilter,
        perPage,
      }),
  });

  const acceptQuotationMutation = useMutation({
    mutationFn: (id: number | string) => acceptQuotation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: requestedQueryKeys.requestedRoot(),
      });
      setAcceptModalOpen(false);
      setSelectedQuotation(null);
    },
    onError: (error) => {
      console.error("Error accepting quotation:", error);
    },
  });

  const { data: reassignEnumsData } = useQuery({
    queryKey: requestedQueryKeys.requestedRoot(),
    queryFn: () => reassignQuotationEnums("fetch", "fetch", ""),
  });

  const reassignPersonels =
    reassignEnumsData?.account_specialists.concat(
      reassignEnumsData?.operations || [],
    ) || [];

  const { data: reassignSpecificDetails } = useQuery({
    queryKey: [
      "reassignment-details",
      selectedQuotation?.reassignment_request_id,
    ],
    queryFn: () =>
      reassignQuotationSpecificDetails(
        selectedQuotation?.reassignment_request_id || null,
      ),
    enabled: !!selectedQuotation?.reassignment_request_id,
  });

  const handleAcceptConfirm = () => {
    if (!selectedQuotation) {
      return;
    }

    acceptQuotationMutation.mutate(selectedQuotation.id);
  };

  console.log("khate", reassignSpecificDetails);

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
                quotations={
                  jobFilter === "all"
                    ? data?.quotations || []
                    : data?.my_quotations || []
                }
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
                dateFilter={dateFilter}
                setDateFilter={setDateFilter}
                total={data?.counts.all_quotations}
              />

              <RequestTable
                rows={
                  jobFilter === "all"
                    ? data?.quotations || []
                    : data?.my_quotations || []
                }
                isLoading={isLoading || isFetching}
                showingCount={data?.pagination.count}
                total={data?.counts.all_quotations}
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

      <ReassignModal
        reassignModalOpen={reassignModalOpen}
        setReassignModalOpen={setReassignModalOpen}
        selectedQuotation={selectedQuotation}
        reassignPersonels={reassignPersonels}
        reassignSpecificDetails={reassignSpecificDetails}
        reassignStatus={reassignStatus}
        setReassignStatus={setReassignStatus}
        reassignASId={reassignASId}
        setReassignASId={setReassignASId}

        // onSuccess={() => {
        //   queryClient.invalidateQueries({
        //     queryKey: requestedQueryKeys.requestedRoot(),
        //   });
        //   setReassignModalOpen(false);
        //   setSelectedQuotation(null);
        // }}
      />

      <AcceptModal
        acceptModalOpen={acceptModalOpen}
        setAcceptModalOpen={setAcceptModalOpen}
        onConfirm={handleAcceptConfirm}
        isSubmitting={acceptQuotationMutation.isPending}
      />
    </>
  );
}
