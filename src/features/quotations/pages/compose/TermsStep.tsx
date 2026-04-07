import { Box, Group } from "@mantine/core";
import { useState } from "react";
import { AppButton } from "@/components/ui/AppButton";
import {
  useComposeStandardTemplate,
  useComposeStandardTemplates,
} from "@/features/quotations/pages/compose/hooks/useComposeReferenceData";
import { ComposeStepLoader } from "@/features/quotations/pages/compose/components/ComposeStepLoader";
import { TermsTemplateSelector } from "@/features/quotations/pages/compose/components/TermsTemplateSelector";
import type { TermsValues } from "@/features/quotations/schemas/compose.schema";
import classes from "@/features/quotations/pages/compose/TermsStep.module.css";
import { TermsViewer } from "@/features/quotations/pages/compose/TermsViewer";

interface TermsStepProps {
  onNext: (values: TermsValues) => void;
  onChange: (values: TermsValues) => void;
  savedData?: TermsValues | null;
}

export function TermsStep({ onNext, onChange, savedData }: TermsStepProps) {
  const { data: standardTemplates = [], isLoading: isTemplatesLoading } =
    useComposeStandardTemplates();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    () => savedData?.template_id ?? null,
  );
  const { data: selectedTemplate, isLoading: isTemplateLoading } =
    useComposeStandardTemplate(selectedTemplateId ?? undefined);
  const [currentValues, setCurrentValues] = useState<TermsValues | null>(null);

  function handleSelect(templateId: string) {
    setSelectedTemplateId(templateId);
  }

  function handleValuesChange(values: TermsValues) {
    setCurrentValues(values);
    onChange(values);
  }

  if (!selectedTemplateId) {
    return (
      <>
        {isTemplatesLoading ? (
          <ComposeStepLoader
            label="Loading terms templates..."
            minHeight="14rem"
          />
        ) : (
          <TermsTemplateSelector
            templates={standardTemplates}
            onSelect={handleSelect}
          />
        )}
      </>
    );
  }

  if (isTemplateLoading || !selectedTemplate) {
    return (
      <ComposeStepLoader label="Loading terms template..." minHeight="14rem" />
    );
  }

  return (
    <Box
      style={{ display: "flex", flexDirection: "column", minHeight: "100%" }}
    >
      <TermsViewer
        template={selectedTemplate}
        initialValues={savedData}
        onChange={handleValuesChange}
      />

      <Group className={classes.actions}>
        <AppButton
          variant="primary"
          onClick={() => currentValues && onNext(currentValues)}
          w="10rem"
          disabled={!currentValues}
        >
          Next
        </AppButton>
      </Group>
    </Box>
  );
}
