import { useDisclosure } from "@mantine/hooks";
import { Group, ActionIcon, Button } from "@mantine/core";
import { useCallback, useMemo, useState } from "react";
import {
  Add,
  Settings,
} from "@nine-thirty-five/material-symbols-react/rounded";
import { PageCard } from "@/components/PageCard";
import { AppTable } from "@/components/AppTable";
import { ToolModal } from "../components/ToolModal";
import { NumberedOptionButton } from "@/components/NumberedOptionButton";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TemplateType {
  id: string;
  label: string;
}

interface Settings {
  id: string;
  label: string;
  path: string;
}

interface TemplateRow {
  id: string;
  name: string;
  isActive: boolean;
}

// ─── Template Types ───────────────────────────────────────────────────────────

const TEMPLATE_TYPES: TemplateType[] = [
  { id: "regulatory", label: "Regulatory Services" },
  { id: "logistics", label: "Logistics Services" },
];

const SETTINGS: Settings[] = [
  { id: "details", label: "Details", path: "" },
  { id: "billing", label: "Billing", path: "" },
  {
    id: "standard_quotation_templates",
    label: "Standard Quotation Templates",
    path: "",
  },
];

const INITIAL_TEMPLATES: TemplateRow[] = [
  { id: "tpl-1", name: "Regulatory - Basic", isActive: true },
  { id: "tpl-2", name: "Logistics - Standard", isActive: false },
  { id: "tpl-3", name: "Regulatory - Premium", isActive: true },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function TemplatesPage() {
  const [templates, setTemplates] = useState<TemplateRow[]>(INITIAL_TEMPLATES);
  const [addModalOpened, { open: openAddModal, close: closeAddModal }] =
    useDisclosure(false);
  const [
    settingsModalOpened,
    { open: openSettingsModal, close: closeSettingsModal },
  ] = useDisclosure(false);

  const columns = useMemo(
    () => [{ key: "name", label: "TEMPLATE NAME", width: "100%" }],
    [],
  );

  const handleToggle = useCallback((row: TemplateRow, value: boolean) => {
    setTemplates((prev) =>
      prev.map((item) => (item.id === row.id ? { ...item, isActive: value } : item)),
    );
  }, []);

  const handleEdit = useCallback((row: TemplateRow) => {
    // Placeholder until edit flow is wired.
    console.info("Edit template", row.id);
  }, []);

  const handleDelete = useCallback((row: TemplateRow) => {
    setTemplates((prev) => prev.filter((item) => item.id !== row.id));
  }, []);

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
          data={templates}
          rowKey={(row) => row.id}
          withNumbering
          withToggle={{
            getValue: (row) => row.isActive,
            onChange: handleToggle,
            label: "ACTIVE",
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
          searchPlaceholder="SEARCH TEMPLATE"
        />
      </PageCard>

      {/* Add Template Modal (Reusable) */}
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
              // onClick={}
            />
          ))}
        </Group>
      </ToolModal>

      {/* Configuration Modal */}
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
              // onClick={() => {}}
            />
          ))}
        </Group>
      </ToolModal>
    </>
  );
}
