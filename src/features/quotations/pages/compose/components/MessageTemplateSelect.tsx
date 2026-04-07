import { Group, Select, Text } from "@mantine/core";
import { getComposeReferenceData } from "@/features/quotations/pages/compose/utils/composeReferenceData";

interface MessageTemplateSelectProps {
  value: string | null;
  onChange: (templateId: string | null) => void;
}

export function MessageTemplateSelect({
  value,
  onChange,
}: MessageTemplateSelectProps) {
  const { messageTemplates } = getComposeReferenceData();
  // TODO: replace with useQuery when GET /message-templates is available
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
