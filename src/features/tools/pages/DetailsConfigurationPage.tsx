import { useMemo, useState } from "react";
import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Group,
  Modal,
  Stack,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Add, Delete, Edit } from "@nine-thirty-five/material-symbols-react/rounded";
import { notifications } from "@mantine/notifications";
import { PageCard } from "@/components/PageCard";
import {
  detailsConfigsService,
  type DetailConfigOption,
  type DetailConfigResource,
  type DetailConfigType,
} from "../api/details-configs.service";

interface ConfigCardMeta {
  title: string;
  type: DetailConfigType;
}

interface OptionDraft {
  id?: number;
  name: string;
}

const CONFIG_CARDS: ConfigCardMeta[] = [
  { title: "DROPDOWN", type: "DROPDOWN" },
  { title: "TEXT FIELD", type: "TEXT" },
  { title: "DATE PICKER", type: "DATE PICKER" },
];

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
    mutationFn: ({ id, payload }: { id: number; payload: { label: string; options?: DetailConfigOption[] } }) =>
      detailsConfigsService.updateDetailsConfig(id, payload),
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

  const grouped = useMemo(() => detailsResponse?.data ?? {}, [detailsResponse?.data]);

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
        ? { options: options.map((option) => option.name.trim()).filter(Boolean) }
        : {}),
    });
  };

  const updateOption = (index: number, value: string) => {
    setOptions((prev) =>
      prev.map((option, idx) => (idx === index ? { ...option, name: value } : option)),
    );
  };

  const addOption = () => {
    setOptions((prev) => [...prev, { name: "" }]);
  };

  const removeOption = (index: number) => {
    setOptions((prev) => prev.filter((_, idx) => idx !== index));
  };

  return (
    <Box>
      <Group align="stretch" grow>
        {CONFIG_CARDS.map((card) => (
          <PageCard
            key={card.type}
            title={card.title}
            hideBackButton
            bodyPx="md"
            bodyPy="sm"
            action={
              <ActionIcon color="jltBlue.6" onClick={() => openCreateModal(card.type)}>
                <Add />
              </ActionIcon>
            }
          >
            <Divider mb="sm" />

            <Table withRowBorders>
              <Table.Tbody>
                {groupedRows[card.type].map((item, index) => (
                  <Table.Tr key={item.id}>
                    <Table.Td w={56}>{String(index + 1).padStart(2, "0")}</Table.Td>
                    <Table.Td>{item.label}</Table.Td>
                    <Table.Td w={120} c="dimmed" fs="italic">
                      {card.type === "DROPDOWN"
                        ? `(${getDropdownOptions(item).length} Options)`
                        : ""}
                    </Table.Td>
                    <Table.Td w={88}>
                      <Group gap={8} justify="flex-end" wrap="nowrap">
                        <ActionIcon variant="subtle" color="jltBlue.7" onClick={() => openEditModal(item)}>
                          <Edit width={16} height={16} />
                        </ActionIcon>
                        <ActionIcon variant="subtle" color="red" onClick={() => handleDelete(item)}>
                          <Delete width={16} height={16} />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
                {groupedRows[card.type].length === 0 && (
                  <Table.Tr>
                    <Table.Td colSpan={4}>
                      <Text c="dimmed" size="sm">
                        No {card.title.toLowerCase()} configs yet.
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </PageCard>
        ))}
      </Group>

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
                <ActionIcon onClick={addOption} color="jltBlue.6">
                  <Add />
                </ActionIcon>
              </Group>
              {options.map((option, index) => (
                <Group key={`option-${index}`} align="end">
                  <TextInput
                    value={option.name}
                    onChange={(event) => updateOption(index, event.currentTarget.value)}
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
    </Box>
  );
}

function getDropdownOptions(item: DetailConfigResource): DetailConfigOption[] {
  return item.dropdown_options ?? item.dropdownOptions ?? [];
}
