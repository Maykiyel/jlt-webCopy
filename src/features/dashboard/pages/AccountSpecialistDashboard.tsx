import { useQuery } from "@tanstack/react-query";
import { Stack } from "@mantine/core";
import { fetchDashboard } from "../service/dashboard.service";
import SocialMediaCards from "../components/SocialMediaCards";
import StatsOverview from "../components/StatsOverview";
import ClientsTable from "../components/ClientsTable";

export default function AccountSpecialistDashboard() {
  const { data: dashboard } = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
  });

  return (
    <Stack gap={"1rem"} px={"lg"}>
      <SocialMediaCards />

      <StatsOverview
        quotations={{
          responded_count: dashboard?.quotations?.responded_count ?? 0,
          requested_count: dashboard?.quotations?.requested_count ?? 0,
        }}
        shipments={{
          ongoing_count: dashboard?.shipments?.ongoing_count ?? 0,
          delivered_count: dashboard?.shipments?.delivered_count ?? 0,
        }}
      />

      <ClientsTable
        clients={dashboard?.clients?.clients ?? []}
        totalCount={dashboard?.clients?.total_count ?? 0}
      />
    </Stack>
  );
}
