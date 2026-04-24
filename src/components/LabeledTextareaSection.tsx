import { Box, Paper, Text, Textarea } from "@mantine/core";
import type { CSSProperties } from "react";

type LabeledTextareaSectionMode = "edit" | "readonly";

interface LabeledTextareaSectionProps {
  label: string;
  value: string;
  mode?: LabeledTextareaSectionMode;
  onChange?: (value: string) => void;
  height?: string;
  maxLength?: number;
}

export function LabeledTextareaSection({
  label,
  value,
  mode = "edit",
  onChange,
  height = "8rem",
  maxLength,
}: LabeledTextareaSectionProps) {
  const textareaInputStyles: CSSProperties = {
    border: 0,
    boxShadow: "none",
    background: "transparent",
    height,
    minHeight: height,
    maxHeight: height,
    overflowY: "auto",
    resize: "none",
  };

  const isReadonly = mode === "readonly";

  return (
    <Paper withBorder radius="sm" mb="sm">
      <Box px="md" py="xs" bg="gray.1">
        <Text size="sm" fw={600} tt="uppercase">
          {label}
        </Text>
      </Box>
      <Box px="md" py="sm">
        <Textarea
          value={value}
          onChange={(event) => onChange?.(event.currentTarget.value)}
          readOnly={isReadonly}
          disabled={isReadonly}
          styles={{ input: textareaInputStyles }}
          maxLength={maxLength}
        />
      </Box>
    </Paper>
  );
}
