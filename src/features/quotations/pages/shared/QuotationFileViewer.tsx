import { ActionIcon, Box, Center, Group, Text } from "@mantine/core";
import {
  ArrowBack,
  Download,
  EditNote,
  Print,
} from "@nine-thirty-five/material-symbols-react/outlined";
import { useLocation, useNavigate, useParams } from "react-router";
import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import jltLogoUrl from "@/assets/logos/word-dark.png";
import { QuotationPreview } from "@/features/quotations/components/QuotationPreview";
import { useQuotationRouteParams } from "@/features/quotations/pages/hooks/useQuotationRouteParams";
import { quotationQueryKeys } from "@/features/quotations/pages/utils/quotationQueryKeys";
import { quotationRoutes } from "@/features/quotations/pages/utils/quotationRoutes";
import { usePDFActions } from "@/features/quotations/pdf/usePDFActions";
import { fetchQuotationFiles } from "@/features/quotations/services/quotations.service";
import type { QuotationViewerState } from "@/features/quotations/types/compose.types";
import classes from "./QuotationFileViewer.module.css";

export function QuotationFileViewer() {
  const location = useLocation();
  const navigate = useNavigate();
  const routeParams = useQuotationRouteParams(["tab", "quotationId"] as const);
  const params = useParams<{ clientId?: string }>();
  const clientId = params.clientId;
  const canEdit =
    routeParams?.tab === "requested" &&
    Boolean(clientId) &&
    Boolean(location.state);
  const printRef = useRef<HTMLDivElement | null>(null);
  const state = location.state as QuotationViewerState | null;
  const {
    handleDownload: handlePreviewDownload,
    handlePrint: handlePreviewPrint,
  } = usePDFActions(state, jltLogoUrl);

  const { data: proposalFiles = [], isLoading: isProposalFileLoading } =
    useQuery({
      queryKey: quotationQueryKeys.quotationFiles(
        routeParams?.quotationId,
        "PROPOSAL",
      ),
      queryFn: () => {
        if (!routeParams) {
          throw new Error("Missing required route parameters.");
        }

        return fetchQuotationFiles(routeParams.quotationId, "PROPOSAL");
      },
      enabled: Boolean(routeParams),
    });

  const proposalFile = proposalFiles[0] ?? null;

  function handleDownload() {
    if (state) {
      void handlePreviewDownload();
      return;
    }

    if (!proposalFile) {
      return;
    }

    const link = document.createElement("a");
    link.href = proposalFile.file_url;
    link.download = proposalFile.file_name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function handlePrint() {
    if (state) {
      void handlePreviewPrint();
      return;
    }

    if (!proposalFile) {
      return;
    }

    const win = window.open(
      proposalFile.file_url,
      "_blank",
      "noopener,noreferrer",
    );
    if (!win) {
      return;
    }

    win.onload = () => win.print();
  }

  if (!state && isProposalFileLoading) {
    return (
      <Center h="100%">
        <Text c="dimmed">Loading quotation file...</Text>
      </Center>
    );
  }

  if (!state && !proposalFile) {
    return (
      <Center h="100%">
        <Text c="dimmed">No proposal file found for this quotation.</Text>
      </Center>
    );
  }

  const viewerState = state;

  function handleEdit() {
    if (!routeParams || !clientId || !canEdit || !viewerState) {
      navigate(-1);
      return;
    }

    navigate(
      quotationRoutes.composeTemplate({
        tab: routeParams.tab,
        clientId,
        quotationId: routeParams.quotationId,
        templateId: viewerState.template.id,
      }),
      {
        state: {
          editMode: true,
          quotationDetails: viewerState.quotationDetails,
          billingDetails: viewerState.billingDetails,
          terms: viewerState.terms,
          signatory: viewerState.signatory,
        },
      },
    );
  }

  return (
    <>
      <Box className={classes.topBar}>
        <ActionIcon variant="subtle" onClick={() => navigate(-1)}>
          <ArrowBack width="1.25rem" height="1.25rem" />
        </ActionIcon>

        <Group gap="sm">
          <ActionIcon
            variant="subtle"
            onClick={handleDownload}
            disabled={!viewerState && !proposalFile}
            aria-label="Download"
          >
            <Download width="1.25rem" height="1.25rem" />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            onClick={handlePrint}
            disabled={!viewerState && !proposalFile}
            aria-label="Print"
          >
            <Print width="1.25rem" height="1.25rem" />
          </ActionIcon>
          {canEdit ? (
            <ActionIcon variant="subtle" onClick={handleEdit} aria-label="Edit">
              <EditNote width="1.25rem" height="1.25rem" />
            </ActionIcon>
          ) : null}
        </Group>
      </Box>

      <Box className={classes.scrollArea}>
        <Box className={classes.a4} ref={printRef}>
          {viewerState ? (
            <QuotationPreview
              quotation={viewerState.quotation}
              template={viewerState.template}
              clientInformationFields={viewerState.clientInformationFields}
              quotationDetails={viewerState.quotationDetails}
              billingDetails={viewerState.billingDetails}
              terms={viewerState.terms}
              signatory={viewerState.signatory}
              mode="viewer"
            />
          ) : (
            <iframe
              src={proposalFile?.file_url}
              title={proposalFile?.file_name ?? "Quotation file"}
              className={classes.fileFrame}
            />
          )}
        </Box>
      </Box>
    </>
  );
}
