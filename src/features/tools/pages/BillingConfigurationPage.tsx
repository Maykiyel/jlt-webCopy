import { useMemo, useState } from "react";
import {
  ActionIcon,
  Box,
  Button,
  Group,
  Modal,
  Stack,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Add,
  ArrowBack,
  Delete,
  Edit,
} from "@nine-thirty-five/material-symbols-react/rounded";
import { notifications } from "@mantine/notifications";
import { PageCard } from "@/components/PageCard";
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

  const grouped = useMemo(() => billingResponse?.data ?? {}, [billingResponse?.data]);

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

  return (
    <>
      <Group mb="md" gap="sm">
        <ActionIcon
          variant="subtle"
          onClick={() => window.history.back()}
          aria-label="Back"
        >
          <ArrowBack width={24} height={24} />
        </ActionIcon>
        <Text fw={700} size="lg" c="jltBlue">
          BILLING CONFIGURATION
        </Text>
      </Group>
      <Box
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          height: "calc(100vh - var(--app-shell-header-height) - 5rem)",
          minWidth: 0,
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        <PageCard
          title="LIST OF RECEIPT CHARGES"
          hideBackButton
          bodyPx="md"
          bodyPy="sm"
          cardStyle={{ height: "100%", minHeight: 0 }}
          action={
            <ActionIcon
              color="jltAccent.6"
              onClick={() => openCreateModal("RECEIPT CHARGES")}
            >
              <Add />
            </ActionIcon>
          }
        >
          {renderRows(groupedRows["RECEIPT CHARGES"], "receipt charges", openEditModal, handleDelete)}
        </PageCard>

        <Box
          style={{
            display: "grid",
            gridTemplateRows: "1fr 1fr",
            gap: "1rem",
            height: "100%",
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          <PageCard
            title="LIST OF CURRENCY"
            hideBackButton
            bodyPx="md"
            bodyPy="sm"
            cardStyle={{ height: "100%", minHeight: 0 }}
            action={
              <ActionIcon color="jltAccent.6" onClick={() => openCreateModal("CURRENCY")}>
                <Add />
              </ActionIcon>
            }
          >
            {renderRows(groupedRows.CURRENCY, "currency", openEditModal, handleDelete)}
          </PageCard>

          <PageCard
            title="LIST OF UOM"
            hideBackButton
            bodyPx="md"
            bodyPy="sm"
            cardStyle={{ height: "100%", minHeight: 0 }}
            action={
              <ActionIcon color="jltAccent.6" onClick={() => openCreateModal("UOM")}>
                <Add />
              </ActionIcon>
            }
          >
            {renderRows(groupedRows.UOM, "uom", openEditModal, handleDelete)}
          </PageCard>
        </Box>
      </Box>

      <Modal
        opened={Boolean(activeType)}
        onClose={handleCloseModal}
        title={activeType ?? "Add Field"}
        centered
        size="lg"
      >
        <Stack>
          <TextInput
            label="FIELD LABEL"
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

function renderRows(
  rows: BillingConfigResource[],
  emptyLabel: string,
  onEdit: (item: BillingConfigResource) => void,
  onDelete: (item: BillingConfigResource) => void,
) {
  return (
    <Table withRowBorders withColumnBorders withTableBorder>
      <Table.Tbody>
        {rows.map((item, index) => (
          <Table.Tr key={item.id}>
            <Table.Td w={56} ta="center">
              {String(index + 1).padStart(2, "0")}
            </Table.Td>
            <Table.Td>{item.label}</Table.Td>
            <Table.Td w={88}>
              <Group gap={8} justify="flex-end" wrap="nowrap">
                <ActionIcon
                  variant="subtle"
                  color="jltAccent.6"
                  onClick={() => onEdit(item)}
                >
                  <Edit width={24} height={24} />
                </ActionIcon>
                <ActionIcon
                  variant="subtle"
                  color="red"
                  onClick={() => onDelete(item)}
                >
                  <Delete width={24} height={24} />
                </ActionIcon>
              </Group>
            </Table.Td>
          </Table.Tr>
        ))}
        {rows.length === 0 && (
          <Table.Tr>
            <Table.Td colSpan={4}>
              <Text c="dimmed" size="sm">
                No {emptyLabel} configs yet.
              </Text>
            </Table.Td>
          </Table.Tr>
        )}
      </Table.Tbody>
    </Table>
  );
}
