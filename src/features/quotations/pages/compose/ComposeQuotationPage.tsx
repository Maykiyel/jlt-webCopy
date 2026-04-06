import { Button, Box } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { PageCard } from "@/components/PageCard";
import { useAuthStore } from "@/stores/authStore";
import { AuthorizedSignatoryModal } from "@/features/quotations/components/AuthorizedSignatoryModal";
import { StepperBar } from "@/features/quotations/components/StepperBar";
import { ComposeSendModals } from "@/features/quotations/pages/compose/components/ComposeSendModals";
import { ComposeStepActions } from "@/features/quotations/pages/compose/components/ComposeStepActions";
import { ComposeStepContent } from "@/features/quotations/pages/compose/components/ComposeStepContent";
import { getComposeReferenceData } from "@/features/quotations/pages/compose/utils/composeReferenceData";
import { fetchQuotation } from "@/features/quotations/services/quotations.service";
import type {
  BillingDetailsValues,
  QuotationDetailsValues,
  SignatoryValues,
  TermsValues,
} from "@/features/quotations/schemas/compose.schema";
import type { QuotationViewerState } from "@/features/quotations/types/compose.types";

const QUOTATION_DETAILS_FORM_ID = "quotation-details-form";
const BILLING_DETAILS_FORM_ID = "billing-details-form";

interface ComposeLocationState {
  editMode?: boolean;
  quotationDetails?: QuotationDetailsValues;
  billingDetails?: BillingDetailsValues;
  terms?: TermsValues;
  signatory?: SignatoryValues;
}

export function ComposeQuotationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const composeLocationState = location.state as ComposeLocationState | null;
  const editMode = composeLocationState?.editMode ?? false;
  const initialQuotationDetails =
    composeLocationState?.quotationDetails ?? null;
  const initialBillingDetails = composeLocationState?.billingDetails ?? null;
  const initialTerms = composeLocationState?.terms ?? null;
  const initialSignatory = composeLocationState?.signatory ?? null;
  const userResource = useAuthStore((state) => state.user);
  const { quotationTemplates } = getComposeReferenceData();
  const currentUserName = userResource
    ? `${userResource.first_name} ${userResource.last_name}`
    : undefined;
  const { template: templateId, quotationId, tab, clientId } = useParams();

  const { data: quotation } = useQuery({
    queryKey: ["quotation", quotationId],
    queryFn: () => {
      if (!quotationId) {
        throw new Error("Missing quotationId route parameter.");
      }
      return fetchQuotation(quotationId);
    },
    enabled: Boolean(quotationId),
  });

  const quotationTemplate =
    quotationTemplates.find((item) => item.id === templateId) ?? null;
  // TODO: replace with useQuery({ queryKey: ["quotation-template", templateId], queryFn: ... })

  const [step, setStep] = useState(0);
  const [isStep0Valid, setIsStep0Valid] = useState(false);
  const [quotationDetailsData, setQuotationDetailsData] =
    useState<QuotationDetailsValues | null>(initialQuotationDetails);
  const [billingDetailsData, setBillingDetailsData] =
    useState<BillingDetailsValues | null>(initialBillingDetails);
  const [termsData, setTermsData] = useState<TermsValues | null>(initialTerms);
  const [signatoryData, setSignatoryData] = useState<SignatoryValues | null>(
    initialSignatory,
  );
  const [previewReady, setPreviewReady] = useState(
    Boolean(
      initialQuotationDetails &&
      initialBillingDetails &&
      initialTerms &&
      initialSignatory,
    ),
  );
  const [signatoryOpened, { open: openSignatory, close: closeSignatory }] =
    useDisclosure(false);
  const [
    sendConfirmOpened,
    { open: openSendConfirm, close: closeSendConfirm },
  ] = useDisclosure(false);
  const [
    sendSuccessOpened,
    { open: openSendSuccess, close: closeSendSuccess },
  ] = useDisclosure(false);
  const canOpenSignatoryModal = termsData !== null || signatoryData !== null;
  const canRenderTermsStep =
    quotationDetailsData !== null && billingDetailsData !== null;

  if (!quotationTemplate) {
    return <div>Template not found</div>;
  }

  function handleStepClick(index: number) {
    if (index < step) setStep(index);
  }

  function handleStep0Submit(values: QuotationDetailsValues) {
    setQuotationDetailsData(values);
    setStep(1);
  }

  function handleStep1Submit(values: BillingDetailsValues) {
    setBillingDetailsData(values);
    setStep(2);
  }

  function handleTermsChange(values: TermsValues) {
    setTermsData(values);
  }

  function handleTermsNext(values: TermsValues) {
    setTermsData(values);
    openSignatory();
  }

  function handleSignatorySave(values: SignatoryValues) {
    setSignatoryData(values);
    closeSignatory();
    setPreviewReady(true);
  }

  function handleCancel() {
    navigate(`/quotations/${tab}/client/${clientId}/${quotationId}`);
  }

  async function handleSend() {
    // TODO: implement when POST /quotations/{id}/send endpoint is available
    // Will send: quotationDetailsData, billingDetailsData, termsData, signatoryData + generated PDF
    closeSendConfirm();
    openSendSuccess();
  }

  function handleSendSuccess() {
    closeSendSuccess();
    if (
      !quotation ||
      !quotationTemplate ||
      !clientId ||
      !quotationId ||
      !quotationDetailsData ||
      !billingDetailsData ||
      !termsData ||
      !signatoryData
    ) {
      navigate("/quotations/responded");
      return;
    }

    const viewerState: QuotationViewerState = {
      quotation,
      template: quotationTemplate,
      quotationDetails: quotationDetailsData,
      billingDetails: billingDetailsData,
      terms: termsData,
      signatory: signatoryData,
      // TODO: attach generated PDF blob here when react-pdf/renderer is implemented.
    };

    navigate(`/quotations/${tab}/client/${clientId}/${quotationId}/view`, {
      state: viewerState,
    });
  }

  return (
    <PageCard
      title={quotationTemplate.name}
      fullHeight
      hideDivider
      bodyPx={0}
      bodyPy={0}
      action={
        editMode ? (
          <Button
            variant="subtle"
            color="red"
            onClick={handleCancel}
            px={0}
            fw={500}
          >
            CANCEL
          </Button>
        ) : undefined
      }
    >
      <Box
        style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}
      >
        <StepperBar step={step} onStepClick={handleStepClick} />

        <Box
          px="xl"
          py="lg"
          style={{ flex: 1, display: "flex", flexDirection: "column" }}
        >
          <ComposeStepContent
            step={step}
            quotationTemplate={quotationTemplate}
            quotation={quotation}
            quotationDetailsData={quotationDetailsData}
            billingDetailsData={billingDetailsData}
            termsData={termsData}
            signatoryData={signatoryData}
            previewReady={previewReady}
            canRenderTermsStep={canRenderTermsStep}
            quotationDetailsFormId={QUOTATION_DETAILS_FORM_ID}
            billingDetailsFormId={BILLING_DETAILS_FORM_ID}
            onStep0Submit={handleStep0Submit}
            onStep1Submit={handleStep1Submit}
            onStep0ValidityChange={setIsStep0Valid}
            onTermsChange={handleTermsChange}
            onTermsNext={handleTermsNext}
          />

          <ComposeStepActions
            step={step}
            isStep0Valid={isStep0Valid}
            previewReady={previewReady}
            quotationDetailsFormId={QUOTATION_DETAILS_FORM_ID}
            billingDetailsFormId={BILLING_DETAILS_FORM_ID}
            onOpenSendConfirm={openSendConfirm}
          />
        </Box>
      </Box>

      <AuthorizedSignatoryModal
        opened={signatoryOpened && canOpenSignatoryModal}
        onClose={closeSignatory}
        onSave={handleSignatorySave}
        currentUserName={currentUserName}
        initialValues={signatoryData}
      />

      <ComposeSendModals
        sendConfirmOpened={sendConfirmOpened}
        sendSuccessOpened={sendSuccessOpened}
        onCloseSendConfirm={closeSendConfirm}
        onSend={handleSend}
        onCloseSendSuccess={handleSendSuccess}
      />
    </PageCard>
  );
}
