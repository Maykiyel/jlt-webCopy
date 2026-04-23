import { DELETE, GET, POST, PUT } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api";

export type DetailConfigType = "DROPDOWN" | "TEXT" | "DATE PICKER";

export interface DetailConfigOption {
  id?: number;
  name: string;
}

export interface DetailConfigResource {
  id: number;
  label: string;
  type: DetailConfigType;
  count?: number;
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
  options?: { name: string }[];
}

export interface UpdateDetailConfigRequest {
  label: string;
  options?: DetailConfigOption[];
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

  async getDetailsConfig(
    id: number,
  ): Promise<ApiResponse<DetailConfigResource>> {
    return GET<ApiResponse<DetailConfigResource>>(`/configs/details/${id}`);
  },

  async updateDetailsConfig(
    id: number,
    payload: UpdateDetailConfigRequest,
  ): Promise<ApiResponse<DetailConfigResource>> {
    return PUT<ApiResponse<DetailConfigResource>>(
      `/configs/details/${id}`,
      payload,
    );
  },

  async deleteDetailsConfig(id: number): Promise<ApiResponse<null>> {
    return DELETE<ApiResponse<null>>(`/configs/details/${id}`);
  },
};
