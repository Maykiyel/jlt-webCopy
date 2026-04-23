import { useMemo, useState } from "react";
import {
  ActionIcon,
  Button,
  Modal,
  Stack,
  TextInput,
} from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Add } from "@nine-thirty-five/material-symbols-react/rounded";
import { notifications } from "@mantine/notifications";
import { PageCard } from "@/components/PageCard";
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

  const { data: billingResponse } = useQuery({
    queryKey: ["billing-configs"],
    queryFn: () => billingConfigsService.getBillingConfigs(),
  });

  const createMutation = useMutation({
    mutationFn: billingConfigsService.createBillingConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billing-configs"] });
      notifications.show({
        title: "Success",
        message: "Billing configuration added",
        color: "teal",
      });
      handleCloseModal();
    },
    onError: () => {
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billing-configs"] });
      notifications.show({
        title: "Success",
        message: "Billing configuration updated",
        color: "teal",
      });
      handleCloseModal();
    },
    onError: () => {
      notifications.show({
        title: "Error",
        message: "Failed to update billing configuration",
        color: "red",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => billingConfigsService.deleteBillingConfig(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billing-configs"] });
      notifications.show({
        title: "Success",
        message: "Billing configuration deleted",
        color: "teal",
      });
    },
    onError: () => {
      notifications.show({
        title: "Error",
        message: "Failed to delete billing configuration",
        color: "red",
      });
    },
  });

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
            action={
              <ActionIcon
                color="jltAccent.6"
                onClick={() => openCreateModal("RECEIPT CHARGES")}
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
            />
          </PageCard>
        }
        rightTop={
          <PageCard
            title="LIST OF CURRENCY"
            bodyPx="md"
            bodyPy="sm"
            action={
              <ActionIcon
                color="jltAccent.6"
                onClick={() => openCreateModal("CURRENCY")}
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
            />
          </PageCard>
        }
        rightBottom={
          <PageCard
            title="LIST OF UOM"
            bodyPx="md"
            bodyPy="sm"
            action={
              <ActionIcon
                color="jltAccent.6"
                onClick={() => openCreateModal("UOM")}
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
