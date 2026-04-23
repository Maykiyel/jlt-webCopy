import { useMemo, useState } from "react";
import {
  ActionIcon,
  Button,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Add, Delete } from "@nine-thirty-five/material-symbols-react/rounded";
import { notifications } from "@mantine/notifications";
import { PageCard } from "@/components/PageCard";
import { ConfigLayout } from "../components/ConfigLayout";
import { ConfigPageHeader } from "../components/ConfigPageHeader";
import { ConfigRowsTable } from "../components/ConfigRowsTable";
import {
  detailsConfigsService,
  type DetailConfigOption,
  type DetailConfigResource,
  type DetailConfigType,
} from "../api/details-configs.service";

interface OptionDraft {
  id?: number;
  name: string;
}

export function DetailsConfigurationPage() {
  const queryClient = useQueryClient();
  const [activeType, setActiveType] = useState<DetailConfigType | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [label, setLabel] = useState("");
  const [options, setOptions] = useState<OptionDraft[]>([{ name: "" }]);

  const { data: detailsResponse, isLoading: isDetailsLoading } = useQuery({
    queryKey: ["details-configs"],
    queryFn: () => detailsConfigsService.getDetailsConfigs(),
  });

  const createMutation = useMutation({
    mutationFn: detailsConfigsService.createDetailsConfig,
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ["details-configs"] });
      const previous = queryClient.getQueryData(["details-configs"]);

      queryClient.setQueryData(
        ["details-configs"],
        (current: { data?: Record<DetailConfigType, DetailConfigResource[]> } | undefined) => {
          const optimisticItem: DetailConfigResource = {
            id: Date.now(),
            label: payload.label,
            type: payload.type,
            ...(payload.type === "DROPDOWN" ? { count: payload.options?.length ?? 0 } : {}),
          };

          const nextData = current?.data ?? {
            DROPDOWN: [],
            TEXT: [],
            "DATE PICKER": [],
          };

          return {
            ...current,
            data: {
              ...nextData,
              [payload.type]: [...(nextData[payload.type] ?? []), optimisticItem],
            },
          };
        },
      );

      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["details-configs"] });
      notifications.show({
        title: "Success",
        message: "Details configuration added",
        color: "teal",
      });
      handleCloseModal();
    },
    onError: (_error, _payload, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["details-configs"], context.previous);
      }
      notifications.show({
        title: "Error",
        message: "Failed to save details configuration",
        color: "red",
      });
    },
  });

  const detailsByIdMutation = useMutation({
    mutationFn: (id: number) => detailsConfigsService.getDetailsConfig(id),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: { label: string; options?: DetailConfigOption[] };
    }) => detailsConfigsService.updateDetailsConfig(id, payload),
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: ["details-configs"] });
      const previous = queryClient.getQueryData(["details-configs"]);

      queryClient.setQueryData(
        ["details-configs"],
        (current: { data?: Record<DetailConfigType, DetailConfigResource[]> } | undefined) => {
          if (!current?.data) {
            return current;
          }

          const updateItem = (item: DetailConfigResource) =>
            item.id === id
              ? {
                  ...item,
                  label: payload.label,
                  ...(item.type === "DROPDOWN" && payload.options
                    ? { count: payload.options.length }
                    : {}),
                }
              : item;

          return {
            ...current,
            data: {
              ...current.data,
              DROPDOWN: (current.data.DROPDOWN ?? []).map(updateItem),
              TEXT: (current.data.TEXT ?? []).map(updateItem),
              "DATE PICKER": (current.data["DATE PICKER"] ?? []).map(updateItem),
            },
          };
        },
      );

      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["details-configs"] });
      notifications.show({
        title: "Success",
        message: "Details configuration updated",
        color: "teal",
      });
      handleCloseModal();
    },
    onError: (_error, _payload, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["details-configs"], context.previous);
      }
      notifications.show({
        title: "Error",
        message: "Failed to update details configuration",
        color: "red",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => detailsConfigsService.deleteDetailsConfig(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["details-configs"] });
      const previous = queryClient.getQueryData(["details-configs"]);

      queryClient.setQueryData(
        ["details-configs"],
        (current: { data?: Record<DetailConfigType, DetailConfigResource[]> } | undefined) => {
          if (!current?.data) {
            return current;
          }

          return {
            ...current,
            data: {
              ...current.data,
              DROPDOWN: (current.data.DROPDOWN ?? []).filter((item) => item.id !== id),
              TEXT: (current.data.TEXT ?? []).filter((item) => item.id !== id),
              "DATE PICKER": (current.data["DATE PICKER"] ?? []).filter(
                (item) => item.id !== id,
              ),
            },
          };
        },
      );

      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["details-configs"] });
      notifications.show({
        title: "Success",
        message: "Details configuration deleted",
        color: "teal",
      });
    },
    onError: (_error, _payload, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["details-configs"], context.previous);
      }
      notifications.show({
        title: "Error",
        message: "Failed to delete details configuration",
        color: "red",
      });
    },
  });

  const grouped = useMemo(
    () => detailsResponse?.data ?? {},
    [detailsResponse?.data],
  );

  const groupedRows = useMemo(
    () => ({
      DROPDOWN: grouped.DROPDOWN ?? [],
      TEXT: grouped.TEXT ?? [],
      "DATE PICKER": grouped["DATE PICKER"] ?? [],
    }),
    [grouped],
  );

  const openCreateModal = (type: DetailConfigType) => {
    setEditingId(null);
    setActiveType(type);
    setLabel("");
    setOptions([{ name: "" }]);
  };

  const openEditModal = async (item: DetailConfigResource) => {
    setEditingId(item.id);
    setActiveType(item.type);

    const fallbackOptions = getDropdownOptions(item).map((opt) => ({
      id: opt.id,
      name: opt.name,
    }));

    setLabel(item.label);
    setOptions(fallbackOptions.length > 0 ? fallbackOptions : [{ name: "" }]);

    try {
      const response = await detailsByIdMutation.mutateAsync(item.id);
      setLabel(response.data.label);
      const resolvedOptions = getDropdownOptions(response.data).map((opt) => ({
        id: opt.id,
        name: opt.name,
      }));
      setOptions(resolvedOptions.length > 0 ? resolvedOptions : [{ name: "" }]);
    } catch {
      notifications.show({
        title: "Error",
        message: "Failed to load configuration details",
        color: "red",
      });
    }
  };

  const handleDelete = (item: DetailConfigResource) => {
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
    setOptions([{ name: "" }]);
  };

  const isDropdown = activeType === "DROPDOWN";
  const isMutating =
    createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const handleSave = () => {
    if (!activeType || !label.trim()) {
      return;
    }

    if (editingId) {
      updateMutation.mutate({
        id: editingId,
        payload: {
          label: label.trim(),
          ...(isDropdown
            ? {
                options: options
                  .map((option) => ({
                    ...(option.id ? { id: option.id } : {}),
                    name: option.name.trim(),
                  }))
                  .filter((option) => option.name),
              }
            : {}),
        },
      });
      return;
    }

    createMutation.mutate({
      label: label.trim(),
      type: activeType,
      ...(isDropdown
        ? {
            options: options
              .map((option) => ({ name: option.name.trim() }))
              .filter((option) => option.name),
          }
        : {}),
    });
  };

  const updateOption = (index: number, value: string) => {
    setOptions((prev) =>
      prev.map((option, idx) =>
        idx === index ? { ...option, name: value } : option,
      ),
    );
  };

  const addOption = () => {
    setOptions((prev) => [...prev, { name: "" }]);
  };

  const removeOption = (index: number) => {
    setOptions((prev) => prev.filter((_, idx) => idx !== index));
  };

  return (
    <>
      <ConfigPageHeader title="DETAILS CONFIGURATION" />
      <ConfigLayout
        left={
          <PageCard
            title="DROPDOWN"
            bodyPx="md"
            bodyPy="sm"
            action={
              <ActionIcon
                color="jltAccent.6"
                onClick={() => openCreateModal("DROPDOWN")}
                disabled={isMutating}
              >
                <Add />
              </ActionIcon>
            }
          >
            <ConfigRowsTable
              rows={groupedRows.DROPDOWN}
              emptyLabel="dropdown"
              onEdit={openEditModal}
              onDelete={handleDelete}
              isLoading={isDetailsLoading}
              isMutating={isMutating}
              renderMeta={(item) =>
                item.type === "DROPDOWN" ? (
                  <Text
                    component="span"
                    w={120}
                    c="dimmed"
                    fs="italic"
                    ml="sm"
                  >
                    (
                    {item.count ?? getDropdownOptions(item).length} Options)
                  </Text>
                ) : null
              }
            />
          </PageCard>
        }
        rightTop={
          <PageCard
            title="TEXT FIELD"
            bodyPx="md"
            bodyPy="sm"
            action={
              <ActionIcon
                color="jltAccent.6"
                onClick={() => openCreateModal("TEXT")}
                disabled={isMutating}
              >
                <Add />
              </ActionIcon>
            }
          >
            <ConfigRowsTable
              rows={groupedRows.TEXT}
              emptyLabel="text field"
              onEdit={openEditModal}
              onDelete={handleDelete}
              isLoading={isDetailsLoading}
              isMutating={isMutating}
            />
          </PageCard>
        }
        rightBottom={
          <PageCard
            title="DATE PICKER"
            bodyPx="md"
            bodyPy="sm"
            action={
              <ActionIcon
                color="jltAccent.6"
                onClick={() => openCreateModal("DATE PICKER")}
                disabled={isMutating}
              >
                <Add />
              </ActionIcon>
            }
          >
            <ConfigRowsTable
              rows={groupedRows["DATE PICKER"]}
              emptyLabel="date picker"
              onEdit={openEditModal}
              onDelete={handleDelete}
              isLoading={isDetailsLoading}
              isMutating={isMutating}
            />
          </PageCard>
        }
      />

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

          {isDropdown && (
            <Stack gap="xs">
              <Group justify="space-between">
                <Text fw={600}>OPTIONS</Text>
                <ActionIcon onClick={addOption} color="jltAccent.6">
                  <Add />
                </ActionIcon>
              </Group>
              {options.map((option, index) => (
                <Group key={`option-${index}`} align="center">
                  <TextInput
                    value={option.name}
                    onChange={(event) =>
                      updateOption(index, event.currentTarget.value)
                    }
                    style={{ flex: 1 }}
                    placeholder={`Option ${index + 1}`}
                  />
                  <ActionIcon
                    color="red"
                    variant="subtle"
                    onClick={() => removeOption(index)}
                    disabled={options.length === 1}
                  >
                    <Delete />
                  </ActionIcon>
                </Group>
              ))}
            </Stack>
          )}

          <Button
            onClick={handleSave}
            loading={
              createMutation.isPending ||
              updateMutation.isPending ||
              detailsByIdMutation.isPending
            }
          >
            Save
          </Button>
        </Stack>
      </Modal>
    </>
  );
}

function getDropdownOptions(item: DetailConfigResource): DetailConfigOption[] {
  return item.dropdown_options ?? item.dropdownOptions ?? [];
}
