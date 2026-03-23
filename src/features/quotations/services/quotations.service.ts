import { apiClient } from "@/lib/api/client";
import type {
  QuotationsIndexResponse,
  QuotationResource,
  QuotationFileResource,
  QuotationStatus,
} from "../types/quotations.types";

export interface FetchQuotationsParams {
  status: QuotationStatus;
  search?: string;
  perPage?: number;
  clientId?: number;
}

export async function fetchQuotations(
  params: FetchQuotationsParams,
): Promise<QuotationsIndexResponse> {
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
  return response.data.data;
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
  const response = await apiClient.post<{ data: QuotationResource }>(
    `/quotations/${id}`,
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
