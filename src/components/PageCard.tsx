import {
  Box,
  Card,
  Divider,
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
  action?: React.ReactNode;
  fullHeight?: boolean;
  children?: React.ReactNode;
  onBack?: () => void;
  hideDivider?: boolean;
  bodyPx?: string | number;
  bodyPy?: string | number;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function PageCard({
  title,
  subtext,
  action,
  fullHeight = false,
  children,
  onBack,
  hideDivider = false,
  bodyPx = "xl",
  bodyPy = "lg",
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
              <Text size="xs" c="dimmed" fs="italic">
                ({subtext})
              </Text>
            )}
          </Group>
        </Group>

        {action && <Box style={{ flexShrink: 0 }}>{action}</Box>}
      </Group>

      {!hideDivider && (
        <Divider
          size={"sm"}
          w={"96%"}
          mx={"auto"}
          className={classes.divider}
        />
      )}

      {/* ── Body ── */}
      <Box className={classes.body} px={bodyPx} py={bodyPy}>
        {children}
      </Box>
    </Card>
  );
}
