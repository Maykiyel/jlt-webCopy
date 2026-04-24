import { DELETE, GET, POST, PUT } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api";

export interface StandardTemplateSummaryResource {
  id: number;
  template_name: string;
}

export interface StandardTemplateResource extends StandardTemplateSummaryResource {
  policies: string;
  terms_and_conditions: string;
  banking_details: string;
  footer: string;
}

export interface StoreStandardTemplateRequest {
  template_name: string;
  policies: string;
  terms_and_conditions: string;
  banking_details: string;
  footer: string;
}

export type UpdateStandardTemplateRequest = Partial<StoreStandardTemplateRequest>;

export const standardTemplatesService = {
  async getStandardTemplates(): Promise<
    ApiResponse<StandardTemplateSummaryResource[]>
  > {
    return GET<ApiResponse<StandardTemplateSummaryResource[]>>(
      "/configs/standard-templates",
    );
  },

  async getStandardTemplate(
    id: number,
  ): Promise<ApiResponse<StandardTemplateResource>> {
    return GET<ApiResponse<StandardTemplateResource>>(
      `/configs/standard-templates/${id}`,
    );
  },

  async createStandardTemplate(
    payload: StoreStandardTemplateRequest,
  ): Promise<ApiResponse<StandardTemplateResource>> {
    return POST<ApiResponse<StandardTemplateResource>>(
      "/configs/standard-templates",
      payload,
    );
  },

  async updateStandardTemplate(
    id: number,
    payload: UpdateStandardTemplateRequest,
  ): Promise<ApiResponse<StandardTemplateResource>> {
    return PUT<ApiResponse<StandardTemplateResource>>(
      `/configs/standard-templates/${id}`,
      payload,
    );
  },

  async deleteStandardTemplate(id: number): Promise<ApiResponse<null>> {
    return DELETE<ApiResponse<null>>(`/configs/standard-templates/${id}`);
  },
};
