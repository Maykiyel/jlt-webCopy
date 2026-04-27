import { GET } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api";
import type { ServiceType } from "@/types/templates";

export interface QuotationFieldResource {
  id: number;
  field_name: string;
  display_name: string;
}

export const quotationFieldsService = {
  async getQuotationFields(
    type: ServiceType,
  ): Promise<ApiResponse<QuotationFieldResource[]>> {
    return GET<ApiResponse<QuotationFieldResource[]>>(
      `/quotation-fields?type=${type}`,
    );
  },
};
