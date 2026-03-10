import { Box, Text } from "@mantine/core";
import type { ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DetailRow {
  label: string;
  value: ReactNode;
}

export interface DetailGridProps {
  rows: DetailRow[];
  labelWidth?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DetailGrid({ rows, labelWidth = "12rem" }: DetailGridProps) {
  return (
    <Box>
      {rows.map((row, i) => (
        <Box
          key={i}
          display="flex"
          style={{ alignItems: "baseline", gap: "1.25rem" }}
          mb="xl"
        >
          <Text
            size="sm"
            c="dimmed"
            tt="uppercase"
            lts="0.06em"
            style={{ flexShrink: 0, width: labelWidth }}
          >
            {row.label}
          </Text>
          <Text size="sm" tt="uppercase" c="var(--mantine-color-jltBlue-8)">
            {row.value}
          </Text>
        </Box>
      ))}
    </Box>
  );
}
