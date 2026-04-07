import { useDashboardData } from "@/features/dashboard/hooks/useDashboardData";
import { isHumanResourceDashboard } from "@/features/dashboard/types/dashboard";

export function useHumanResourceDashboard() {
  const { data, isLoading } = useDashboardData();
  const dashboard = data && isHumanResourceDashboard(data) ? data : undefined;

  return {
    isLoading,
    message: dashboard?.message ?? "No dashboard data available.",
  };
}
