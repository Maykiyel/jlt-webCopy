import { Group, Select, Text } from "@mantine/core";
import { useComposeMessageTemplates } from "@/features/quotations/hooks/useComposeReferenceData";

interface MessageTemplateSelectProps {
  value: string | null;
  onChange: (templateId: string | null) => void;
}

export function MessageTemplateSelect({
  value,
  onChange,
}: MessageTemplateSelectProps) {
  const { data: messageTemplates = [] } = useComposeMessageTemplates();
  return (
    <Group justify="space-between" mb="xs">
      <Text size="sm" fw={500}>
        MESSAGE
      </Text>
      <Select
        aria-label="Select message template"
        placeholder="Select message template"
        value={value}
        onChange={onChange}
        data={messageTemplates.map((messageTemplate) => ({
          value: messageTemplate.id,
          label: messageTemplate.label,
        }))}
        w={220}
      />
    </Group>
  );
}
