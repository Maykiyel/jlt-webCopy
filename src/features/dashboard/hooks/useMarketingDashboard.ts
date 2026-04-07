import { useDashboardData } from "@/features/dashboard/hooks/useDashboardData";
import { isMarketingDashboard } from "@/features/dashboard/types/dashboard";

export function useMarketingDashboard() {
  const { data, isLoading } = useDashboardData();
  const dashboard = data && isMarketingDashboard(data) ? data : undefined;

  return {
    isLoading,
    viewsCount: dashboard?.views_count ?? "0",
    clientsCount: dashboard?.clients_count ?? "0",
    totalVideos: dashboard?.total_videos ?? "0",
    totalArticles: dashboard?.total_articles ?? "0",
  };
}
