import { SimpleGrid } from "@mantine/core";
import { TextInputField } from "@/components/form/textFields";
import { SelectField } from "@/components/form/selectFields";
import { DateInputField } from "@/components/form/valueFields";
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
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
      {template.custom_fields.map((field) => {
        if (field.type === "select") {
          return (
            <SelectField
              key={field.id}
              control={control}
              name={`custom_fields.${field.id}`}
              label={field.label.toUpperCase()}
              placeholder={`Select ${field.label}`}
              data={field.options ?? []}
            />
          );
        }

        if (field.type === "date") {
          return (
            <DateInputField
              key={field.id}
              control={control}
              name={`custom_fields.${field.id}`}
              label={field.label.toUpperCase()}
              placeholder="MM/DD/YYYY"
              valueFormat="MM/DD/YYYY"
              clearable
            />
          );
        }

        return (
          <TextInputField
            key={field.id}
            control={control}
            name={`custom_fields.${field.id}`}
            label={field.label.toUpperCase()}
          />
        );
      })}
    </SimpleGrid>
  );
}
