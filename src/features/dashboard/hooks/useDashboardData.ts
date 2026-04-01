import { useQuery } from "@tanstack/react-query";
import { fetchDashboard } from "@/features/dashboard/service/dashboard.service";
import { useAuthStore } from "@/stores/authStore";

export function useDashboardData() {
  const role = useAuthStore((state) => state.user?.role ?? "UNKNOWN");

  return useQuery({
    queryKey: ["dashboard", role],
    queryFn: fetchDashboard,
  });
}
