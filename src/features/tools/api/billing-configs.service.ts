import { DELETE, GET, POST, PUT } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api";

export type BillingConfigType = "RECEIPT CHARGES" | "CURRENCY" | "UOM";

export interface BillingConfigResource {
  id: number;
  label: string;
  type: BillingConfigType;
}

export interface BillingConfigGroups {
  "RECEIPT CHARGES"?: BillingConfigResource[];
  CURRENCY?: BillingConfigResource[];
  UOM?: BillingConfigResource[];
}

export interface StoreBillingConfigRequest {
  label: string;
  type: BillingConfigType;
}

export interface UpdateBillingConfigRequest {
  label: string;
}

export const billingConfigsService = {
  async getBillingConfigs(): Promise<ApiResponse<BillingConfigGroups>> {
    return GET<ApiResponse<BillingConfigGroups>>("/configs/billing");
  },

  async createBillingConfig(
    payload: StoreBillingConfigRequest,
  ): Promise<ApiResponse<BillingConfigResource>> {
    return POST<ApiResponse<BillingConfigResource>>("/configs/billing", payload);
  },

  async updateBillingConfig(
    id: number,
    payload: UpdateBillingConfigRequest,
  ): Promise<ApiResponse<BillingConfigResource>> {
    return PUT<ApiResponse<BillingConfigResource>>(`/configs/billing/${id}`, payload);
  },

  async deleteBillingConfig(id: number): Promise<ApiResponse<null>> {
    return DELETE<ApiResponse<null>>(`/configs/billing/${id}`);
  },
};
