import {
  Box,
  Card,
  Group,
  Text,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { ArrowBack } from "@nine-thirty-five/material-symbols-react/rounded";
import { useNavigate } from "react-router";
import classes from "./PageCard.module.css";

// ─── Types ───────────────────────────────────────────────────────────────────

interface PageCardProps {
  title: string;
  subtext?: string;
  subtextColor?: string;
  action?: React.ReactNode;
  fullHeight?: boolean;
  children?: React.ReactNode;
  onBack?: () => void;
  hideDivider?: boolean;
  bodyPx?: string | number;
  bodyPy?: string | number;
  showJobSwitch?: boolean;
  jobSwitchValue?: "all" | "my-jobs" | "my-quotes";
  onJobSwitchChange?: (value: "all" | "my-jobs" | "my-quotes") => void;
  jobSwitchSecondaryValue?: "my-jobs" | "my-quotes";
  jobSwitchSecondaryLabel?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function PageCard({
  title,
  subtext,
  subtextColor = "dimmed",
  action,
  fullHeight = false,
  children,
  onBack,
  bodyPx = "xl",
  bodyPy = "lg",
  showJobSwitch = false,
  jobSwitchValue = "all",
  onJobSwitchChange,
  jobSwitchSecondaryValue = "my-jobs",
  jobSwitchSecondaryLabel = "MY JOBS",
}: PageCardProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <Card
      withBorder={false}
      radius={10}
      shadow={"sm"}
      padding={0}
      className={classes.root}
      style={{
        height: fullHeight
          ? "calc(100vh - var(--app-shell-header-height) - var(--mantine-spacing-md) * 2)"
          : undefined,
      }}
      pos="relative"
    >
      {/* ── Header ── */}
      <Group
        justify="space-between"
        p="lg"
        wrap="nowrap"
        className={classes.header}
      >
        <Group gap="xs" wrap="nowrap">
            <UnstyledButton onClick={handleBack} className={classes.backButton}>
              <ArrowBack width="1.25rem" height="1.25rem" fill="currentColor" />
            </UnstyledButton>

          <Group gap="0.5rem" align="baseline" wrap="nowrap">
            <Title order={5} fw={800} tt="uppercase" c="jltBlue.8">
              {title}
            </Title>
            {subtext && (
              <Text size="xs" c={subtextColor} fs="italic">
                ({subtext})
              </Text>
            )}
          </Group>
        </Group>

        <Group gap="sm" wrap="nowrap">
          {showJobSwitch && (
            <Group gap={0} className={classes.jobSwitch} wrap="nowrap">
              <UnstyledButton
                type="button"
                className={classes.jobSwitchOption}
                data-active={jobSwitchValue === "all" || undefined}
                aria-pressed={jobSwitchValue === "all"}
                onClick={() => onJobSwitchChange?.("all")}
              >
                <span className={classes.jobSwitchLabel}>ALL</span>
              </UnstyledButton>

              <UnstyledButton
                type="button"
                className={classes.jobSwitchOption}
                data-active={jobSwitchValue === jobSwitchSecondaryValue || undefined}
                aria-pressed={jobSwitchValue === jobSwitchSecondaryValue}
                onClick={() => onJobSwitchChange?.(jobSwitchSecondaryValue)}
              >
                <span className={classes.jobSwitchLabel}>{jobSwitchSecondaryLabel}</span>
              </UnstyledButton>
            </Group>
          )}

          {action && <Box style={{ flexShrink: 0 }}>{action}</Box>}
        </Group>
      </Group>

      {/* ── Body ── */}
      <Box className={classes.body} px={bodyPx} py={bodyPy}>
        {children}
      </Box>
    </Card>
  );
}
