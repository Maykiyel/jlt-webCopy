import { apiClient } from "@/lib/api/client";
import type {
  ShipmentsIndexResponse,
  ShipmentResource,
  ShipmentStatus,
  /*PermitsIndexResponse,
  PermitResource,
  LicensesIndexResponse,
  LicenseResource,*/
} from "../types/shipments.types";
import { getMockShipment } from "../data/mockShipments";

export interface FetchShipmentsParams {
  status: ShipmentStatus;
  search?: string;
  perPage?: number;
  clientId?: number;
}

export async function fetchShipments(
  params: FetchShipmentsParams,
): Promise<ShipmentsIndexResponse> {
  try {
    const response = await apiClient.get<{ data: ShipmentsIndexResponse }>(
      "/shipments",
      {
        params: {
          "filter[status]": params.status,
          ...(params.search ? { search: params.search } : {}),
          ...(params.perPage ? { perPage: params.perPage } : {}),
          ...(params.clientId ? { client_id: params.clientId } : {}),
        },
      },
    );
    return response.data.data || { shipments: [], pagination: { count: 0, per_page: params.perPage || 10, total: 0 } };
  } catch (error) {
    return { shipments: [], pagination: { count: 0, per_page: params.perPage || 10, total: 0 } };
  }
}

export async function fetchShipment(id: string): Promise<ShipmentResource> {
  try {
    const response = await apiClient.get<{ data: ShipmentResource }>(
      `/shipments/${id}`,
    );
    const data = response.data.data;
    if (!data) {
      throw new Error(`Shipment with ID ${id} not found`);
    }
    return data;
  } catch (error) {
    // ⚠️ TEMPORARY: Using mock data as fallback for development
    // This should be REMOVED once the backend API is live and returning real data
    console.warn(
      `⚠️ Failed to fetch shipment ${id} from API. Using mock data for development.`,
      error,
    );
    
    const mockData = getMockShipment(id);
    if (mockData) {
      return mockData;
    }
    
    console.error(`Failed to fetch shipment ${id} and no mock data available:`, error);
    throw error;
  }
}

/*
// ─── Permits API ──────────────────────────────────────────────────────────────

export interface FetchPermitsParams {
  search?: string;
  perPage?: number;
  clientId?: number;
}

export async function fetchPermits(
  params: FetchPermitsParams,
): Promise<PermitsIndexResponse> {
  try {
    const response = await apiClient.get<{ data: PermitsIndexResponse }>(
      "/permits",
      {
        params: {
          ...(params.search ? { search: params.search } : {}),
          ...(params.perPage ? { perPage: params.perPage } : {}),
          ...(params.clientId ? { client_id: params.clientId } : {}),
        },
      },
    );
    return response.data.data || { permits: [], pagination: { count: 0, per_page: params.perPage || 10, total: 0 } };
  } catch (error) {
    return { permits: [], pagination: { count: 0, per_page: params.perPage || 10, total: 0 } };
  }
}

export async function fetchPermit(id: string): Promise<PermitResource> {
  const response = await apiClient.get<{ data: PermitResource }>(
    `/permits/${id}`,
  );
  return response.data.data;
}

// ─── Licenses API ─────────────────────────────────────────────────────────────

export interface FetchLicensesParams {
  search?: string;
  perPage?: number;
  clientId?: number;
}

export async function fetchLicenses(
  params: FetchLicensesParams,
): Promise<LicensesIndexResponse> {
  try {
    const response = await apiClient.get<{ data: LicensesIndexResponse }>(
      "/licenses",
      {
        params: {
          ...(params.search ? { search: params.search } : {}),
          ...(params.perPage ? { perPage: params.perPage } : {}),
          ...(params.clientId ? { client_id: params.clientId } : {}),
        },
      },
    );
    return response.data.data || { licenses: [], pagination: { count: 0, per_page: params.perPage || 10, total: 0 } };
  } catch (error) {
    return { licenses: [], pagination: { count: 0, per_page: params.perPage || 10, total: 0 } };
  }
}

export async function fetchLicense(id: string): Promise<LicenseResource> {
  const response = await apiClient.get<{ data: LicenseResource }>(
    `/licenses/${id}`,
  );
  return response.data.data;
}
*/