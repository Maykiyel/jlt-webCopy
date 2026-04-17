import { useDisclosure } from "@mantine/hooks";
import { Group, ActionIcon, Button } from "@mantine/core";
import {
  Add,
  Settings,
} from "@nine-thirty-five/material-symbols-react/rounded";
import { PageCard } from "@/components/PageCard";
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

// ─── Component ────────────────────────────────────────────────────────────────

export function TemplatesPage() {
  const [addModalOpened, { open: openAddModal, close: closeAddModal }] =
    useDisclosure(false);
  const [
    settingsModalOpened,
    { open: openSettingsModal, close: closeSettingsModal },
  ] = useDisclosure(false);

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
        <h2>List of Quotation Templates</h2>
        <p>Quotation template management interface will be implemented here.</p>
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
