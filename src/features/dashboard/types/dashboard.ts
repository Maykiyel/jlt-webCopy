import type { ApiResponse } from "@/types/api";

interface DashboardUser {
  full_name?: string;
  role?: string;
  company?: string;
  image_path?: string;
}

export interface ClientDashboardData {
  user: DashboardUser & {
    full_name: string;
  };
  shipments: {
    ongoing_count: number;
    completed_count: number;
  };
  quotations: {
    requested_count: number;
    responded_count: number;
  };
}

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

export interface MarketingDashboardData {
  user: DashboardUser & {
    role: string;
  };
  views_count: string;
  clients_count: string;
  total_videos: string;
  total_articles: string;
}

export interface HumanResourceDashboardData {
  message: string;
}

export type DashboardData =
  | ClientDashboardData
  | AccountSpecialistDashboardData
  | MarketingDashboardData
  | HumanResourceDashboardData;

export type DashboardResponse = ApiResponse<DashboardData>;

export function isClientDashboard(
  data: DashboardData,
): data is ClientDashboardData {
  return (
    "shipments" in data &&
    "quotations" in data &&
    "completed_count" in data.shipments
  );
}

export function isAccountSpecialistDashboard(
  data: DashboardData,
): data is AccountSpecialistDashboardData {
  return (
    "clients" in data &&
    "shipments" in data &&
    "quotations" in data &&
    "responded_count" in data.quotations
  );
}

export function isMarketingDashboard(
  data: DashboardData,
): data is MarketingDashboardData {
  return (
    "views_count" in data &&
    "clients_count" in data &&
    "total_videos" in data &&
    "total_articles" in data
  );
}

export function isHumanResourceDashboard(
  data: DashboardData,
): data is HumanResourceDashboardData {
  return "message" in data && !isMarketingDashboard(data);
}
