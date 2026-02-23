import { Outlet } from "react-router";
import { AppShell } from "@mantine/core";
import { AppSidebar } from "@/components/layouts/AppSidebar";
import { AppHeader } from "@/components/layouts/AppHeader";

export function AppLayout() {
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 89,
        breakpoint: "sm",
      }}
      padding="md"
      withBorder={false}
    >
      <AppShell.Header>
        <AppHeader />
      </AppShell.Header>

      <AppShell.Navbar
        style={{
          background: "transparent",
          border: "none",
          padding: 0,
          overflow: "visible",
        }}
      >
        <AppSidebar />
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
