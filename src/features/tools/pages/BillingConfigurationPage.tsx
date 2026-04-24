import { useMemo, useState } from "react";
import { ActionIcon, Button, Modal, Stack, TextInput } from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Add } from "@nine-thirty-five/material-symbols-react/rounded";
import { notifications } from "@mantine/notifications";
import { PageCard } from "@/components/PageCard";
import { toolsQueryKeys } from "../config/queryKeys";
import { ConfigLayout } from "../components/ConfigLayout";
import { ConfigPageHeader } from "../components/ConfigPageHeader";
import { ConfigRowsTable } from "../components/ConfigRowsTable";
import {
  billingConfigsService,
  type BillingConfigResource,
  type BillingConfigType,
} from "../api/billing-configs.service";

export function BillingConfigurationPage() {
  const queryClient = useQueryClient();
  const [activeType, setActiveType] = useState<BillingConfigType | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [label, setLabel] = useState("");

  const { data: billingResponse, isLoading: isBillingLoading } = useQuery({
    queryKey: toolsQueryKeys.billingConfigs,
    queryFn: () => billingConfigsService.getBillingConfigs(),
  });

  const createMutation = useMutation({
    mutationFn: billingConfigsService.createBillingConfig,
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: toolsQueryKeys.billingConfigs });
      const previous = queryClient.getQueryData(toolsQueryKeys.billingConfigs);

      queryClient.setQueryData(
        toolsQueryKeys.billingConfigs,
        (
          current:
            | { data?: Record<BillingConfigType, BillingConfigResource[]> }
            | undefined,
        ) => {
          const optimisticItem: BillingConfigResource = {
            id: Date.now(),
            label: payload.label,
            type: payload.type,
          };

          const nextData = current?.data ?? {
            "RECEIPT CHARGES": [],
            CURRENCY: [],
            UOM: [],
          };

          return {
            ...current,
            data: {
              ...nextData,
              [payload.type]: [
                ...(nextData[payload.type] ?? []),
                optimisticItem,
              ],
            },
          };
        },
      );

      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: toolsQueryKeys.billingConfigs });
      notifications.show({
        title: "Success",
        message: "Billing configuration added",
        color: "teal",
      });
      handleCloseModal();
    },
    onError: (_error, _payload, context) => {
      if (context?.previous) {
        queryClient.setQueryData(toolsQueryKeys.billingConfigs, context.previous);
      }
      notifications.show({
        title: "Error",
        message: "Failed to save billing configuration",
        color: "red",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: { label: string } }) =>
      billingConfigsService.updateBillingConfig(id, payload),
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: toolsQueryKeys.billingConfigs });
      const previous = queryClient.getQueryData(toolsQueryKeys.billingConfigs);

      queryClient.setQueryData(
        toolsQueryKeys.billingConfigs,
        (
          current:
            | { data?: Record<BillingConfigType, BillingConfigResource[]> }
            | undefined,
        ) => {
          if (!current?.data) {
            return current;
          }

          return {
            ...current,
            data: {
              ...current.data,
              "RECEIPT CHARGES": (current.data["RECEIPT CHARGES"] ?? []).map(
                (item) =>
                  item.id === id ? { ...item, label: payload.label } : item,
              ),
              CURRENCY: (current.data.CURRENCY ?? []).map((item) =>
                item.id === id ? { ...item, label: payload.label } : item,
              ),
              UOM: (current.data.UOM ?? []).map((item) =>
                item.id === id ? { ...item, label: payload.label } : item,
              ),
            },
          };
        },
      );

      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: toolsQueryKeys.billingConfigs });
      notifications.show({
        title: "Success",
        message: "Billing configuration updated",
        color: "teal",
      });
      handleCloseModal();
    },
    onError: (_error, _payload, context) => {
      if (context?.previous) {
        queryClient.setQueryData(toolsQueryKeys.billingConfigs, context.previous);
      }
      notifications.show({
        title: "Error",
        message: "Failed to update billing configuration",
        color: "red",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => billingConfigsService.deleteBillingConfig(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: toolsQueryKeys.billingConfigs });
      const previous = queryClient.getQueryData(toolsQueryKeys.billingConfigs);

      queryClient.setQueryData(
        toolsQueryKeys.billingConfigs,
        (
          current:
            | { data?: Record<BillingConfigType, BillingConfigResource[]> }
            | undefined,
        ) => {
          if (!current?.data) {
            return current;
          }

          return {
            ...current,
            data: {
              ...current.data,
              "RECEIPT CHARGES": (current.data["RECEIPT CHARGES"] ?? []).filter(
                (item) => item.id !== id,
              ),
              CURRENCY: (current.data.CURRENCY ?? []).filter(
                (item) => item.id !== id,
              ),
              UOM: (current.data.UOM ?? []).filter((item) => item.id !== id),
            },
          };
        },
      );

      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: toolsQueryKeys.billingConfigs });
      notifications.show({
        title: "Success",
        message: "Billing configuration deleted",
        color: "teal",
      });
    },
    onError: (_error, _payload, context) => {
      if (context?.previous) {
        queryClient.setQueryData(toolsQueryKeys.billingConfigs, context.previous);
      }
      notifications.show({
        title: "Error",
        message: "Failed to delete billing configuration",
        color: "red",
      });
    },
  });
  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const grouped = useMemo(
    () => billingResponse?.data ?? {},
    [billingResponse?.data],
  );

  const groupedRows = useMemo(
    () => ({
      "RECEIPT CHARGES": grouped["RECEIPT CHARGES"] ?? [],
      CURRENCY: grouped.CURRENCY ?? [],
      UOM: grouped.UOM ?? [],
    }),
    [grouped],
  );

  const openCreateModal = (type: BillingConfigType) => {
    setEditingId(null);
    setActiveType(type);
    setLabel("");
  };

  const openEditModal = (item: BillingConfigResource) => {
    setEditingId(item.id);
    setActiveType(item.type);
    setLabel(item.label);
  };

  const handleDelete = (item: BillingConfigResource) => {
    const confirmed = window.confirm(`Delete "${item.label}"?`);
    if (!confirmed) {
      return;
    }

    deleteMutation.mutate(item.id);
  };

  const handleCloseModal = () => {
    setEditingId(null);
    setActiveType(null);
    setLabel("");
  };

  const handleSave = () => {
    if (!activeType || !label.trim()) {
      return;
    }

    if (editingId) {
      updateMutation.mutate({
        id: editingId,
        payload: { label: label.trim() },
      });
      return;
    }

    createMutation.mutate({
      label: label.trim(),
      type: activeType,
    });
  };

  // Helper to get display names for types
  const getTypeDisplay = (type: BillingConfigType | null) => {
    switch (type) {
      case "RECEIPT CHARGES":
        return "Receipt Charge";
      case "CURRENCY":
        return "Currency";
      case "UOM":
        return "Unit of Measure";
      default:
        return "Field";
    }
  };

  // Modal title and label
  const modalTitle = editingId
    ? `Edit ${getTypeDisplay(activeType)}`
    : `Add ${getTypeDisplay(activeType)}`;
  const inputLabel = `${getTypeDisplay(activeType)} Label`;

  return (
    <>
      <ConfigPageHeader title="BILLING CONFIGURATION" />
      <ConfigLayout
        left={
          <PageCard
            title="LIST OF RECEIPT CHARGES"
            bodyPx="md"
            bodyPy="sm"
            hideBackButton
            showDivider
            action={
              <ActionIcon
                color="jltAccent.6"
                onClick={() => openCreateModal("RECEIPT CHARGES")}
                disabled={isMutating}
              >
                <Add />
              </ActionIcon>
            }
          >
            <ConfigRowsTable
              rows={groupedRows["RECEIPT CHARGES"]}
              emptyLabel="receipt charges"
              onEdit={openEditModal}
              onDelete={handleDelete}
              isLoading={isBillingLoading}
              isMutating={isMutating}
            />
          </PageCard>
        }
        rightTop={
          <PageCard
            title="LIST OF CURRENCY"
            bodyPx="md"
            bodyPy="sm"
            hideBackButton
            showDivider
            action={
              <ActionIcon
                color="jltAccent.6"
                onClick={() => openCreateModal("CURRENCY")}
                disabled={isMutating}
              >
                <Add />
              </ActionIcon>
            }
          >
            <ConfigRowsTable
              rows={groupedRows.CURRENCY}
              emptyLabel="currency"
              onEdit={openEditModal}
              onDelete={handleDelete}
              isLoading={isBillingLoading}
              isMutating={isMutating}
            />
          </PageCard>
        }
        rightBottom={
          <PageCard
            title="LIST OF UOM"
            bodyPx="md"
            bodyPy="sm"
            hideBackButton
            showDivider
            action={
              <ActionIcon
                color="jltAccent.6"
                onClick={() => openCreateModal("UOM")}
                disabled={isMutating}
              >
                <Add />
              </ActionIcon>
            }
          >
            <ConfigRowsTable
              rows={groupedRows.UOM}
              emptyLabel="uom"
              onEdit={openEditModal}
              onDelete={handleDelete}
              isLoading={isBillingLoading}
              isMutating={isMutating}
            />
          </PageCard>
        }
      />

      <Modal
        opened={Boolean(activeType)}
        onClose={handleCloseModal}
        title={activeType ? modalTitle : "Add Field"}
        centered
        size="lg"
      >
        <Stack>
          <TextInput
            label={inputLabel}
            value={label}
            onChange={(event) => setLabel(event.currentTarget.value)}
          />

          <Button
            onClick={handleSave}
            loading={createMutation.isPending || updateMutation.isPending}
          >
            Save
          </Button>
        </Stack>
      </Modal>
    </>
  );
}
