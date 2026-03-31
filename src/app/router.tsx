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
const QuotationViewerPage = lazy(
  () => import("./routes/app/quotations/QuotationViewerPage"),
);

export const router = createBrowserRouter([
  // ==========================================
  // GUEST ROUTES
  // ==========================================
  {
    Component: GuestRoute,
    HydrateFallback: Loader,
    children: [{ path: "/login", Component: LoginPage }],
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
          { index: true, Component: DashboardPage },
          { path: "account-settings", Component: AccountSettings },

          // Quotation routes — most specific first
          {
            path: "quotations/:tab/client/:clientId/:quotationId/documents",
            Component: Quotations,
          },
          {
            path: "quotations/:tab/client/:clientId/:quotationId/view",
            Component: QuotationViewerPage,
          },
          {
            path: "quotations/:tab/client/:clientId/:quotationId/compose/:template",
            Component: Quotations,
          },
          {
            path: "quotations/:tab/client/:clientId/:quotationId/compose",
            Component: Quotations,
          },
          {
            path: "quotations/:tab/client/:clientId/:quotationId",
            Component: Quotations,
          },
          { path: "quotations/:tab/client/:clientId", Component: Quotations },
          { path: "quotations/:tab", Component: Quotations },

          { path: "*", Component: NotFound },
        ],
      },
    ],
  },
]);
