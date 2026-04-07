import { Box, Stack, Text } from "@mantine/core";
import type { TermsValues } from "@/features/quotations/schemas/compose.schema";

interface QuotationPreviewTermsBlocksProps {
  terms: TermsValues;
}

export function QuotationPreviewTermsBlocks({
  terms,
}: QuotationPreviewTermsBlocksProps) {
  return (
    <Stack gap="md" mb="xl">
      {terms.policies && (
        <Box>
          <Text size="xs" fw={700} tt="uppercase" mb={4}>
            Policies
          </Text>
          <Text size="xs" style={{ whiteSpace: "pre-wrap" }}>
            {terms.policies}
          </Text>
        </Box>
      )}
      {terms.terms_and_condition && (
        <Box>
          <Text size="xs" fw={700} tt="uppercase" mb={4}>
            Terms and Conditions
          </Text>
          <Text size="xs" style={{ whiteSpace: "pre-wrap" }}>
            {terms.terms_and_condition}
          </Text>
        </Box>
      )}
      {terms.banking_details && (
        <Box>
          <Text size="xs" fw={700} tt="uppercase" mb={4}>
            Banking Details
          </Text>
          <Text size="xs" style={{ whiteSpace: "pre-wrap" }}>
            {terms.banking_details}
          </Text>
        </Box>
      )}
    </Stack>
  );
}
