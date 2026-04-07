import { Box } from "@mantine/core";
import { QuotationPreview } from "@/features/quotations/components/QuotationPreview";
import { BillingDetailsForm } from "@/features/quotations/pages/compose/BillingDetailsForm";
import { ComposeStepLoader } from "@/features/quotations/pages/compose/components/ComposeStepLoader";
import { QuotationDetailsForm } from "@/features/quotations/pages/compose/QuotationDetailsForm";
import { TermsStep } from "@/features/quotations/pages/compose/TermsStep";
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

interface ComposeStepContentProps {
  step: number;
  quotationTemplate: QuotationTemplate;
  quotation?: QuotationResource;
  clientInformationFields?: ClientInformationValue[];
  quotationDetailsData: QuotationDetailsValues | null;
  billingDetailsData: BillingDetailsValues | null;
  termsData: TermsValues | null;
  signatoryData: SignatoryValues | null;
  previewReady: boolean;
  canRenderTermsStep: boolean;
  quotationDetailsFormId: string;
  billingDetailsFormId: string;
  onStep0Submit: (values: QuotationDetailsValues) => void;
  onStep1Submit: (values: BillingDetailsValues) => void;
  onStep0ValidityChange: (isValid: boolean) => void;
  onTermsChange: (values: TermsValues) => void;
  onTermsNext: (values: TermsValues) => void;
}

export function ComposeStepContent({
  step,
  quotationTemplate,
  quotation,
  clientInformationFields,
  quotationDetailsData,
  billingDetailsData,
  termsData,
  signatoryData,
  previewReady,
  canRenderTermsStep,
  quotationDetailsFormId,
  billingDetailsFormId,
  onStep0Submit,
  onStep1Submit,
  onStep0ValidityChange,
  onTermsChange,
  onTermsNext,
}: ComposeStepContentProps) {
  const previewProps =
    quotation &&
    quotationDetailsData &&
    billingDetailsData &&
    termsData &&
    signatoryData
      ? {
          quotation,
          quotationDetails: quotationDetailsData,
          billingDetails: billingDetailsData,
          terms: termsData,
          signatory: signatoryData,
        }
      : null;

  const isWaitingForQuotation =
    previewReady &&
    !quotation &&
    Boolean(
      quotationDetailsData && billingDetailsData && termsData && signatoryData,
    );

  return (
    <Box mt="md" style={{ flex: 1 }}>
      {step === 0 && (
        <QuotationDetailsForm
          id={quotationDetailsFormId}
          template={quotationTemplate}
          defaultValues={quotationDetailsData ?? undefined}
          onSubmit={onStep0Submit}
          onValidityChange={onStep0ValidityChange}
        />
      )}

      {step === 1 && (
        <BillingDetailsForm
          id={billingDetailsFormId}
          template={quotationTemplate}
          defaultValues={billingDetailsData ?? undefined}
          onSubmit={onStep1Submit}
        />
      )}

      {step === 2 &&
        (canRenderTermsStep ? (
          previewReady && previewProps ? (
            <QuotationPreview
              quotation={previewProps.quotation}
              template={quotationTemplate}
              clientInformationFields={clientInformationFields}
              quotationDetails={previewProps.quotationDetails}
              billingDetails={previewProps.billingDetails}
              terms={previewProps.terms}
              signatory={previewProps.signatory}
            />
          ) : isWaitingForQuotation ? (
            <ComposeStepLoader
              label="Loading quotation preview..."
              minHeight="14rem"
            />
          ) : (
            <TermsStep
              onNext={onTermsNext}
              onChange={onTermsChange}
              savedData={termsData}
            />
          )
        ) : (
          <div>Terms and Conditions - coming soon</div>
        ))}
    </Box>
  );
}
