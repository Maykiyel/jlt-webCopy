import { apiClient } from "@/lib/api/client";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ClientRow {
  id: number;
  full_name: string;
  total_shipment: number;
}

export interface AccountSpecialistDashboardData {
  quotations: {
    responded_count: number;
    requested_count: number;
    total_count: number;
  };
  shipments: {
    ongoing_count: number;
    delivered_count: number;
    total_count: number;
  };
  clients: {
    total_count: number;
    clients: ClientRow[];
  };
}

// ─── Fetch functions ──────────────────────────────────────────────────────────

export const fetchDashboard =
  async (): Promise<AccountSpecialistDashboardData> => {
    try {
      const res = await apiClient.get("/dashboard");
      return res.data.data || {
        quotations: { responded_count: 0, requested_count: 0, total_count: 0 },
        shipments: { ongoing_count: 0, delivered_count: 0, total_count: 0 },
        clients: { total_count: 0, clients: [] },
      };
    } catch (error) {
      return {
        quotations: { responded_count: 0, requested_count: 0, total_count: 0 },
        shipments: { ongoing_count: 0, delivered_count: 0, total_count: 0 },
        clients: { total_count: 0, clients: [] },
      };
    }
  };
