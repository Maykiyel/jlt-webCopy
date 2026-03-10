import { Box, Paper, Text } from "@mantine/core";
import type { ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DetailCardProps {
  /** Icon element — use Material Symbols icon */
  icon: ReactNode;
  /** Card section title */
  title: string;
  /** Card body — typically a DetailGrid but can be anything */
  children: ReactNode;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DetailCard({ icon, title, children }: DetailCardProps) {
  return (
    <Paper
      radius="md"
      p="1.25rem"
      style={{
        backgroundColor: "#fff",
        border: "1px solid var(--mantine-color-gray-2)",
      }}
    >
      {/* ── Header ── */}
      <Box
        display="flex"
        style={{ alignItems: "center", gap: "0.5rem" }}
        mb="xl"
      >
        <Box
          style={{
            color: "var(--mantine-color-jltBlue-8)",
            display: "flex",
            alignItems: "center",
          }}
        >
          {icon}
        </Box>
        <Text
          size="sm"
          fw={700}
          tt="uppercase"
          lts="0.08em"
          c="var(--mantine-color-jltBlue-8)"
        >
          {title}
        </Text>
      </Box>

      {/* ── Body ── */}
      {children}
    </Paper>
  );
}
