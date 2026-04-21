import type { ApiResponse } from "./api";

export type TemplateFilterType = "EXPORT" | "IMPORT" | "BUSINESS SOLUTION";
export type ServiceType = "LOGISTICS" | "REGULATORY";

export interface QuotationTemplateResource {
  id: number;
  name: string;
  service_type: ServiceType;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TemplateCharge {
  id?: number;
  name: string;
  receipt_option_ids: number[];
}

export interface StoreTemplateRequest {
  name: string;
  service_type: ServiceType;
  detail_config_ids: number[];
  quotation_field_ids: number[];
  template_charges: TemplateCharge[];
}

export type UpdateTemplateRequest = StoreTemplateRequest;

export interface ToggleTemplateStatusRequest {
  status: boolean;
}

export interface QuotationTemplate {
  id: number;
  name: string;
  serviceType: ServiceType;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type TemplatesListResponse = ApiResponse<QuotationTemplateResource[]>;
export type TemplateResponse = ApiResponse<QuotationTemplateResource>;
export type DeleteTemplateResponse = ApiResponse<null>;
