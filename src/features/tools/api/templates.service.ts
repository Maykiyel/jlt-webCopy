import { DELETE, GET, PATCH, POST, PUT } from "@/lib/api/client";
import type {
  DeleteTemplateResponse,
  StoreTemplateRequest,
  TemplateFilterType,
  TemplateResponse,
  TemplatesListResponse,
  UpdateTemplateRequest,
} from "@/types/templates";

export const templatesService = {
  async getTemplates(
    type?: TemplateFilterType,
  ): Promise<TemplatesListResponse> {
    const params = new URLSearchParams();

    if (type) {
      params.append("type", type);
    }

    const query = params.toString();
    const url = query ? `/templates?${query}` : "/templates";

    return GET<TemplatesListResponse>(url);
  },

  async getTemplate(id: number): Promise<TemplateResponse> {
    return GET<TemplateResponse>(`/templates/${id}`);
  },

  async createTemplate(data: StoreTemplateRequest): Promise<TemplateResponse> {
    return POST<TemplateResponse>("/templates", data);
  },

  async updateTemplate(
    id: number,
    data: UpdateTemplateRequest,
  ): Promise<TemplateResponse> {
    return PUT<TemplateResponse>(`/templates/${id}`, data);
  },

  async deleteTemplate(id: number): Promise<DeleteTemplateResponse> {
    return DELETE<DeleteTemplateResponse>(`/templates/${id}`);
  },

  async toggleTemplateStatus(
    id: number,
    status: boolean,
  ): Promise<TemplateResponse> {
    return PATCH<TemplateResponse>(`/templates/${id}/status`, { status });
  },
};
