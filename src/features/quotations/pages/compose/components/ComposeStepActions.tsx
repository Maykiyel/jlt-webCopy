import { Group } from "@mantine/core";
import { AppButton } from "@/components/ui/AppButton";

interface ComposeStepActionsProps {
  step: number;
  isStep0Valid: boolean;
  previewReady: boolean;
  quotationDetailsFormId: string;
  billingDetailsFormId: string;
  onOpenSendConfirm: () => void;
}

export function ComposeStepActions({
  step,
  isStep0Valid,
  previewReady,
  quotationDetailsFormId,
  billingDetailsFormId,
  onOpenSendConfirm,
}: ComposeStepActionsProps) {
  return (
    <>
      {step < 2 && (
        <Group justify="flex-end" mt="lg" style={{ marginTop: "auto" }}>
          {step === 0 ? (
            <AppButton
              variant="primary"
              type="submit"
              form={quotationDetailsFormId}
              disabled={!isStep0Valid}
              w="10rem"
            >
              Next
            </AppButton>
          ) : (
            <AppButton
              variant="primary"
              type="submit"
              form={billingDetailsFormId}
              w="10rem"
            >
              Next
            </AppButton>
          )}
        </Group>
      )}

      {step === 2 && previewReady && (
        <Group justify="flex-end" mt="lg" style={{ marginTop: "auto" }}>
          <AppButton variant="primary" onClick={onOpenSendConfirm}>
            Send
          </AppButton>
        </Group>
      )}
    </>
  );
}
