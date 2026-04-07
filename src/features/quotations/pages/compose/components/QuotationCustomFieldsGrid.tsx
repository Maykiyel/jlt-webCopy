import { SimpleGrid } from "@mantine/core";
import { TextInputField } from "@/components/form/textFields";
import { NativeSelectField } from "@/components/form/selectFields";
import type { Control } from "react-hook-form";
import type { QuotationDetailsValues } from "@/features/quotations/schemas/compose.schema";
import type { QuotationTemplate } from "@/features/quotations/types/compose.types";

interface QuotationCustomFieldsGridProps {
  template: QuotationTemplate;
  control: Control<QuotationDetailsValues>;
}

export function QuotationCustomFieldsGrid({
  template,
  control,
}: QuotationCustomFieldsGridProps) {
  if (template.custom_fields.length === 0) {
    return null;
  }

  return (
    <SimpleGrid cols={2} spacing="md">
      {template.custom_fields.map((field) =>
        field.type === "select" ? (
          <NativeSelectField
            key={field.id}
            control={control}
            name={`custom_fields.${field.id}`}
            label={field.label.toUpperCase()}
            data={["", ...(field.options ?? [])]}
          />
        ) : (
          <TextInputField
            key={field.id}
            control={control}
            name={`custom_fields.${field.id}`}
            label={field.label.toUpperCase()}
          />
        ),
      )}
    </SimpleGrid>
  );
}
