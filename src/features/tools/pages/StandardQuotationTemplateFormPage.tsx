import { Box, Paper, Stack, Text, TextInput } from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { Save } from "@nine-thirty-five/material-symbols-react/rounded";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { LabeledTextareaSection } from "@/components/LabeledTextareaSection";
import { PageCard } from "@/components/PageCard";
import { AppButton } from "@/components/ui/AppButton";
import {
  standardTemplatesService,
  type StandardTemplateSummaryResource,
  type StoreStandardTemplateRequest,
} from "../api/standard-templates.service";

interface StandardQuotationTemplateFormPageProps {
  mode: "create" | "edit";
}

type FormFieldKey =
  | "policies"
  | "terms_and_conditions"
  | "banking_details"
  | "footer";

const FORM_FIELDS: Array<{ key: FormFieldKey; label: string }> = [
  { key: "policies", label: "Policies" },
  { key: "terms_and_conditions", label: "Terms and Condition" },
  { key: "banking_details", label: "Banking Details" },
  { key: "footer", label: "Footer" },
];

const EMPTY_FORM: StoreStandardTemplateRequest = {
  template_name: "",
  policies: "",
  terms_and_conditions: "",
  banking_details: "",
  footer: "",
};

const MAX_TEXT_LENGTH = 255;

export function StandardQuotationTemplateFormPage({
  mode,
}: StandardQuotationTemplateFormPageProps) {
  const navigate = useNavigate();
  const { templateId } = useParams<{ templateId: string }>();
  const queryClient = useQueryClient();
  const isEditMode = mode === "edit";

  const [draftValues, setDraftValues] = useState<StoreStandardTemplateRequest | null>(
    null,
  );

  const { data: templateResponse, isLoading: isTemplateLoading } = useQuery({
    queryKey: ["standard-template", templateId],
    queryFn: () => standardTemplatesService.getStandardTemplate(Number(templateId)),
    enabled: isEditMode && Boolean(templateId),
  });

  const loadedValues: StoreStandardTemplateRequest | null = templateResponse?.data
    ? {
        template_name: templateResponse.data.template_name,
        policies: templateResponse.data.policies,
        terms_and_conditions: templateResponse.data.terms_and_conditions,
        banking_details: templateResponse.data.banking_details,
        footer: templateResponse.data.footer,
      }
    : null;

  const values = draftValues ?? loadedValues ?? EMPTY_FORM;

  const createMutation = useMutation({
    mutationFn: (payload: StoreStandardTemplateRequest) =>
      standardTemplatesService.createStandardTemplate(payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ["standard-templates"] });

      const previousTemplates = queryClient.getQueryData([
        "standard-templates",
      ]) as { data?: StandardTemplateSummaryResource[] } | undefined;

      const optimisticItem: StandardTemplateSummaryResource = {
        id: Date.now(),
        template_name: payload.template_name,
      };

      queryClient.setQueryData(
        ["standard-templates"],
        (current: { data?: StandardTemplateSummaryResource[] } | undefined) => ({
          ...current,
          data: [...(current?.data ?? []), optimisticItem],
        }),
      );

      return { previousTemplates };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["standard-templates"] });
      notifications.show({
        title: "Success",
        message: "Standard quotation template created successfully",
        color: "teal",
      });
      navigate("/tools/templates/config/standard-quotation-template");
    },
    onError: (_error, _payload, context) => {
      if (context?.previousTemplates) {
        queryClient.setQueryData(["standard-templates"], context.previousTemplates);
      }

      notifications.show({
        title: "Error",
        message: "Failed to create standard quotation template",
        color: "red",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: StoreStandardTemplateRequest) =>
      standardTemplatesService.updateStandardTemplate(Number(templateId), payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ["standard-templates"] });
      await queryClient.cancelQueries({ queryKey: ["standard-template", templateId] });

      const previousTemplates = queryClient.getQueryData([
        "standard-templates",
      ]) as { data?: StandardTemplateSummaryResource[] } | undefined;
      const previousTemplate = queryClient.getQueryData([
        "standard-template",
        templateId,
      ]);

      queryClient.setQueryData(
        ["standard-templates"],
        (current: { data?: StandardTemplateSummaryResource[] } | undefined) => ({
          ...current,
          data: (current?.data ?? []).map((item) =>
            String(item.id) === String(templateId)
              ? { ...item, template_name: payload.template_name }
              : item,
          ),
        }),
      );

      queryClient.setQueryData(
        ["standard-template", templateId],
        (current:
          | { data?: StoreStandardTemplateRequest & { id?: number } }
          | undefined) => ({
          ...current,
          data: {
            ...(current?.data ?? {}),
            ...payload,
          },
        }),
      );

      return { previousTemplates, previousTemplate };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["standard-templates"] });
      queryClient.invalidateQueries({ queryKey: ["standard-template", templateId] });
      notifications.show({
        title: "Success",
        message: "Standard quotation template updated successfully",
        color: "teal",
      });
      navigate("/tools/templates/config/standard-quotation-template");
    },
    onError: (_error, _payload, context) => {
      if (context?.previousTemplates) {
        queryClient.setQueryData(["standard-templates"], context.previousTemplates);
      }

      if (context?.previousTemplate) {
        queryClient.setQueryData(
          ["standard-template", templateId],
          context.previousTemplate,
        );
      }

      notifications.show({
        title: "Error",
        message: "Failed to update standard quotation template",
        color: "red",
      });
    },
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const title =
    mode === "create"
      ? "Create Standard Quotation Template"
      : "Edit Standard Quotation Template";

  const canSave = useMemo(
    () =>
      values.template_name.trim() &&
      values.policies.trim() &&
      values.terms_and_conditions.trim() &&
      values.banking_details.trim() &&
      values.footer.trim() &&
      values.template_name.length <= MAX_TEXT_LENGTH &&
      values.footer.length <= MAX_TEXT_LENGTH,
    [values],
  );

  const updateField = <T extends keyof StoreStandardTemplateRequest>(
    field: T,
    value: StoreStandardTemplateRequest[T],
  ) => {
    setDraftValues((prev) => ({ ...(prev ?? values), [field]: value }));
  };

  const handleSave = () => {
    const payload: StoreStandardTemplateRequest = {
      template_name: values.template_name.trim(),
      policies: values.policies.trim(),
      terms_and_conditions: values.terms_and_conditions.trim(),
      banking_details: values.banking_details.trim(),
      footer: values.footer.trim(),
    };

    if (isEditMode) {
      updateMutation.mutate(payload);
      return;
    }

    createMutation.mutate(payload);
  };

  return (
    <PageCard title={title} fullHeight>
      <Stack gap="sm" mt="md">
        <Paper withBorder radius="sm" mb="sm">
          <Box px="md" py="xs" bg="gray.1">
            <Text size="sm" fw={600} tt="uppercase">
              Template Name
            </Text>
          </Box>
          <Box px="md" py="sm">
            <TextInput
              value={values.template_name}
              onChange={(event) =>
                updateField("template_name", event.currentTarget.value)
              }
              placeholder="Enter template name"
              disabled={isTemplateLoading || isSaving}
              maxLength={MAX_TEXT_LENGTH}
              styles={{ input: { border: 0, background: "transparent" } }}
            />
            <Text size="xs" c="dimmed" ta="right" mt={4}>
              {values.template_name.length}/{MAX_TEXT_LENGTH}
            </Text>
          </Box>
        </Paper>

        {FORM_FIELDS.map(({ key, label }) => (
          <Box key={key}>
            <LabeledTextareaSection
              label={label}
              value={values[key]}
              onChange={(nextValue) => updateField(key, nextValue)}
              mode="edit"
              maxLength={key === "footer" ? MAX_TEXT_LENGTH : undefined}
            />
            {key === "footer" && (
              <Text size="xs" c="dimmed" ta="right" mt={-8} mb="sm">
                {values.footer.length}/{MAX_TEXT_LENGTH}
              </Text>
            )}
          </Box>
        ))}

        <AppButton
          onClick={handleSave}
          loading={isSaving}
          disabled={!canSave || isTemplateLoading}
          icon={Save}
          w="9rem"
          h="2.625rem"
          style={{ alignSelf: "center", marginTop: "0.25rem" }}
        >
          SAVE
        </AppButton>
      </Stack>
    </PageCard>
  );
}
