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

const AccountSettings = lazy(
  () => import("./routes/app/account-settings/AccountSettingsPage"),
);

const Quotations = lazy(() => import("./routes/app/quotations/QuotationsPage"));

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

          {
            path: "account-settings",
            Component: AccountSettings,
          },
          {
            path: "quotations/client/:clientId",
            Component: Quotations,
          },
          { path: "quotations/:tab", Component: Quotations },
          {
            path: "*",
            Component: NotFound,
          },
        ],
      },
    ],
  },
]);
