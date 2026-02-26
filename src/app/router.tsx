import { createBrowserRouter } from "react-router";
import { ProtectedRoute } from "@/components/guards/ProtectedRoute";
import { GuestRoute } from "@/components/guards/GuestRoute";
import { AppLayout } from "@/components/layouts/AppLayout";
import { lazy } from "react";
import NotFound from "./routes/NotFound";
import { Loader } from "@mantine/core";

const LoginPage = lazy(() => import("./routes/auth/LoginPage"));
const DashboardPage = lazy(
  () => import("./routes/app/dashboard/DashboardPage"),
);
// const Quotations = lazy(() => import("./routes/app/qoutations/Quotations"));

const AccountSettings = lazy(
  () => import("./routes/app/account-settings/AccountSettingsPage"),
);

export const router = createBrowserRouter([
  // ==========================================
  // GUEST ROUTES
  // ==========================================
  {
    Component: GuestRoute,
    HydrateFallback: Loader,
    children: [
      {
        path: "/login",
        Component: LoginPage,
      },
    ],
  },

  // ==========================================
  // PROTECTED ROUTES
  // ==========================================
  {
    Component: ProtectedRoute,
    children: [
      {
        Component: AppLayout,
        children: [
          // Dashboard
          {
            index: true,
            Component: DashboardPage,
          },
          // {
          //   path: "tools",
          //   Component: ProtectedToolsPage,
          // },

<<<<<<< HEAD
          // Queries feature with nested routes (TODO)
          // {
          //   path: "quotations/new",
          //   children: [
          //     {
          //       index: true,
          //       Component: Quotations,
          //     },
          //   ],
          // },
=======
          {
            path: "account-settings",
            Component: AccountSettings,
          },
          {
            path: "*",
            Component: NotFound,
          },
>>>>>>> origin/main
        ],
      },
    ],
  },
]);
