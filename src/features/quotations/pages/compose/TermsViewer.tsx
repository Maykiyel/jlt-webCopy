import { Box, Paper, Stack, Text, Textarea } from "@mantine/core";
import { useEffect, useState } from "react";
import type { TermsValues } from "@/features/quotations/schemas/compose.schema";
import type { StandardTemplate } from "@/features/quotations/types/compose.types";

interface TermsViewerProps {
  template: StandardTemplate;
  initialValues?: TermsValues | null;
  onChange: (values: TermsValues) => void;
}

export function TermsViewer({
  template,
  initialValues,
  onChange,
}: TermsViewerProps) {
  const [values, setValues] = useState<TermsValues>({
    template_id: template.id,
    policies: initialValues?.policies ?? template.policies,
    terms_and_condition:
      initialValues?.terms_and_condition ?? template.terms_and_condition,
    banking_details: initialValues?.banking_details ?? template.banking_details,
    footer: initialValues?.footer ?? template.footer,
  });

  useEffect(() => {
    onChange(values);
  }, [values, onChange]);

  function updateValue(field: keyof TermsValues, value: string) {
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

      <Paper withBorder radius="sm" mb="sm">
        <Box px="md" py="xs" bg="gray.1">
          <Text size="sm" fw={600} tt="uppercase">
            Policies
          </Text>
        </Box>
        <Box px="md" py="sm">
          <Textarea
            value={values.policies ?? ""}
            onChange={(event) =>
              updateValue("policies", event.currentTarget.value)
            }
            autosize
            minRows={3}
          />
        </Box>
      </Paper>

      <Paper withBorder radius="sm" mb="sm">
        <Box px="md" py="xs" bg="gray.1">
          <Text size="sm" fw={600} tt="uppercase">
            Terms and Condition
          </Text>
        </Box>
        <Box px="md" py="sm">
          <Textarea
            value={values.terms_and_condition ?? ""}
            onChange={(event) =>
              updateValue("terms_and_condition", event.currentTarget.value)
            }
            autosize
            minRows={3}
          />
        </Box>
      </Paper>

      <Paper withBorder radius="sm" mb="sm">
        <Box px="md" py="xs" bg="gray.1">
          <Text size="sm" fw={600} tt="uppercase">
            Banking Details
          </Text>
        </Box>
        <Box px="md" py="sm">
          <Textarea
            value={values.banking_details ?? ""}
            onChange={(event) =>
              updateValue("banking_details", event.currentTarget.value)
            }
            autosize
            minRows={3}
          />
        </Box>
      </Paper>

      <Paper withBorder radius="sm" mb="sm">
        <Box px="md" py="xs" bg="gray.1">
          <Text size="sm" fw={600} tt="uppercase">
            Footer
          </Text>
        </Box>
        <Box px="md" py="sm">
          <Textarea
            value={values.footer ?? ""}
            onChange={(event) =>
              updateValue("footer", event.currentTarget.value)
            }
            autosize
            minRows={3}
          />
        </Box>
      </Paper>
    </Stack>
  );
}
