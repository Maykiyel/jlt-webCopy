import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import {
  Group,
  Modal,
  Stack,
  Divider,
  Text,
  ActionIcon,
  Button,
  UnstyledButton,
} from "@mantine/core";
import {
  Add,
  Settings,
} from "@nine-thirty-five/material-symbols-react/rounded";
import { PageCard } from "@/components/PageCard";
import classes from "./TemplatesPage.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TemplateType {
  id: string;
  label: string;
}

// ─── Template Types ───────────────────────────────────────────────────────────

const TEMPLATE_TYPES: TemplateType[] = [
  { id: "regulatory", label: "Regulatory Services" },
  { id: "logistics", label: "Logistics Services" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function TemplatesPage() {
  const [addModalOpened, { open: openAddModal, close: closeAddModal }] =
    useDisclosure(false);
  const [
    settingsModalOpened,
    { open: openSettingsModal, close: closeSettingsModal },
  ] = useDisclosure(false);

  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleSelectType = (typeId: string) => {
    setSelectedType(typeId);
    closeAddModal();
    // TODO: Navigate to template creation page for this type
    console.log("Selected template type:", typeId);
  };

  const handleOpenSettings = () => {
    openSettingsModal();
    // TODO: Implement settings functionality
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

      {/* Add Template Modal */}
      <Modal
        opened={addModalOpened}
        onClose={closeAddModal}
        centered
        size="md"
        withCloseButton={false}
        padding={0}
        radius="md"
      >
        <Stack gap={0}>
          {/* Title */}
          <Text
            ta="center"
            fw={600}
            size="sm"
            py="lg"
            c="dimmed"
            tt="uppercase"
            lts="0.08em"
          >
            Choose Type of Template
          </Text>

          <Divider />

          {/* Template Type Options */}
          <Stack gap={0} p="lg">
            {TEMPLATE_TYPES.map((type) => (
              <UnstyledButton
                key={type.id}
                onClick={() => handleSelectType(type.id)}
                className={classes.templateOption}
              >
                <Text size="sm" fw={600} tt="uppercase" lts="0.04em">
                  {type.label}
                </Text>
              </UnstyledButton>
            ))}
          </Stack>
        </Stack>
      </Modal>

      {/* Settings Modal */}
      <Modal
        opened={settingsModalOpened}
        onClose={closeSettingsModal}
        centered
        size="md"
        withCloseButton={false}
        padding={0}
        radius="md"
      >
        <Stack gap={0}>
          {/* Title */}
          <Text
            ta="center"
            fw={600}
            size="sm"
            py="lg"
            c="dimmed"
            tt="uppercase"
            lts="0.08em"
          >
            Template Settings
          </Text>

          <Divider />

          {/* Settings Content */}
          <Stack gap={0} p="lg">
            <Text size="sm" c="dimmed" ta="center">
              Settings functionality coming soon.
            </Text>
          </Stack>
        </Stack>
      </Modal>
    </>
  );
}
