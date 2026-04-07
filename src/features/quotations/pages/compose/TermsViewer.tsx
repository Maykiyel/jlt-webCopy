import { Box, Paper, Stack, Text, Textarea } from "@mantine/core";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import type { TermsValues } from "@/features/quotations/schemas/compose.schema";
import type { StandardTemplate } from "@/features/quotations/types/compose.types";

interface TermsViewerProps {
  template: StandardTemplate;
  initialValues?: TermsValues | null;
  onChange: (values: TermsValues) => void;
}

type TermsTextFieldKey = Exclude<keyof TermsValues, "template_id">;

const TERMS_TEXT_FIELDS: Array<{ key: TermsTextFieldKey; label: string }> = [
  { key: "policies", label: "Policies" },
  { key: "terms_and_condition", label: "Terms and Condition" },
  { key: "banking_details", label: "Banking Details" },
  { key: "footer", label: "Footer" },
];

function buildInitialTermsValues(
  template: StandardTemplate,
  initialValues?: TermsValues | null,
): TermsValues {
  const values: TermsValues = { template_id: template.id };

  TERMS_TEXT_FIELDS.forEach(({ key }) => {
    values[key] = initialValues?.[key] ?? template[key];
  });

  return values;
}

export function TermsViewer({
  template,
  initialValues,
  onChange,
}: TermsViewerProps) {
  const fixedTextareaHeight = "8rem";
  const textareaInputStyles: CSSProperties = {
    border: 0,
    boxShadow: "none",
    background: "transparent",
    height: fixedTextareaHeight,
    minHeight: fixedTextareaHeight,
    maxHeight: fixedTextareaHeight,
    overflowY: "auto",
    resize: "none",
  };

  const textareaStyles = {
    input: textareaInputStyles,
  };

  const [values, setValues] = useState<TermsValues>(() =>
    buildInitialTermsValues(template, initialValues),
  );

  useEffect(() => {
    onChange(values);
  }, [values, onChange]);

  function updateValue(field: TermsTextFieldKey, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <Stack gap="sm" mt="md">
      <Paper withBorder radius="sm" mb="sm">
        <Box px="md" py="xs" bg="gray.1">
          <Text size="sm" fw={600} tt="uppercase">
            Template Name
          </Text>
        </Box>
        <Box px="md" py="sm">
          <Text size="sm">{template.name}</Text>
        </Box>
      </Paper>

      {TERMS_TEXT_FIELDS.map(({ key, label }) => (
        <Paper key={key} withBorder radius="sm" mb="sm">
          <Box px="md" py="xs" bg="gray.1">
            <Text size="sm" fw={600} tt="uppercase">
              {label}
            </Text>
          </Box>
          <Box px="md" py="sm">
            <Textarea
              value={values[key] ?? ""}
              onChange={(event) => updateValue(key, event.currentTarget.value)}
              styles={textareaStyles}
            />
          </Box>
        </Paper>
      ))}
    </Stack>
  );
}
