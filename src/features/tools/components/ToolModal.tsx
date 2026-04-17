import { type ReactNode } from "react";
import { Modal, Stack, Text, Divider } from "@mantine/core";

interface ToolModalProps {
  opened: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: string;
  centered?: boolean;
  withCloseButton?: boolean;
  padding?: number | string;
  radius?: string;
}

export function ToolModal({
  opened,
  onClose,
  title,
  children,
  size = "md",
  centered = true,
  withCloseButton = false,
  padding = 0,
  radius = "md",
}: ToolModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered={centered}
      size={size}
      withCloseButton={withCloseButton}
      padding={padding}
      radius={radius}
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
          {title}
        </Text>
        <Divider />
        {/* Content */}
        <Stack gap={0} p="lg">
          {children}
        </Stack>
      </Stack>
    </Modal>
  );
}
