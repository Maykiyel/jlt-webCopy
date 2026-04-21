import { useDisclosure } from "@mantine/hooks";
import { Group, ActionIcon, Button } from "@mantine/core";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { notifications } from "@mantine/notifications";
import {
  Add,
  Settings,
} from "@nine-thirty-five/material-symbols-react/rounded";
import { PageCard } from "@/components/PageCard";
import { AppTable, type AppTableColumn } from "@/components/AppTable";
import { NumberedOptionButton } from "@/components/NumberedOptionButton";
import type { QuotationTemplateResource } from "@/types/templates";
import { templatesService } from "../api/templates.service";
import { ToolModal } from "../components/ToolModal";

interface TemplateType {
  id: string;
  label: string;
}

interface SettingsOption {
  id: string;
  label: string;
  path: string;
}

const TEMPLATE_TYPES: TemplateType[] = [
  { id: "regulatory", label: "Regulatory Services" },
  { id: "logistics", label: "Logistics Services" },
];

const SETTINGS: SettingsOption[] = [
  { id: "details", label: "Details", path: "" },
  { id: "billing", label: "Billing", path: "" },
  {
    id: "standard_quotation_templates",
    label: "Standard Quotation Templates",
    path: "",
  },
];

export function TemplatesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [addModalOpened, { open: openAddModal, close: closeAddModal }] =
    useDisclosure(false);
  const [
    settingsModalOpened,
    { open: openSettingsModal, close: closeSettingsModal },
  ] = useDisclosure(false);

  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [pendingToggleIds, setPendingToggleIds] = useState<number[]>([]);
  const [toggleOverrides, setToggleOverrides] = useState<Record<number, boolean>>(
    {},
  );
  const toggleTimersRef = useRef<Record<number, ReturnType<typeof setTimeout>>>(
    {},
  );

  const { data: templatesResponse } = useQuery({
    queryKey: ["templates"],
    queryFn: () => templatesService.getTemplates(),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: boolean }) =>
      templatesService.toggleTemplateStatus(id, status),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => templatesService.deleteTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      notifications.show({
        title: "Success",
        message: "Template deleted successfully",
        color: "teal",
      });
    },
    onError: () => {
      notifications.show({
        title: "Error",
        message: "Failed to delete template",
        color: "red",
      });
    },
  });

  const templates = useMemo(
    () => templatesResponse?.data ?? [],
    [templatesResponse?.data],
  );

  const filteredTemplates = useMemo(() => {
    if (!search) {
      return templates;
    }

    const keyword = search.toLowerCase();
    return templates.filter((template) =>
      template.name.toLowerCase().includes(keyword),
    );
  }, [search, templates]);

  const paginatedTemplates = useMemo(
    () => filteredTemplates.slice(0, perPage),
    [filteredTemplates, perPage],
  );

  const columns: AppTableColumn<QuotationTemplateResource>[] = useMemo(
    () => [
      {
        key: "name",
        label: "TEMPLATE NAME",
      },
    ],
    [],
  );

  const handleToggle = (row: QuotationTemplateResource, value: boolean) => {
    const { id } = row;

    setToggleOverrides((prev) => ({ ...prev, [id]: value }));

    const existingTimer = toggleTimersRef.current[id];
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    toggleTimersRef.current[id] = setTimeout(() => {
      setPendingToggleIds((prev) => (prev.includes(id) ? prev : [...prev, id]));

      toggleMutation.mutate(
        { id, status: value },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["templates"] });
            notifications.show({
              title: "Success",
              message: "Template status updated",
              color: "teal",
            });
          },
          onError: () => {
            notifications.show({
              title: "Error",
              message: "Failed to update template status",
              color: "red",
            });
          },
          onSettled: () => {
            setPendingToggleIds((prev) => prev.filter((itemId) => itemId !== id));
            setToggleOverrides((prev) => {
              const next = { ...prev };
              delete next[id];
              return next;
            });
          },
        },
      );

      delete toggleTimersRef.current[id];
    }, 350);
  };

  useEffect(() => {
    const toggleTimers = toggleTimersRef.current;

    return () => {
      Object.values(toggleTimers).forEach((timerId) => {
        clearTimeout(timerId);
      });
    };
  }, []);

  const handleEdit = (row: QuotationTemplateResource) => {
    navigate(`/tools/templates/${row.id}/edit`);
  };

  const handleDelete = (row: QuotationTemplateResource) => {
    deleteMutation.mutate(row.id);
  };

  return (
    <>
      <PageCard
        title="List of Quotation Templates"
        action={
          <Group gap="sm">
            <Button
              leftSection={<Add />}
              onClick={openAddModal}
              color="jltAccent.6"
              h="2.4375rem"
              w="8.0625rem"
              style={{
                minWidth: "8.0625rem",
                maxWidth: "8.0625rem",
                paddingInline: 0,
              }}
            >
              Template
            </Button>

            <ActionIcon
              onClick={openSettingsModal}
              color="jltAccent.6"
              h="2.25rem"
              w="2.25rem"
              style={{
                paddingInline: 0,
                justifyContent: "center",
                minWidth: "2.25rem",
                maxWidth: "2.25rem",
                height: "2.25rem",
                width: "2.25rem",
              }}
            >
              <Settings />
            </ActionIcon>
          </Group>
        }
        fullHeight
      >
        <AppTable
          columns={columns}
          data={paginatedTemplates}
          rowKey={(row) => row.id}
          withNumbering
          withToggle={{
            getValue: (row) =>
              toggleOverrides[row.id] !== undefined
                ? toggleOverrides[row.id]
                : row.is_active,
            onChange: handleToggle,
            label: "ACTIVE",
            disabled: (row) => pendingToggleIds.includes(row.id),
          }}
          withEdit={{
            onClick: handleEdit,
            tooltip: "Edit template",
          }}
          withDelete={{
            onClick: handleDelete,
            tooltip: "Delete template",
            confirmMessage: (row) =>
              `Are you sure you want to delete "${row.name}"?`,
          }}
          withEntryControls
          perPage={perPage}
          onPerPageChange={setPerPage}
          total={filteredTemplates.length}
          showingCount={paginatedTemplates.length}
          searchPlaceholder="SEARCH TEMPLATE NAME"
          searchValue={search}
          onSearchChange={setSearch}
        />
      </PageCard>

      <ToolModal
        opened={addModalOpened}
        onClose={closeAddModal}
        title="Choose Type of Template"
        size="md"
        withCloseButton={false}
        padding={0}
        radius="md"
      >
        <Group>
          {TEMPLATE_TYPES.map((type, index) => (
            <NumberedOptionButton
              key={type.id}
              number={index + 1}
              label={type.label}
            />
          ))}
        </Group>
      </ToolModal>

      <ToolModal
        opened={settingsModalOpened}
        onClose={closeSettingsModal}
        title="Configuration"
        size="md"
        withCloseButton={false}
        padding={0}
        radius="md"
      >
        <Group>
          {SETTINGS.map((setting, index) => (
            <NumberedOptionButton
              key={setting.id}
              number={index + 1}
              label={setting.label}
            />
          ))}
        </Group>
      </ToolModal>
    </>
  );
}
