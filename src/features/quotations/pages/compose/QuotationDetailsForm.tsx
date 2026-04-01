import { zodResolver } from "@hookform/resolvers/zod";
import { Group, Select, SimpleGrid, Stack, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  NativeSelectField,
  TextInputField,
  TextareaField,
} from "@/components/form";
import { PLACEHOLDER_MESSAGE_TEMPLATES } from "@/features/quotations/data/composePlaceholders";
import {
  quotationDetailsSchema,
  type QuotationDetailsValues,
} from "@/features/quotations/schemas/compose.schema";
import type { QuotationTemplate } from "@/features/quotations/types/compose.types";

interface QuotationDetailsFormProps {
  id: string;
  template: QuotationTemplate;
  defaultValues?: Partial<QuotationDetailsValues>;
  onSubmit: (values: QuotationDetailsValues) => void;
  onValidityChange?: (isValid: boolean) => void;
}

export function QuotationDetailsForm({
  id,
  template,
  defaultValues,
  onSubmit,
  onValidityChange,
}: QuotationDetailsFormProps) {
  // TODO: replace with useQuery when GET /message-templates is available
  const messageTemplates = PLACEHOLDER_MESSAGE_TEMPLATES;
  const [selectedMessageTemplateId, setSelectedMessageTemplateId] = useState<
    string | null
  >(null);

  const { control, handleSubmit, setValue, formState } =
    useForm<QuotationDetailsValues>({
      resolver: zodResolver(quotationDetailsSchema),
      mode: "onChange",
      defaultValues: defaultValues ?? {},
    });

  useEffect(() => {
    onValidityChange?.(formState.isValid);
  }, [formState.isValid, onValidityChange]);

  return (
    <form id={id} onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack gap="md" mt="md">
        {template.custom_fields.length > 0 && (
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
        )}

        <TextInputField control={control} name="subject" label="SUBJECT" />

        <div>
          <Group justify="space-between" mb="xs">
            <Text size="sm" fw={500}>
              MESSAGE
            </Text>
            <Select
              aria-label="Select message template"
              placeholder="Select message template"
              value={selectedMessageTemplateId}
              onChange={(templateId) => {
                setSelectedMessageTemplateId(templateId);

                if (!templateId) return;

                const selectedTemplate = messageTemplates.find(
                  (messageTemplate) => messageTemplate.id === templateId,
                );

                if (!selectedTemplate) return;

                setValue("message", selectedTemplate.content, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }}
              data={messageTemplates.map((messageTemplate) => ({
                value: messageTemplate.id,
                label: messageTemplate.label,
              }))}
              w={220}
            />
          </Group>

          <TextareaField
            control={control}
            name="message"
            minRows={6}
            autosize
          />
        </div>
      </Stack>
    </form>
  );
}
