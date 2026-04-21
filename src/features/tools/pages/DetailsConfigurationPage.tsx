import { useMemo, useState } from "react";
import {
  ActionIcon,
  Button,
  Card,
  Divider,
  Group,
  Modal,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Add, Delete } from "@nine-thirty-five/material-symbols-react/rounded";
import { notifications } from "@mantine/notifications";
import { PageCard } from "@/components/PageCard";
import {
  detailsConfigsService,
  type DetailConfigResource,
  type DetailConfigType,
} from "../api/details-configs.service";

interface ConfigCardMeta {
  title: string;
  type: DetailConfigType;
}

const CONFIG_CARDS: ConfigCardMeta[] = [
  { title: "DROPDOWN", type: "DROPDOWN" },
  { title: "TEXT FIELD", type: "TEXT" },
  { title: "DATE PICKER", type: "DATE PICKER" },
];

export function DetailsConfigurationPage() {
  const queryClient = useQueryClient();
  const [activeType, setActiveType] = useState<DetailConfigType | null>(null);
  const [label, setLabel] = useState("");
  const [options, setOptions] = useState<string[]>([""]);

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
    setActiveType(type);
    setLabel("");
    setOptions([""]);
  };

  const handleCloseModal = () => {
    setActiveType(null);
    setLabel("");
    setOptions([""]);
  };

  const isDropdown = activeType === "DROPDOWN";

  const handleSave = () => {
    if (!activeType || !label.trim()) {
      return;
    }

    createMutation.mutate({
      label: label.trim(),
      type: activeType,
      ...(isDropdown
        ? { options: options.map((option) => option.trim()).filter(Boolean) }
        : {}),
    });
  };

  const updateOption = (index: number, value: string) => {
    setOptions((prev) => prev.map((option, idx) => (idx === index ? value : option)));
  };

  const addOption = () => {
    setOptions((prev) => [...prev, ""]);
  };

  const removeOption = (index: number) => {
    setOptions((prev) => prev.filter((_, idx) => idx !== index));
  };

  return (
    <>
      <PageCard title="Details Configuration" fullHeight>
        <Group align="stretch" grow>
          {CONFIG_CARDS.map((card) => (
            <Card key={card.type} withBorder radius="md" p="md" h="100%">
              <Group justify="space-between" mb="sm">
                <Title order={4} c="jltBlue.8">
                  {card.title}
                </Title>
                <ActionIcon color="jltBlue.6" onClick={() => openCreateModal(card.type)}>
                  <Add />
                </ActionIcon>
              </Group>
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
                    </Table.Tr>
                  ))}
                  {groupedRows[card.type].length === 0 && (
                    <Table.Tr>
                      <Table.Td colSpan={3}>
                        <Text c="dimmed" size="sm">
                          No {card.title.toLowerCase()} configs yet.
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  )}
                </Table.Tbody>
              </Table>
            </Card>
          ))}
        </Group>
      </PageCard>

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
                    value={option}
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

          <Button onClick={handleSave} loading={createMutation.isPending}>
            Save
          </Button>
        </Stack>
      </Modal>
    </>
  );
}

function getDropdownOptions(item: DetailConfigResource): { id: number; name: string }[] {
  return item.dropdown_options ?? item.dropdownOptions ?? [];
}
