import { Box } from "@mantine/core";
import type { ReactNode } from "react";

interface ConfigLayoutProps {
  left: ReactNode;
  rightTop: ReactNode;
  rightBottom: ReactNode;
}

export function ConfigLayout({
  left,
  rightTop,
  rightBottom,
}: ConfigLayoutProps) {
  return (
    <Box
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "1rem",
        height: "calc(100vh - var(--app-shell-header-height) - 5rem)",
        minWidth: 0,
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      {left}

      <Box
        style={{
          display: "grid",
          gridTemplateRows: "1fr 1fr",
          gap: "1rem",
          height: "100%",
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        {rightTop}
        {rightBottom}
      </Box>
    </Box>
  );
}
