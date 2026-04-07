import { Button, Box } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createElement, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import jltLogoUrl from "@/assets/logos/word-dark.png";
import { PageCard } from "@/components/PageCard";
import { useAuthStore } from "@/stores/authStore";
import { AuthorizedSignatoryModal } from "@/features/quotations/components/AuthorizedSignatoryModal";
import { StepperBar } from "@/features/quotations/components/StepperBar";
import { ComposeSendModals } from "@/features/quotations/pages/compose/components/ComposeSendModals";
import { ComposeStepLoader } from "@/features/quotations/pages/compose/components/ComposeStepLoader";
import { ComposeStepActions } from "@/features/quotations/pages/compose/components/ComposeStepActions";
import { ComposeStepContent } from "@/features/quotations/pages/compose/components/ComposeStepContent";
import {
  useComposeQuotationClientInputs,
  useComposeQuotationTemplate,
} from "@/features/quotations/pages/compose/hooks/useComposeReferenceData";
import { quotationQueryKeys } from "@/features/quotations/pages/utils/quotationQueryKeys";
import { buildIssuedQuotationFormData } from "@/features/quotations/pages/compose/utils/issuedQuotationPayload";
import {
  createIssuedQuotation,
  fetchQuotation,
} from "@/features/quotations/services/quotations.service";
import type {
  BillingDetailsValues,
  QuotationDetailsValues,
  SignatoryValues,
  TermsValues,
} from "@/features/quotations/schemas/compose.schema";
import type {
  ClientInformationValue,
  QuotationTemplate,
} from "@/features/quotations/types/compose.types";
import type { QuotationResource } from "@/features/quotations/types/quotations.types";

const QUOTATION_DETAILS_FORM_ID = "quotation-details-form";
const BILLING_DETAILS_FORM_ID = "billing-details-form";

interface ComposeLocationState {
  editMode?: boolean;
  quotationDetails?: QuotationDetailsValues;
  billingDetails?: BillingDetailsValues;
  terms?: TermsValues;
  signatory?: SignatoryValues;
}

function toErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: unknown }).response === "object" &&
    (error as { response?: { data?: unknown } }).response?.data &&
    typeof (error as { response?: { data?: { message?: unknown } } }).response
      ?.data?.message === "string"
  ) {
    return (error as { response: { data: { message: string } } }).response.data
      .message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Please review the compose data and try again.";
}

async function generateIssuedQuotationPdfFile({
  quotation,
  template,
  clientInformationFields,
  quotationDetails,
  billingDetails,
  terms,
  signatory,
}: {
  quotation: QuotationResource;
  template: QuotationTemplate;
  clientInformationFields: ClientInformationValue[];
  quotationDetails: QuotationDetailsValues;
  billingDetails: BillingDetailsValues;
  terms: TermsValues;
  signatory: SignatoryValues;
}): Promise<File> {
  const [{ pdf }, { QuotationPDF }] = await Promise.all([
    import("@react-pdf/renderer"),
    import("@/features/quotations/pdf/QuotationPDF"),
  ]);

  const signatorySignatureSrc = signatory.signature_file
    ? URL.createObjectURL(signatory.signature_file)
    : null;

  try {
    const doc = createElement(QuotationPDF, {
      quotation,
      template,
      clientInformationFields,
      quotationDetails,
      billingDetails,
      terms,
      signatory,
      logoSrc: jltLogoUrl,
      signatorySignatureSrc,
    });

    const blob = await pdf(doc as never).toBlob();
    const pdfBlob =
      blob.type === "application/pdf"
        ? blob
        : new Blob([blob], { type: "application/pdf" });

    return new File([pdfBlob], `${quotation.reference_number}-proposal.pdf`, {
      type: "application/pdf",
    });
  } finally {
    if (signatorySignatureSrc) {
      URL.revokeObjectURL(signatorySignatureSrc);
    }
  }
}

export function ComposeQuotationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const composeLocationState = location.state as ComposeLocationState | null;
  const editMode = composeLocationState?.editMode ?? false;
  const initialQuotationDetails =
    composeLocationState?.quotationDetails ?? null;
  const initialBillingDetails = composeLocationState?.billingDetails ?? null;
  const initialTerms = composeLocationState?.terms ?? null;
  const initialSignatory = composeLocationState?.signatory ?? null;
  const userResource = useAuthStore((state) => state.user);
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

  const { data: quotationTemplate, isLoading: isTemplateLoading } =
    useComposeQuotationTemplate(templateId);

  const { data: clientInformationFields = [] } =
    useComposeQuotationClientInputs(quotationId, quotationTemplate?.id);

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

  const sendMutation = useMutation({
    mutationFn: async () => {
      if (!quotationId || !quotationTemplate || !quotation) {
        throw new Error("Missing quotation context.");
      }
      if (
        !quotationDetailsData ||
        !billingDetailsData ||
        !termsData ||
        !signatoryData
      ) {
        throw new Error("Complete all compose steps before sending.");
      }
      if (
        !quotationDetailsData.subject?.trim() ||
        !quotationDetailsData.message?.trim()
      ) {
        throw new Error("Subject and message are required before sending.");
      }
      if (!signatoryData.signature_file) {
        throw new Error(
          "Upload an authorized signatory signature before sending.",
        );
      }

      const issuedQuotationFile = await generateIssuedQuotationPdfFile({
        quotation,
        template: quotationTemplate,
        clientInformationFields,
        quotationDetails: quotationDetailsData,
        billingDetails: billingDetailsData,
        terms: termsData,
        signatory: signatoryData,
      });

      const payload = buildIssuedQuotationFormData({
        template: quotationTemplate,
        quotationDetails: quotationDetailsData,
        billingDetails: billingDetailsData,
        terms: termsData,
        signatory: signatoryData,
        issuedQuotationFile,
      });

      return createIssuedQuotation(quotationId, payload);
    },
    onSuccess: async () => {
      closeSendConfirm();
      openSendSuccess();

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: quotationQueryKeys.quotationDetails(quotationId),
        }),
        queryClient.invalidateQueries({
          queryKey: quotationQueryKeys.quotationFiles(quotationId, "PROPOSAL"),
        }),
      ]);
    },
    onError: (error) => {
      notifications.show({
        title: "Unable to send quotation",
        message: toErrorMessage(error),
        color: "red",
      });
    },
  });

  if (isTemplateLoading) {
    return (
      <PageCard title="Compose Quotation" fullHeight>
        <ComposeStepLoader label="Loading quotation template..." />
      </PageCard>
    );
  }

  if (!quotationTemplate) {
    return (
      <PageCard title="Compose Quotation" fullHeight>
        <Box p="md">Template not found.</Box>
      </PageCard>
    );
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
    if (!tab || !clientId || !quotationId) {
      navigate(-1);
      return;
    }

    navigate(`/quotations/${tab}/client/${clientId}/${quotationId}`);
  }

  async function handleSend() {
    try {
      await sendMutation.mutateAsync();
    } catch {
      return;
    }
  }

  function handleSendSuccess() {
    closeSendSuccess();
    if (!quotationId || !tab) {
      navigate("/quotations/responded");
      return;
    }

    const viewerPath = clientId
      ? `/quotations/${tab}/client/${clientId}/${quotationId}/view`
      : `/quotations/${tab}/${quotationId}/view`;

    navigate(viewerPath);
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
            clientInformationFields={clientInformationFields}
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
            isSending={sendMutation.isPending}
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
        isSending={sendMutation.isPending}
        onCloseSendConfirm={closeSendConfirm}
        onSend={handleSend}
        onCloseSendSuccess={handleSendSuccess}
      />
    </PageCard>
  );
}
