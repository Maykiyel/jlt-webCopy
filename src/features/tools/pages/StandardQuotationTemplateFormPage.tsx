import { Stack, Text } from "@mantine/core";
import { PageCard } from "@/components/PageCard";

interface StandardQuotationTemplateFormPageProps {
  mode: "create" | "edit";
}

export function StandardQuotationTemplateFormPage({
  mode,
}: StandardQuotationTemplateFormPageProps) {
  const title =
    mode === "create"
      ? "Create Standard Quotation Template"
      : "Edit Standard Quotation Template";

  return (
    <PageCard title={title} fullHeight>
      <Stack gap="sm">
        <Text size="sm" c="dimmed">
          Standard quotation template form details will be added in the next
          update.
        </Text>
      </Stack>
    </PageCard>
  );
}
