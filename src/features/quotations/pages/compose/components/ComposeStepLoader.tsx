import { Box, Loader, Stack, Text } from "@mantine/core";

interface ComposeStepLoaderProps {
  label: string;
  minHeight?: number | string;
}

export function ComposeStepLoader({
  label,
  minHeight = "16rem",
}: ComposeStepLoaderProps) {
  return (
    <Box
      style={{
        minHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <Stack gap="xs" align="center">
        <Loader type="dots" size="md" color="jltBlue.8" />
        <Text size="sm" c="dimmed" ta="center">
          {label}
        </Text>
      </Stack>
    </Box>
  );
}
