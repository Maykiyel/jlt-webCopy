import { Box, Text } from "@mantine/core";
import type { StandardTemplate } from "@/features/quotations/types/compose.types";
import classes from "@/features/quotations/pages/compose/TermsStep.module.css";

interface TermsTemplateSelectorProps {
  templates: StandardTemplate[];
  onSelect: (templateId: string) => void;
}

export function TermsTemplateSelector({
  templates,
  onSelect,
}: TermsTemplateSelectorProps) {
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
