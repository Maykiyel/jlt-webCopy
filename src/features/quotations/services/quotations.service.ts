import { apiClient } from "@/lib/api/client";
import type {
  QuotationsIndexResponse,
  RespondedQuotationsResponse,
  RespondedQuotationListItem,
  QuotationResource,
  QuotationFileResource,
  QuotationStatus,
} from "../types/quotations.types";

export type ComposeTemplateType = "IMPORT" | "EXPORT" | "BUSINESS SOLUTION";

export interface QuotationTemplateSummaryApi {
  id: number;
  name: string;
  service_type: "REGULATORY" | "LOGISTICS";
  is_active: boolean;
}

export interface DetailsConfigOptionApi {
  id: number;
  name: string;
}

export interface DetailsConfigApi {
  id: number;
  label: string;
  type: "DROPDOWN" | "TEXT" | "DATE PICKER";
  dropdown_options?: DetailsConfigOptionApi[];
}

export interface BillingConfigApi {
  id: number;
  label: string;
  type: "RECEIPT CHARGES" | "CURRENCY" | "UOM";
}

export interface TemplateChargeApi {
  id: number;
  name: string;
  receipt_charge_options: BillingConfigApi[];
}

export interface QuotationTemplateDetailsApi extends QuotationTemplateSummaryApi {
  detail_configs: DetailsConfigApi[];
  template_charges: TemplateChargeApi[];
}

export interface MessageTemplateApi {
  id: number;
  template_name: string;
  message: string;
}

export interface StandardTemplateSummaryApi {
  id: number;
  template_name: string;
}

export interface StandardTemplateApi extends StandardTemplateSummaryApi {
  policies: string;
  terms_and_conditions: string;
  banking_details: string;
  footer: string;
}

export interface QuotationClientInputApi {
  label: string;
  value: string | number | boolean | null;
}

export interface FetchQuotationsParams {
  status: QuotationStatus;
  search?: string;
  perPage?: number;
  clientId?: number;
}

export async function fetchQuotations(
  params: FetchQuotationsParams,
): Promise<QuotationsIndexResponse> {
  try {
    const response = await apiClient.get<{ data: QuotationsIndexResponse }>(
      "/quotations",
      {
        params: {
          "filter[status]": params.status,
          ...(params.search ? { search: params.search } : {}),
          ...(params.perPage ? { perPage: params.perPage } : {}),
          ...(params.clientId ? { client_id: params.clientId } : {}),
        },
      },
    );
    return (
      response.data.data || {
        quotations: [],
        pagination: { count: 0, per_page: params.perPage || 10, total: 0 },
      }
    );
  } catch {
    return {
      quotations: [],
      pagination: { count: 0, per_page: params.perPage || 10, total: 0 },
    };
  }
}

export async function fetchQuotation(id: string): Promise<QuotationResource> {
  const response = await apiClient.get<{ data: QuotationResource }>(
    `/quotations/${id}`,
  );
  return response.data.data;
}

export async function updateQuotationAssignee(
  id: string,
  asId: number,
): Promise<QuotationResource> {
  const response = await apiClient.put<{ data: QuotationResource }>(
    `/quotations/${id}/reassign-specialist`,
    {
      as_id: asId,
    },
  );
  return response.data.data;
}

export async function fetchQuotationFiles(
  id: string,
  type: "REQUESTED" | "PROPOSAL" = "REQUESTED",
): Promise<QuotationFileResource[]> {
  const response = await apiClient.get<{
    data: QuotationFileResource[] | string;
  }>(`/quotations/${id}/files`, { params: { type } });
  if (typeof response.data.data === "string") return [];
  return response.data.data;
}

interface FetchRespondedQuotationsParams {
  search?: string;
  perPage?: number;
}

export async function fetchRespondedQuotations(
  params: FetchRespondedQuotationsParams,
): Promise<RespondedQuotationsResponse> {
  const response = await apiClient.get<{
    data: RespondedQuotationsResponse | [];
  }>("/quotations", {
    params: {
      "filter[status]": "RESPONDED",
      ...(params.search ? { search: params.search } : {}),
      ...(params.perPage ? { perPage: params.perPage } : {}),
    },
  });

  if (Array.isArray(response.data.data)) {
    return {
      quotations: [] as RespondedQuotationListItem[],
      pagination: {
        count: 0,
        per_page: params.perPage ?? 10,
        total: 0,
      },
    };
  }

  return response.data.data;
}

export async function fetchAcceptedQuotations(
  params: FetchRespondedQuotationsParams,
): Promise<RespondedQuotationsResponse> {
  const response = await apiClient.get<{
    data: RespondedQuotationsResponse | [];
  }>("/quotations", {
    params: {
      "filter[status]": "ACCEPTED",
      ...(params.search ? { search: params.search } : {}),
      ...(params.perPage ? { perPage: params.perPage } : {}),
    },
  });

  if (Array.isArray(response.data.data)) {
    return {
      quotations: [] as RespondedQuotationListItem[],
      pagination: {
        count: 0,
        per_page: params.perPage ?? 10,
        total: 0,
      },
    };
  }

  return response.data.data;
}

export async function fetchQuotationTemplates(
  type?: ComposeTemplateType,
): Promise<QuotationTemplateSummaryApi[]> {
  const response = await apiClient.get<{ data: QuotationTemplateSummaryApi[] }>(
    "/templates",
    {
      params: {
        ...(type ? { type } : {}),
      },
    },
  );

  return Array.isArray(response.data.data) ? response.data.data : [];
}

export async function fetchQuotationTemplate(
  templateId: string,
): Promise<QuotationTemplateDetailsApi> {
  const response = await apiClient.get<{ data: QuotationTemplateDetailsApi }>(
    `/templates/${templateId}`,
  );

  return response.data.data;
}

export async function fetchBillingConfigurations(): Promise<
  Record<string, BillingConfigApi[]>
> {
  const response = await apiClient.get<{
    data: Record<string, BillingConfigApi[]>;
  }>("/configs/billing");

  return response.data.data ?? {};
}

export async function fetchMessageTemplates(): Promise<MessageTemplateApi[]> {
  const response = await apiClient.get<{ data: MessageTemplateApi[] }>(
    "/message-templates",
  );

  return Array.isArray(response.data.data) ? response.data.data : [];
}

export async function fetchStandardTemplates(): Promise<
  StandardTemplateSummaryApi[]
> {
  const response = await apiClient.get<{ data: StandardTemplateSummaryApi[] }>(
    "/configs/standard-templates",
  );

  return Array.isArray(response.data.data) ? response.data.data : [];
}

export async function fetchStandardTemplate(
  templateId: string,
): Promise<StandardTemplateApi> {
  const response = await apiClient.get<{ data: StandardTemplateApi }>(
    `/configs/standard-templates/${templateId}`,
  );

  return response.data.data;
}

export async function fetchQuotationClientInputs(
  quotationId: string,
  templateId: string,
): Promise<QuotationClientInputApi[]> {
  const parsedTemplateId = Number(templateId);

  if (Number.isNaN(parsedTemplateId)) {
    throw new Error("Invalid template id.");
  }

  const response = await apiClient.get<{ data: QuotationClientInputApi[] }>(
    `/quotations/${quotationId}/client-inputs`,
    {
      params: { template_id: parsedTemplateId },
    },
  );

  return Array.isArray(response.data.data) ? response.data.data : [];
}

export async function createIssuedQuotation(
  quotationId: string,
  payload: FormData,
): Promise<unknown> {
  const response = await apiClient.post<{ data: unknown }>(
    `/quotations/${quotationId}/issued-quotations`,
    payload,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data.data;
}
