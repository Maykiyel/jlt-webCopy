import { Box, Group } from "@mantine/core";
import { useState } from "react";
import { AppButton } from "@/components/ui/AppButton";
import { PLACEHOLDER_STANDARD_TEMPLATES } from "@/features/quotations/data/composePlaceholders";
import { useComposeStandardTemplates } from "@/features/quotations/pages/compose/hooks/useComposeReferenceData";
import { TermsTemplateSelector } from "@/features/quotations/pages/compose/components/TermsTemplateSelector";
import type { TermsValues } from "@/features/quotations/schemas/compose.schema";
import type { StandardTemplate } from "@/features/quotations/types/compose.types";
import classes from "@/features/quotations/pages/compose/TermsStep.module.css";
import { TermsViewer } from "@/features/quotations/pages/compose/TermsViewer";

interface TermsStepProps {
  onNext: (values: TermsValues) => void;
  onChange: (values: TermsValues) => void;
  savedData?: TermsValues | null;
}

export function TermsStep({ onNext, onChange, savedData }: TermsStepProps) {
  const { data: standardTemplates = PLACEHOLDER_STANDARD_TEMPLATES } =
    useComposeStandardTemplates();
  const [selectedTemplate, setSelectedTemplate] =
    useState<StandardTemplate | null>(() => {
      if (!savedData?.template_id) {
        return null;
      }

      return (
        standardTemplates.find((item) => item.id === savedData.template_id) ??
        null
      );
    });
  const [currentValues, setCurrentValues] = useState<TermsValues | null>(null);

  function handleSelect(templateId: string) {
    const template =
      standardTemplates.find((item) => item.id === templateId) ?? null;
    if (!template) {
      return;
    }
    setSelectedTemplate(template);
  }

  function handleValuesChange(values: TermsValues) {
    setCurrentValues(values);
    onChange(values);
  }

  if (!selectedTemplate) {
    return (
      <TermsTemplateSelector
        templates={standardTemplates}
        onSelect={handleSelect}
      />
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
