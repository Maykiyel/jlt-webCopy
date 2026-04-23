import { useState } from "react";
import { Button, Group, Modal, Text } from "@mantine/core";
import { useNavigate } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PageCard } from "@/components/PageCard";
import AppTable2 from "@/components/AppTable2";
import {
  fetchQuotation,
  fetchRequestedQuotations,
} from "@/features/quotations/api/quotations.api";
import { quotationQueryKeys } from "@/features/quotations/api/quotationQueryKeys";
import { useQuotationTableSearch } from "@/features/quotations/hooks/useQuotationTableSearch";
import { quotationRoutes } from "@/features/quotations/utils/quotationRoutes";
import { requestedQueryKeys } from "./utils/requestedQueryKeys";
import type { RequestedQuotationListItem } from "@/features/quotations/types/quotations.types";

export function QuotationsRequested() {
  const [selectedQuotation, setSelectedQuotation] =
    useState<RequestedQuotationListItem | null>(null);
  const [acceptModalOpen, setAcceptModalOpen] = useState(false);
  const [reassignModalOpen, setReassignModalOpen] = useState(false);

  const [jobFilter, setJobFilter] = useState<"all" | "my-jobs" | "my-quotes">("all");

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

  const { data, isLoading } = useQuery({
    queryKey: requestedQueryKeys.requestedList({ searchQuery, perPage }),
    queryFn: () =>
      fetchRequestedQuotations({
        search: searchQuery || undefined,
        perPage,
      }),
  });

  console.log("khate", data)

  const rows = jobFilter === "all"? data?.quotations || []: data?.my_quotations || [];
  const total = data?.pagination.total ?? 0;
  const count = data?.pagination.count ?? rows.length;

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
        <AppTable2
          quotations={rows}
          jobFilter={jobFilter}
          isLoading={isLoading}
          searchValue={search}
          onSearchChange={handleSearchChange}
          onSearch={handleSearch}
          perPage={perPage}
          onPerPageChange={setPerPage}
          showingCount={count}
          total={total}
          onAcceptClick={openAcceptModal}
          onReassignClick={openReassignModal}
          onRowClick={(row) => {
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
      </PageCard>

      <Modal
        opened={acceptModalOpen}
        onClose={() => setAcceptModalOpen(false)}
        title="Accept quotation request"
        centered
      >
        <Text size="sm" mb="md">
          Accept quotation <strong>{selectedQuotation?.reference_number ?? ""}</strong>
          {" "}for <strong>{selectedQuotation?.client_full_name ?? ""}</strong>?
        </Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={() => setAcceptModalOpen(false)}>
            Cancel
          </Button>
          <Button
            color="green"
            onClick={() => {
              // TODO: connect accept mutation here.
              setAcceptModalOpen(false);
            }}
          >
            Confirm Accept
          </Button>
        </Group>
      </Modal>

      <Modal
        opened={reassignModalOpen}
        onClose={() => setReassignModalOpen(false)}
        title="Reassignment request"
        centered
      >
        <Text size="sm" mb="md">
          Open reassignment flow for quotation <strong>{selectedQuotation?.reference_number ?? ""}</strong>?
        </Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={() => setReassignModalOpen(false)}>
            Cancel
          </Button>
          <Button
            color="indigo"
            onClick={() => {
              // TODO: connect reassignment mutation here.
              setReassignModalOpen(false);
            }}
          >
            Continue
          </Button>
        </Group>
      </Modal>
    </>
  );
}
