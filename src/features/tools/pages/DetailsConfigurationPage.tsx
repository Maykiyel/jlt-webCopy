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
  useQueries,
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

  const { data: detailsResponse } = useQuery({
    queryKey: ["details-configs"],
    queryFn: () => detailsConfigsService.getDetailsConfigs(),
  });

  const createMutation = useMutation({
    mutationFn: detailsConfigsService.createDetailsConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["details-configs"] });
      notifications.show({
        title: "Success",
        message: "Details configuration added",
        color: "teal",
      });
      handleCloseModal();
    },
    onError: () => {
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["details-configs"] });
      notifications.show({
        title: "Success",
        message: "Details configuration updated",
        color: "teal",
      });
      handleCloseModal();
    },
    onError: () => {
      notifications.show({
        title: "Error",
        message: "Failed to update details configuration",
        color: "red",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => detailsConfigsService.deleteDetailsConfig(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["details-configs"] });
      notifications.show({
        title: "Success",
        message: "Details configuration deleted",
        color: "teal",
      });
    },
    onError: () => {
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

  const dropdownIds = useMemo(
    () => groupedRows.DROPDOWN.map((item) => item.id),
    [groupedRows.DROPDOWN],
  );

  const dropdownDetailQueries = useQueries({
    queries: dropdownIds.map((id) => ({
      queryKey: ["details-config", id],
      queryFn: () => detailsConfigsService.getDetailsConfig(id),
      staleTime: 60_000,
    })),
  });

  const dropdownOptionCountById = useMemo(() => {
    const counts: Record<number, number> = {};

    groupedRows.DROPDOWN.forEach((row) => {
      counts[row.id] = getDropdownOptions(row).length;
    });

    dropdownDetailQueries.forEach((query, index) => {
      const itemId = dropdownIds[index];
      if (!itemId || !query.data?.data) {
        return;
      }

      counts[itemId] = getDropdownOptions(query.data.data).length;
    });

    return counts;
  }, [dropdownDetailQueries, dropdownIds, groupedRows.DROPDOWN]);

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
                    {dropdownOptionCountById[item.id] ??
                      getDropdownOptions(item).length}{" "}
                    Options)
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
