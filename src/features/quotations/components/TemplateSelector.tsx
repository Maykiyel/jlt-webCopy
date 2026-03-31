import { Box, Text } from "@mantine/core";
import classes from "./TemplateSelector.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TemplateSelectorProps {
  templates: { id: string; name: string; enabled: boolean }[];
  onSelect: (templateId: string) => void;
}

// ─── Blob Badge ───────────────────────────────────────────────────────────────
//
// Original viewBox: 0 0 91 70 — but the path runs from y=5 to y=65 (60px of
// actual content). Cropping to viewBox="0 5 91 60" removes the built-in
// padding so the shape fills the full container height.
//
// Aspect ratio after crop: 91 / 60 ≈ 1.517
// At height 3rem → width = 3rem × (91/60) ≈ 4.55rem

function BlobBadge({
  number,
  disabled,
}: {
  number: string;
  disabled: boolean;
}) {
  return (
    <Box
      style={{
        position: "relative",
        flexShrink: 0,
        width: "5.69rem",
        height: "3.75rem",
        zIndex: 2,
      }}
    >
      <svg
        viewBox="0 5 91 60"
        width="100%"
        height="100%"
        style={{ display: "block" }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5 31.1947C5 16.7278 16.7278 5 31.1947 5H70.7277C85.2155 5 90.7839 23.8781 78.6154 31.7408L66.0495 39.8603C61.4133 42.856 62.0895 49.8358 67.2146 51.8858C74.1666 54.6666 72.1765 65 64.6891 65H32.5943C31.8661 65 31.1391 64.9387 30.4211 64.8168L29.0948 64.5916C15.1806 62.2288 5 50.1737 5 36.0603V31.1947Z"
          fill={
            disabled
              ? "var(--mantine-color-jltAccent-4)"
              : "var(--mantine-color-jltAccent-7)"
          }
        />
      </svg>

      <Box
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingRight: "1rem",
        }}
      >
        <Text size="xs" fw={700} c="white" lts="0.04em">
          {number}
        </Text>
      </Box>
    </Box>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TemplateSelector({
  templates,
  onSelect,
}: TemplateSelectorProps) {
  return (
    <Box style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {templates.map((template, i) => (
        <Box
          key={template.id}
          className={`${classes.row} ${!template.enabled ? classes.disabled : ""}`}
          onClick={() => template.enabled && onSelect(template.id)}
        >
          <BlobBadge
            number={String(i + 1).padStart(2, "0")}
            disabled={!template.enabled}
          />

          <Box
            className={`${classes.pill} ${!template.enabled ? classes.pillDisabled : ""}`}
          >
            <Text className={classes.label}>{template.name}</Text>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
