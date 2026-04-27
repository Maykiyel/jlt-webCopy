import {
  ActionIcon,
  Box,
  Checkbox,
  Group,
  MultiSelect,
  Paper,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Add, Delete, Save } from "@nine-thirty-five/material-symbols-react/rounded";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { PageCard } from "@/components/PageCard";
import { AppButton } from "@/components/ui/AppButton";
import type { QuotationTemplateResource, ServiceType, StoreTemplateRequest } from "@/types/templates";
import { billingConfigsService } from "../api/billing-configs.service";
import { detailsConfigsService } from "../api/details-configs.service";
import { quotationFieldsService } from "../api/quotation-fields.service";
import { templatesService } from "../api/templates.service";
import { toolsQueryKeys } from "../config/queryKeys";

type TemplateChargeDraft = {
  key: number;
  name: string;
  receipt_option_ids: string[];
};

const INITIAL_CHARGE_KEY = 1;

interface TemplateFormPageProps {
  serviceType: ServiceType;
}

const SERVICE_LABELS: Record<ServiceType, string> = {
  REGULATORY: "Regulatory Services",
  LOGISTICS: "Logistics Services",
};

export function TemplateFormPage({ serviceType }: TemplateFormPageProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [selectedDetailIds, setSelectedDetailIds] = useState<number[]>([]);
  const [selectedFieldIds, setSelectedFieldIds] = useState<number[]>([]);
  const [charges, setCharges] = useState<TemplateChargeDraft[]>([
    { key: INITIAL_CHARGE_KEY, name: "", receipt_option_ids: [] },
  ]);
  const [nextChargeKey, setNextChargeKey] = useState(INITIAL_CHARGE_KEY + 1);

  const { data: detailsResponse } = useQuery({
    queryKey: toolsQueryKeys.detailsConfigs,
    queryFn: () => detailsConfigsService.getDetailsConfigs(),
  });

  const { data: billingResponse } = useQuery({
    queryKey: toolsQueryKeys.billingConfigs,
    queryFn: () => billingConfigsService.getBillingConfigs(),
  });

  const { data: fieldsResponse } = useQuery({
    queryKey: toolsQueryKeys.quotationFields(serviceType),
    queryFn: () => quotationFieldsService.getQuotationFields(serviceType),
  });

  const createMutation = useMutation({
    mutationFn: (payload: StoreTemplateRequest) => templatesService.createTemplate(payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: toolsQueryKeys.templates });

      const previousTemplates = queryClient.getQueryData(toolsQueryKeys.templates);
      const optimisticTemplate: QuotationTemplateResource = {
        id: Date.now(),
        name: payload.name,
        service_type: payload.service_type,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      queryClient.setQueryData(
        toolsQueryKeys.templates,
        (current: { data?: QuotationTemplateResource[] } | undefined) => ({
          ...current,
          data: [...(current?.data ?? []), optimisticTemplate],
        }),
      );

      return { previousTemplates };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: toolsQueryKeys.templates });
      notifications.show({
        title: "Success",
        message: "Template created successfully",
        color: "teal",
      });
      navigate("/tools/templates");
    },
    onError: (_error, _payload, context) => {
      queryClient.setQueryData(toolsQueryKeys.templates, context?.previousTemplates);
      notifications.show({
        title: "Error",
        message: "Failed to create template",
        color: "red",
      });
    },
  });

  const detailConfigs = useMemo(
    () => [
      ...(detailsResponse?.data?.DROPDOWN ?? []),
      ...(detailsResponse?.data?.["DATE PICKER"] ?? []),
      ...(detailsResponse?.data?.TEXT ?? []),
    ],
    [detailsResponse?.data],
  );

  const receiptOptions = useMemo(
    () =>
      (billingResponse?.data?.["RECEIPT CHARGES"] ?? []).map((option) => ({
        value: String(option.id),
        label: option.label,
      })),
    [billingResponse?.data],
  );

  const quotationFields = useMemo(
    () => fieldsResponse?.data ?? [],
    [fieldsResponse?.data],
  );

  const canSave =
    name.trim().length > 0 &&
    selectedDetailIds.length > 0 &&
    selectedFieldIds.length > 0 &&
    charges.length > 0 &&
    charges.every(
      (charge) => charge.name.trim().length > 0 && charge.receipt_option_ids.length > 0,
    );

  const handleDetailToggle = (id: number, checked: boolean) => {
    setSelectedDetailIds((prev) =>
      checked ? [...prev, id] : prev.filter((itemId) => itemId !== id),
    );
  };

  const handleFieldToggle = (id: number, checked: boolean) => {
    setSelectedFieldIds((prev) =>
      checked ? [...prev, id] : prev.filter((itemId) => itemId !== id),
    );
  };

  const handleAddCharge = () => {
    setCharges((prev) => [
      ...prev,
      { key: nextChargeKey, name: "", receipt_option_ids: [] },
    ]);
    setNextChargeKey((prev) => prev + 1);
  };

  const handleChargeChange = (
    key: number,
    updates: Partial<Pick<TemplateChargeDraft, "name" | "receipt_option_ids">>,
  ) => {
    setCharges((prev) =>
      prev.map((charge) => (charge.key === key ? { ...charge, ...updates } : charge)),
    );
  };

  const handleDeleteCharge = (key: number) => {
    setCharges((prev) => prev.filter((charge) => charge.key !== key));
  };

  const handleSave = () => {
    const payload: StoreTemplateRequest = {
      name: name.trim(),
      service_type: serviceType,
      detail_config_ids: selectedDetailIds,
      quotation_field_ids: selectedFieldIds,
      template_charges: charges.map((charge) => ({
        name: charge.name.trim(),
        receipt_option_ids: charge.receipt_option_ids.map(Number),
      })),
    };

    createMutation.mutate(payload);
  };

  return (
    <PageCard title={`Create Template (${SERVICE_LABELS[serviceType]})`} fullHeight>
      <Stack gap="md" mt="md">
        <Group justify="space-between" align="flex-end">
          <TextInput
            value={name}
            onChange={(event) => setName(event.currentTarget.value)}
            placeholder="TEMPLATE NAME"
            maw={520}
            style={{ flex: 1 }}
          />
          <AppButton
            onClick={handleSave}
            disabled={!canSave}
            loading={createMutation.isPending}
            icon={Save}
            w="10rem"
            h="2.6rem"
          >
            SAVE
          </AppButton>
        </Group>

        <Group align="stretch" grow>
          <Paper withBorder radius="sm" p="md">
            <Text fw={600} mb="sm">
              QUOTATION DETAILS
            </Text>

            <Stack gap="md">
              <Box>
                <Text size="sm" fw={600} mb="xs">
                  Detail Configurations
                </Text>
                <Stack gap={6}>
                  {detailConfigs.map((config) => (
                    <Checkbox
                      key={config.id}
                      label={config.label}
                      checked={selectedDetailIds.includes(config.id)}
                      onChange={(event) =>
                        handleDetailToggle(config.id, event.currentTarget.checked)
                      }
                    />
                  ))}
                </Stack>
              </Box>

              <Box>
                <Text size="sm" fw={600} mb="xs">
                  From Client Inputs/Information
                </Text>
                <Stack gap={6}>
                  {quotationFields.map((field) => (
                    <Checkbox
                      key={field.id}
                      label={field.display_name}
                      checked={selectedFieldIds.includes(field.id)}
                      onChange={(event) =>
                        handleFieldToggle(field.id, event.currentTarget.checked)
                      }
                    />
                  ))}
                </Stack>
              </Box>
            </Stack>
          </Paper>

          <Paper withBorder radius="sm" p="md">
            <Group justify="space-between" mb="sm">
              <Text fw={600}>BILLING DETAILS</Text>
              <ActionIcon color="jltAccent.6" onClick={handleAddCharge}>
                <Add />
              </ActionIcon>
            </Group>

            <Stack gap="sm">
              {charges.map((charge) => (
                <Paper key={charge.key} withBorder p="sm" radius="sm">
                  <Group align="flex-start" wrap="nowrap">
                    <Stack style={{ flex: 1 }} gap={8}>
                      <TextInput
                        placeholder="TABLE NAME"
                        value={charge.name}
                        onChange={(event) =>
                          handleChargeChange(charge.key, {
                            name: event.currentTarget.value,
                          })
                        }
                      />
                      <MultiSelect
                        placeholder="SELECT RECEIPT CHARGES"
                        data={receiptOptions}
                        value={charge.receipt_option_ids}
                        onChange={(value) =>
                          handleChargeChange(charge.key, {
                            receipt_option_ids: value,
                          })
                        }
                        searchable
                      />
                    </Stack>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      mt={4}
                      onClick={() => handleDeleteCharge(charge.key)}
                      disabled={charges.length === 1}
                    >
                      <Delete />
                    </ActionIcon>
                  </Group>
                </Paper>
              ))}
            </Stack>
          </Paper>
        </Group>
      </Stack>
    </PageCard>
  );
}
