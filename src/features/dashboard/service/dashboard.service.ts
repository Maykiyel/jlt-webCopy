import { apiClient } from "@/lib/api/client";
import type { DashboardData } from "@/features/dashboard/types/dashboard";

// ─── Fetch functions ──────────────────────────────────────────────────────────

export const fetchDashboard = async (): Promise<DashboardData> => {
  const res = await apiClient.get("/dashboard");
  return res.data.data;
};
