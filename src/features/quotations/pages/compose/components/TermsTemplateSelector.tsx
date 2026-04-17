import { Box } from "@mantine/core";
import type { StandardTemplateSummary } from "@/features/quotations/types/compose.types";
import { NumberedOptionButton } from "@/components/NumberedOptionButton";
import classes from "@/features/quotations/pages/compose/TermsStep.module.css";

interface TermsTemplateSelectorProps {
  templates: StandardTemplateSummary[];
  onSelect: (templateId: string) => void;
}

export function TermsTemplateSelector({
  templates,
  onSelect,
}: TermsTemplateSelectorProps) {
  return (
    <Box className={classes.selector} px="5.438rem">
      {templates.map((template, index) => (
        <NumberedOptionButton
          key={template.id}
          number={index + 1}
          label={template.name}
          onClick={() => onSelect(template.id)}
          className={classes.option}
        />
      ))}
    </Box>
  );
}
