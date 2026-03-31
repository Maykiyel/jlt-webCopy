import { Box, Group, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { AppButton } from "@/components/ui/AppButton";
import { PLACEHOLDER_STANDARD_TEMPLATES } from "@/features/quotations/data/composePlaceholders";
import type { TermsValues } from "@/features/quotations/schemas/compose.schema";
import type { StandardTemplate } from "@/features/quotations/types/compose.types";
import classes from "@/features/quotations/pages/compose/TermsStep.module.css";
import { TermsViewer } from "@/features/quotations/pages/compose/TermsViewer";

interface TermsStepProps {
  onNext: (values: TermsValues) => void;
  onChange: (values: TermsValues) => void;
  savedData?: TermsValues | null;
}

function TermsTemplateSelector({
  templates,
  onSelect,
}: {
  templates: StandardTemplate[];
  onSelect: (templateId: string) => void;
}) {
  return (
    <Box className={classes.selector} px="5.438rem">
      {templates.map((template, index) => (
        <Box
          key={template.id}
          className={`${classes.option} ${classes.optionEnabled}`}
          onClick={() => onSelect(template.id)}
        >
          <Text className={classes.number}>
            {String(index + 1).padStart(2, "0")}
          </Text>
          <Text className={classes.label}>{template.name}</Text>
        </Box>
      ))}
    </Box>
  );
}

export function TermsStep({ onNext, onChange, savedData }: TermsStepProps) {
  // TODO: replace with useQuery when GET /standard-templates is available
  const standardTemplates = PLACEHOLDER_STANDARD_TEMPLATES;
  const [selectedTemplate, setSelectedTemplate] =
    useState<StandardTemplate | null>(null);
  const [currentValues, setCurrentValues] = useState<TermsValues | null>(null);

  useEffect(() => {
    if (!savedData?.template_id) {
      return;
    }

    const template =
      standardTemplates.find((item) => item.id === savedData.template_id) ??
      null;
    if (template) {
      setSelectedTemplate(template);
    }
  }, [savedData?.template_id, standardTemplates]);

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
