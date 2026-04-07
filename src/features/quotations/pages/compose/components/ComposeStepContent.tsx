import { Box } from "@mantine/core";
import { QuotationPreview } from "@/features/quotations/components/QuotationPreview";
import { BillingDetailsForm } from "@/features/quotations/pages/compose/BillingDetailsForm";
import { QuotationDetailsForm } from "@/features/quotations/pages/compose/QuotationDetailsForm";
import { TermsStep } from "@/features/quotations/pages/compose/TermsStep";
import type {
  BillingDetailsValues,
  QuotationDetailsValues,
  SignatoryValues,
  TermsValues,
} from "@/features/quotations/schemas/compose.schema";
import type { QuotationTemplate } from "@/features/quotations/types/compose.types";
import type { QuotationResource } from "@/features/quotations/types/quotations.types";

interface ComposeStepContentProps {
  step: number;
  quotationTemplate: QuotationTemplate;
  quotation?: QuotationResource;
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
