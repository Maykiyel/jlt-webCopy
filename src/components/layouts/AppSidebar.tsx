import { Flex, Box, Stack, Text, UnstyledButton, Tooltip } from "@mantine/core";
import { useLocation, useNavigate } from "react-router";
import {
  Dashboard,
  DiversityTwo,
  Box as BoxIcon,
  RequestQuote,
  ManageAccounts,
  FolderManaged,
} from "@nine-thirty-five/material-symbols-react/rounded";
import classes from "./AppSidebar.module.css";

// Types
interface SubItem {
  label: string;
  path: string;
}

interface NavItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  path?: string;
  subItems?: SubItem[];
}

// Nav Config

const NAV_ITEMS: NavItem[] = [
  {
    id: "dashboard",
    icon: <Dashboard width="2rem" height="2rem" />,
    label: "Dashboard",
    path: "/",
  },
  {
    id: "leads",
    icon: <DiversityTwo width="2rem" height="2rem" />,
    label: "Leads",
    subItems: [
      { label: "Queries", path: "/leads/queries" },
      { label: "New", path: "/leads/new" },
      { label: "Replied", path: "/leads/replied" },
    ],
  },
  {
    id: "shipments",
    icon: <BoxIcon width="2rem" height="2rem" />,
    label: "Shipments",
    subItems: [
      { label: "Ongoing", path: "/shipments/logistics/ongoing"},
      { label: "Delivered", path: "/shipments/logistics/delivered"},
    ],
  },
  {
    id: "quotations",
    icon: <RequestQuote width="2rem" height="2rem" />,
    label: "Quotations",
    subItems: [
      { label: "Requests", path: "/quotations/requested" },
      { label: "Responded", path: "/quotations/responded" },
      { label: "Accepted", path: "/quotations/accepted" },
      { label: "Discarded", path: "/quotations/discarded" },
    ],
  },
  {
    id: "accounts",
    icon: <ManageAccounts width="2rem" height="2rem" />,
    label: "Accounts",
    subItems: [
      { label: "Clients", path: "/accounts/clients" },
      { label: "Employees", path: "/accounts/employees" },
    ],
  },
  {
    id: "tools",
    icon: <FolderManaged width="2rem" height="2rem" />,
    label: "Tools",
    subItems: [
      { label: "Services", path: "/tools/services" },
      { label: "Templates", path: "/tools/templates" },
      { label: "Messages", path: "/tools/messages" },
    ],
  },
];

const BTN_HEIGHT_REM = 5;
const PILL_HEIGHT_REM = 3.5;
const RAIL_PADDING_TOP_REM = 1.125;

// Helpers

function isPathActive(path: string, currentPath: string): boolean {
  if (path === "/") return currentPath === "/";
  return currentPath.startsWith(path);
}

function isItemActive(item: NavItem, currentPath: string): boolean {
  if (item.path) return isPathActive(item.path, currentPath);
  if (item.subItems?.some((sub) => isPathActive(sub.path, currentPath)))
    return true;
  const sectionPrefix = item.subItems?.[0]?.path.split("/")[1];
  if (sectionPrefix && currentPath.startsWith(`/${sectionPrefix}`)) return true;
  return false;
}

function getActiveIndex(currentPath: string): number {
  return NAV_ITEMS.findIndex((item) => isItemActive(item, currentPath));
}

function getActiveItem(currentPath: string): NavItem | null {
  return NAV_ITEMS.find((item) => isItemActive(item, currentPath)) ?? null;
}

// Component

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const activeIndex = getActiveIndex(currentPath);
  const activeItem = getActiveItem(currentPath);
  const panelOpen = !!activeItem?.subItems?.length;

  const pillTop =
    activeIndex >= 0
      ? `${RAIL_PADDING_TOP_REM + activeIndex * BTN_HEIGHT_REM + (BTN_HEIGHT_REM - PILL_HEIGHT_REM) / 2}rem`
      : "0rem";

  function handleIconClick(item: NavItem) {
    if (item.path) {
      navigate(item.path);
    } else if (item.subItems?.length) {
      navigate(item.subItems[0].path);
    }
  }

  return (
    <Box
      component="nav"
      pos="relative"
      display="flex"
      h="100%"
      style={{ flexDirection: "row", overflow: "visible" }}
    >
      {/* Rail background layer */}
      <Box className={classes.railBg} />

      {/* Travelling pill layer */}
      <Box
        className={classes.activePill}
        data-visible={activeIndex >= 0 || undefined}
        data-panel-open={panelOpen || undefined}
        style={{ transform: `translateY(${pillTop})` }}
      />

      {/* ── Sub-item panel ── */}
      <Box
        className={classes.subPanel}
        data-visible={panelOpen || undefined}
        aria-hidden={!panelOpen}
        bg="white"
      >
        {activeItem?.subItems && (
          <Box className={classes.subPanelInner} data-active py="xl" pt="2rem">
            <Stack gap="xs">
              {activeItem.subItems.map((sub) => {
                const active = isPathActive(sub.path, currentPath);
                return (
                  <UnstyledButton
                    key={sub.path}
                    onClick={() => navigate(sub.path)}
                    data-active={active || undefined}
                    style={
                      active
                        ? {
                            background:
                              "linear-gradient(to right, #ffffff, #d9d9d9)",
                          }
                        : undefined
                    }
                    pl={"lg"}
                    py={"0.375rem"}
                    className={classes.subItem}
                  >
                    <Text
                      size="xs"
                      fw={active ? 700 : 400}
                      tt="uppercase"
                      lts="0.08em"
                      style={{
                        whiteSpace: "nowrap",
                        transition: "color 120ms ease",
                      }}
                    >
                      {sub.label}
                    </Text>
                  </UnstyledButton>
                );
              })}
            </Stack>
          </Box>
        )}
      </Box>

      {/* ── Icon rail ── */}
      <Flex
        align="center"
        direction="column"
        wrap="wrap"
        pt="1.125rem"
        style={{ zIndex: 3, flexShrink: 0, overflow: "visible" }}
        w="5.5625rem"
        h="100%"
      >
        {/* Nav icon buttons */}
        {NAV_ITEMS.map((item) => {
          const active = isItemActive(item, currentPath);
          return (
            <Tooltip
              key={item.id}
              label={item.label}
              position="right"
              offset={8}
              transitionProps={{ transition: "slide-right", duration: 200 }}
              color="jltOrange.5"
              zIndex={300}
              disabled={active}
              styles={{
                tooltip: {
                  color: "var(--mantine-color-jltBlue)",
                },
              }}
            >
              <UnstyledButton
                onClick={() => handleIconClick(item)}
                data-active={active || undefined}
                className={classes.iconBtn}
                w="100%"
                h={`${BTN_HEIGHT_REM}rem`}
                display="flex"
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  zIndex: 1,
                  overflow: "visible",
                  color: active ? "var(--mantine-color-jltBlue-8)" : "white",
                  transition: "color 150ms ease",
                }}
              >
                {item.icon}
              </UnstyledButton>
            </Tooltip>
          );
        })}
      </Flex>
    </Box>
  );
}
