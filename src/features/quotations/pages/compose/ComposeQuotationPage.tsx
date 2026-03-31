import {
  Button,
  Box,
  Divider,
  Group,
  Modal,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import {
  Warning,
  AssignmentTurnedIn,
} from "@nine-thirty-five/material-symbols-react/outlined";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { PageCard } from "@/components/PageCard";
import { AppButton } from "@/components/ui/AppButton";
import { useAuthStore } from "@/stores/authStore";
import { AuthorizedSignatoryModal } from "@/features/quotations/components/AuthorizedSignatoryModal";
import { QuotationPreview } from "@/features/quotations/components/QuotationPreview";
import { StepperBar } from "@/features/quotations/components/StepperBar";
import { PLACEHOLDER_QUOTATION_TEMPLATES } from "@/features/quotations/data/composePlaceholders";
import { QuotationDetailsForm } from "@/features/quotations/pages/compose/QuotationDetailsForm";
import { BillingDetailsForm } from "@/features/quotations/pages/compose/BillingDetailsForm";
import { TermsStep } from "@/features/quotations/pages/compose/TermsStep";
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
  const currentUserName = userResource
    ? `${userResource.first_name} ${userResource.last_name}`
    : undefined;
  const { template: templateId, quotationId, tab, clientId } = useParams();

  const { data: quotation } = useQuery({
    queryKey: ["quotation", quotationId],
    queryFn: () => fetchQuotation(quotationId ?? ""),
    enabled: Boolean(quotationId),
  });

  const quotationTemplate =
    PLACEHOLDER_QUOTATION_TEMPLATES.find((item) => item.id === templateId) ??
    null;
  // TODO: replace with useQuery({ queryKey: ["quotation-template", templateId], queryFn: ... })

  if (!quotationTemplate) {
    return <div>Template not found</div>;
  }

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

        <Box mt="md" style={{ flex: 1 }}>
          {step === 0 && (
            <QuotationDetailsForm
              id={QUOTATION_DETAILS_FORM_ID}
              template={quotationTemplate}
              defaultValues={quotationDetailsData ?? undefined}
              onSubmit={handleStep0Submit}
              onValidityChange={setIsStep0Valid}
            />
          )}

          {step === 1 && (
            <BillingDetailsForm
              id={BILLING_DETAILS_FORM_ID}
              template={quotationTemplate}
              defaultValues={billingDetailsData ?? undefined}
              onSubmit={handleStep1Submit}
            />
          )}
          {step === 2 &&
            (canRenderTermsStep ? (
              previewReady &&
              quotation &&
              quotationDetailsData &&
              billingDetailsData &&
              termsData &&
              signatoryData ? (
                <QuotationPreview
                  quotation={quotation}
                  template={quotationTemplate}
                  quotationDetails={quotationDetailsData}
                  billingDetails={billingDetailsData}
                  terms={termsData}
                  signatory={signatoryData}
                />
              ) : (
                <TermsStep
                  onNext={handleTermsNext}
                  onChange={handleTermsChange}
                  savedData={termsData}
                />
              )
            ) : (
              <div>Terms and Conditions - coming soon</div>
            ))}
        </Box>

        {step < 2 && (
          <Group justify="flex-end" mt="lg" style={{ marginTop: "auto" }}>
            {step === 0 ? (
              <AppButton
                variant="primary"
                type="submit"
                form={QUOTATION_DETAILS_FORM_ID}
                disabled={!isStep0Valid}
                w="10rem"
              >
                Next
              </AppButton>
            ) : (
              <AppButton
                variant="primary"
                type="submit"
                form={BILLING_DETAILS_FORM_ID}
                w="10rem"
              >
                Next
              </AppButton>
            )}
          </Group>
        )}
        {step === 2 && previewReady && (
          <Group justify="flex-end" mt="lg" style={{ marginTop: "auto" }}>
            <AppButton variant="primary" onClick={openSendConfirm}>
              Send
            </AppButton>
          </Group>
        )}
      </Box>

      <AuthorizedSignatoryModal
        opened={signatoryOpened && canOpenSignatoryModal}
        onClose={closeSignatory}
        onSave={handleSignatorySave}
        currentUserName={currentUserName}
        initialValues={signatoryData}
      />

      <Modal
        opened={sendConfirmOpened}
        onClose={closeSendConfirm}
        centered
        withCloseButton={false}
        size="sm"
        padding={0}
      >
        <Stack align="center" gap="md" p="xl">
          <Warning width={160} height={160} color="red" />
          <Box>
            <Text fw={500} ta="center">
              Send Quotation?
            </Text>
            <Text size="xs" c="dimmed" ta="center">
              You're about to send this quotation to the client. Please review
              all details carefully. Changes after sending will require a
              revised quotation.
            </Text>
          </Box>
        </Stack>
        <Group w="100%" gap={0}>
          <Divider w="100%" />
          <UnstyledButton
            onClick={handleSend}
            style={{
              flex: 1,
              textAlign: "center",
              padding: "0.75rem",
              borderRight: "0.5px solid var(--mantine-color-gray-3)",
            }}
          >
            <Text size="sm" fw={500} c="red">
              YES
            </Text>
          </UnstyledButton>
          <UnstyledButton
            onClick={closeSendConfirm}
            style={{ flex: 1, textAlign: "center", padding: "0.75rem" }}
          >
            <Text size="sm" fw={500} c="dimmed">
              CANCEL
            </Text>
          </UnstyledButton>
        </Group>
      </Modal>

      <Modal
        opened={sendSuccessOpened}
        onClose={handleSendSuccess}
        centered
        withCloseButton={false}
        size="sm"
        padding={0}
      >
        <Stack align="center" gap="md" p="xl">
          <AssignmentTurnedIn width={160} height={160} color="green" />

          <Box>
            <Text fw={600} tt="uppercase" ta="center">
              Successfully Submitted!
            </Text>
            <Text size="sm" c="dimmed" ta="center">
              We'll notify you as soon as the client accepted the quotation!
            </Text>
          </Box>
        </Stack>
        <Divider w="100%" />

        <UnstyledButton
          onClick={handleSendSuccess}
          style={{
            width: "100%",
            textAlign: "center",
            padding: "1rem 2rem",
          }}
        >
          <Text size="sm" c="dimmed">
            OK
          </Text>
        </UnstyledButton>
      </Modal>
    </PageCard>
  );
}
