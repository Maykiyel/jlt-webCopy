import { useDashboardData } from "@/features/dashboard/hooks/useDashboardData";
import {
  isAccountSpecialistDashboard,
  type ClientRow,
} from "@/features/dashboard/types/dashboard";

export function useAccountSpecialistDashboard() {
  const { data } = useDashboardData();
  const dashboard =
    data && isAccountSpecialistDashboard(data) ? data : undefined;

  return {
    quotations: {
      responded_count: dashboard?.quotations?.responded_count ?? 0,
      requested_count: dashboard?.quotations?.requested_count ?? 0,
    },
    shipments: {
      ongoing_count: dashboard?.shipments?.ongoing_count ?? 0,
      delivered_count: dashboard?.shipments?.delivered_count ?? 0,
    },
    clients: (dashboard?.clients?.clients ?? []) as ClientRow[],
    clientsTotalCount: dashboard?.clients?.total_count ?? 0,
  };
}
