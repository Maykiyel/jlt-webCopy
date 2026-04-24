import { ActionIcon, Group, Text } from "@mantine/core";
import { ArrowBack } from "@nine-thirty-five/material-symbols-react/rounded";

interface ConfigPageHeaderProps {
  title: string;
}

export function ConfigPageHeader({ title }: ConfigPageHeaderProps) {
  return (
    <Group mb="md" gap="sm">
      <ActionIcon
        variant="subtle"
        onClick={() => window.history.back()}
        aria-label="Back"
      >
        <ArrowBack width={24} height={24} />
      </ActionIcon>
      <Text fw={700} size="lg" c="jltBlue">
        {title}
      </Text>
    </Group>
  );
}
