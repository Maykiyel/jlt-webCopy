import { apiClient } from "@/lib/api/client";
import type {
  QuotationsIndexResponse,
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
