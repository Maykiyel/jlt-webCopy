import { Box, Group, Stack, Text } from "@mantine/core";
import { DonutChart } from "@mantine/charts";
import classes from "../modules/AccountSpecialistDashboard.module.css";
import { colorToCssVar } from "@/utils/mantine-color";
import { useEffect, useRef, useState } from "react";
// ─── Types ────────────────────────────────────────────────────────────────────

export interface DonutCardProps {
  label: string;
  icon: React.ReactNode;
  primaryLabel: string;
  primaryCount: number;
  primaryColor: string;
  secondaryLabel: string;
  secondaryCount: number;
  secondaryColor: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DonutCard({
  label,
  icon,
  primaryLabel,
  primaryCount,
  primaryColor,
  secondaryLabel,
  secondaryCount,
  secondaryColor,
}: DonutCardProps) {
  const total = primaryCount + secondaryCount;

  const chartData = [
    { name: primaryLabel, value: primaryCount, color: primaryColor },
    { name: secondaryLabel, value: secondaryCount, color: secondaryColor },
  ];

  const boxRef = useRef<HTMLDivElement>(null);
  const [chartSize, setChartSize] = useState(230);

  useEffect(() => {
    if (!boxRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      setChartSize(Math.round(entry.contentRect.width));
    });
    observer.observe(boxRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Group
      py="1.5625rem"
      px="4.1875rem"
      w="100%"
      justify="center"
      gap="3.5rem"
      grow
    >
      <Box style={{ display: "flex", justifyContent: "center" }}>
        <Box
          h="14.375rem"
          w="14.375rem"
          pos="relative"
          style={{ flexShrink: 0 }}
        >
          <DonutChart
            data={
              total === 0
                ? [{ name: "empty", value: 1, color: "#e9ecef" }]
                : chartData
            }
            size={chartSize}
            thickness={24}
            withTooltip={false}
            strokeWidth={0}
          />
          <Stack
            align="center"
            gap={4}
            pos={"absolute"}
            inset={0}
            m={"auto"}
            w={"max-content"}
            h={"max-content"}
          >
            {icon}
            <Text size="md" c="#bebebe" fw={600} tt="uppercase">
              {label}
            </Text>
          </Stack>
        </Box>
      </Box>

      <Stack gap={4}>
        <Group gap={6} align="center">
          <Box
            className={classes.dot}
            style={{ backgroundColor: colorToCssVar(primaryColor) }}
          />
          <Text size="xs" fw={600} c={primaryColor} tt="uppercase">
            {primaryLabel}
          </Text>
        </Group>
        <Text size="xl" fw={800} ml={"1rem"} mb={8} c={primaryColor}>
          {String(primaryCount).padStart(2, "0")}
        </Text>

        <Group gap={6} align="center">
          <Box
            className={classes.dot}
            style={{ backgroundColor: colorToCssVar(secondaryColor) }}
          />
          <Text size="xs" fw={600} c={secondaryColor} tt="uppercase">
            {secondaryLabel}
          </Text>
        </Group>
        <Text size="xl" fw={800} ml={"1rem"} mb={8} c={secondaryColor}>
          {String(secondaryCount).padStart(2, "0")}
        </Text>

        <Box mt="0.25rem">
          <Text size="xs" tt="uppercase">
            Total
          </Text>
          <Text size="2.5625rem" fw={800} lh={1}>
            {total}
          </Text>
        </Box>
      </Stack>
    </Group>
  );
}
