import { ActionIcon, Box, Center, Group, Text } from "@mantine/core";
import {
  ArrowBack,
  Download,
  EditNote,
  Print,
} from "@nine-thirty-five/material-symbols-react/outlined";
import { useLocation, useNavigate, useParams } from "react-router";
import { useRef } from "react";
import jltLogoUrl from "@/assets/logos/word-dark.png";
import { QuotationPreview } from "@/features/quotations/components/QuotationPreview";
import { usePDFActions } from "@/features/quotations/pdf/usePDFActions";
import type { QuotationViewerState } from "@/features/quotations/types/compose.types";
import classes from "./QuotationFileViewer.module.css";

export function QuotationFileViewer() {
  const location = useLocation();
  const navigate = useNavigate();
  const { tab, clientId, quotationId } = useParams();
  const printRef = useRef<HTMLDivElement | null>(null);
  const state = location.state as QuotationViewerState | null;

  if (!state) {
    return (
      <Center h="100%">
        <Text c="dimmed">No quotation data found.</Text>
      </Center>
    );
  }

  const viewerState = state;
  const { handleDownload, handlePrint } = usePDFActions(
    viewerState,
    jltLogoUrl,
  );

  function handleEdit() {
    if (!tab || !clientId || !quotationId) {
      navigate(-1);
      return;
    }

    navigate(
      `/quotations/${tab}/client/${clientId}/${quotationId}/compose/${viewerState.template.id}`,
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
            aria-label="Download"
          >
            <Download width="1.25rem" height="1.25rem" />
          </ActionIcon>
          <ActionIcon variant="subtle" onClick={handlePrint} aria-label="Print">
            <Print width="1.25rem" height="1.25rem" />
          </ActionIcon>
          <ActionIcon variant="subtle" onClick={handleEdit} aria-label="Edit">
            <EditNote width="1.25rem" height="1.25rem" />
          </ActionIcon>
        </Group>
      </Box>

      <Box className={classes.scrollArea}>
        <Box className={classes.a4} ref={printRef}>
          <QuotationPreview
            quotation={viewerState.quotation}
            template={viewerState.template}
            quotationDetails={viewerState.quotationDetails}
            billingDetails={viewerState.billingDetails}
            terms={viewerState.terms}
            signatory={viewerState.signatory}
            mode="viewer"
          />
        </Box>
      </Box>
    </>
  );
}
