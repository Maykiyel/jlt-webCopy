import { ActionIcon, Box, Center, Group, Text } from "@mantine/core";
import {
  ArrowBack,
  Download,
  EditDocument,
  Print,
} from "@nine-thirty-five/material-symbols-react/outlined";
import { useLocation, useNavigate, useParams } from "react-router";
import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import jltLogoUrl from "@/assets/logos/word-dark.png";
import { QuotationPreview } from "@/features/quotations/components/QuotationPreview";
import { useQuotationRouteParams } from "@/features/quotations/hooks/useQuotationRouteParams";
import { quotationQueryKeys } from "@/features/quotations/api/quotationQueryKeys";
import { quotationRoutes } from "@/features/quotations/utils/quotationRoutes";
import { usePDFActions } from "@/features/quotations/pdf/usePDFActions";
import {
  fetchQuotationFiles,
  fetchIssuedQuotation,
  fetchQuotation,
  fetchQuotationTemplate,
} from "@/features/quotations/api/quotations.api";
import type {
  QuotationViewerRouteState,
  QuotationViewerState,
} from "@/features/quotations/types/compose.types";
import { buildViewerStateFromIssuedQuotation } from "@/features/quotations/utils/issuedQuotationViewerState";
import { mapQuotationTemplateDetailToComposeTemplate } from "@/features/quotations/utils/quotationTemplateMapper";
import classes from "./QuotationFileViewer.module.css";

function isQuotationViewerState(value: unknown): value is QuotationViewerState {
  return (
    typeof value === "object" &&
    value !== null &&
    "quotation" in value &&
    "template" in value &&
    "quotationDetails" in value &&
    "billingDetails" in value &&
    "terms" in value &&
    "signatory" in value
  );
}

export function QuotationFileViewer() {
  const location = useLocation();
  const navigate = useNavigate();
  const routeParams = useQuotationRouteParams(["tab", "quotationId"] as const);
  const params = useParams<{ clientId?: string; issuedQuotationId?: string }>();
  const clientId = params.clientId;
  const locationState =
    (location.state as
      | QuotationViewerState
      | (QuotationViewerRouteState & Partial<QuotationViewerState>)
      | null) ?? null;
  const navigationViewerState = isQuotationViewerState(locationState)
    ? locationState
    : null;
  const stateIssuedQuotationId =
    (locationState as QuotationViewerRouteState | null)?.issuedQuotationId ??
    null;
  const routeOrStateIssuedQuotationId =
    params.issuedQuotationId ?? stateIssuedQuotationId;

  const { data: quotation, isLoading: isQuotationLoading } = useQuery({
    queryKey: quotationQueryKeys.quotationDetails(routeParams?.quotationId),
    queryFn: () => {
      if (!routeParams) {
        throw new Error("Missing required route parameters.");
      }

      return fetchQuotation(routeParams.quotationId);
    },
    enabled: Boolean(routeParams && !navigationViewerState),
  });

  const directIssuedQuotationId =
    quotation?.issued_quotation_id == null
      ? null
      : String(quotation.issued_quotation_id);
  const issuedQuotationId =
    routeOrStateIssuedQuotationId ?? directIssuedQuotationId;
  const shouldUseLegacyProposalFile = Boolean(
    routeParams &&
    !navigationViewerState &&
    !issuedQuotationId &&
    !isQuotationLoading,
  );
  const isResolvingIssuedQuotationId = Boolean(
    routeParams &&
    !navigationViewerState &&
    !issuedQuotationId &&
    isQuotationLoading,
  );

  useEffect(() => {
    if (
      !routeParams ||
      !issuedQuotationId ||
      params.issuedQuotationId ||
      navigationViewerState
    ) {
      return;
    }

    navigate(
      quotationRoutes.viewer({
        tab: routeParams.tab,
        quotationId: routeParams.quotationId,
        clientId,
        issuedQuotationId,
      }),
      {
        replace: true,
        state: locationState,
      },
    );
  }, [
    clientId,
    issuedQuotationId,
    locationState,
    navigate,
    navigationViewerState,
    params.issuedQuotationId,
    routeParams,
  ]);

  const shouldFetchIssuedViewerData = Boolean(
    routeParams && issuedQuotationId && !navigationViewerState,
  );

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
      enabled: shouldUseLegacyProposalFile,
    });

  const proposalFile = proposalFiles[0] ?? null;

  const { data: issuedQuotation, isLoading: isIssuedQuotationLoading } =
    useQuery({
      queryKey: quotationQueryKeys.issuedQuotation(
        routeParams?.quotationId,
        issuedQuotationId ?? undefined,
      ),
      queryFn: () => {
        if (!routeParams || !issuedQuotationId) {
          throw new Error("Missing issued quotation route context.");
        }

        return fetchIssuedQuotation(routeParams.quotationId, issuedQuotationId);
      },
      enabled: shouldFetchIssuedViewerData,
    });

  const templateId = issuedQuotation
    ? String(issuedQuotation.template_id)
    : undefined;

  const { data: quotationTemplate, isLoading: isTemplateLoading } = useQuery({
    queryKey: ["quotation-template-viewer", templateId],
    queryFn: async () => {
      if (!templateId) {
        throw new Error("Missing issued quotation template id.");
      }

      const templateDetails = await fetchQuotationTemplate(templateId);
      return mapQuotationTemplateDetailToComposeTemplate(templateDetails);
    },
    enabled: Boolean(templateId && shouldFetchIssuedViewerData),
  });

  const viewerState = useMemo(() => {
    if (navigationViewerState) {
      return navigationViewerState;
    }

    if (!issuedQuotation || !quotationTemplate || !quotation) {
      return null;
    }

    return buildViewerStateFromIssuedQuotation({
      quotation,
      template: quotationTemplate,
      issuedQuotation,
    });
  }, [issuedQuotation, navigationViewerState, quotation, quotationTemplate]);

  const isViewerStateLoading =
    shouldFetchIssuedViewerData &&
    (isIssuedQuotationLoading || isTemplateLoading || isQuotationLoading);

  const {
    handleDownload: handlePreviewDownload,
    handlePrint: handlePreviewPrint,
  } = usePDFActions(viewerState, jltLogoUrl);
  const canEdit = routeParams?.tab === "requested" && Boolean(clientId);

  function handleDownload() {
    if (viewerState) {
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
    if (viewerState) {
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

  if (isResolvingIssuedQuotationId) {
    return (
      <Center h="100%">
        <Text c="dimmed">Loading issued quotation...</Text>
      </Center>
    );
  }

  if (shouldUseLegacyProposalFile && isProposalFileLoading) {
    return (
      <Center h="100%">
        <Text c="dimmed">Loading quotation file...</Text>
      </Center>
    );
  }

  if (shouldUseLegacyProposalFile && !proposalFile) {
    return (
      <Center h="100%">
        <Text c="dimmed">No proposal file found for this quotation.</Text>
      </Center>
    );
  }

  if (!navigationViewerState && isViewerStateLoading) {
    return (
      <Center h="100%">
        <Text c="dimmed">Loading issued quotation...</Text>
      </Center>
    );
  }

  if (!viewerState && !shouldUseLegacyProposalFile) {
    return (
      <Center h="100%">
        <Text c="dimmed">No issued quotation data found for this view.</Text>
      </Center>
    );
  }

  function handleEdit() {
    if (!routeParams || !clientId || !canEdit) {
      navigate(-1);
      return;
    }

    if (!viewerState) {
      navigate(
        quotationRoutes.compose({
          tab: routeParams.tab,
          clientId,
          quotationId: routeParams.quotationId,
        }),
      );
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
          issuedQuotationId: issuedQuotationId ?? undefined,
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
              <EditDocument width="1.25rem" height="1.25rem" />
            </ActionIcon>
          ) : null}
        </Group>
      </Box>

      <Box className={classes.scrollArea}>
        <Box className={classes.a4}>
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
            <Center h="29.7cm" p="md">
              <Text c="dimmed" ta="center" maw="28rem" size="sm">
                Preview is unavailable while waiting for issued quotation data.
                You can still use Download or Print.
              </Text>
            </Center>
          )}
        </Box>
      </Box>
    </>
  );
}
