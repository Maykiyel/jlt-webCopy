import { GET, POST } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api";

export type DetailConfigType = "DROPDOWN" | "TEXT" | "DATE PICKER";

export interface DetailConfigOption {
  id: number;
  name: string;
}

export interface DetailConfigResource {
  id: number;
  label: string;
  type: DetailConfigType;
  dropdown_options?: DetailConfigOption[];
  dropdownOptions?: DetailConfigOption[];
}

export interface DetailsConfigGroups {
  DROPDOWN?: DetailConfigResource[];
  TEXT?: DetailConfigResource[];
  "DATE PICKER"?: DetailConfigResource[];
}

export interface StoreDetailConfigRequest {
  label: string;
  type: DetailConfigType;
  options?: string[];
}

export const detailsConfigsService = {
  async getDetailsConfigs(): Promise<ApiResponse<DetailsConfigGroups>> {
    return GET<ApiResponse<DetailsConfigGroups>>("/configs/details");
  },

  async createDetailsConfig(
    payload: StoreDetailConfigRequest,
  ): Promise<ApiResponse<DetailConfigResource>> {
    return POST<ApiResponse<DetailConfigResource>>("/configs/details", payload);
  },
};
