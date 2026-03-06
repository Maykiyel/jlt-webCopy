// ─── Index response shape (web platform) ──────────────────────────────────────

export interface QuotationListItem {
  id: string;
  date: string;
  person_in_charge: string;
  commodity: string;
  conversation_id: string | null;
}

export interface QuotationClientGroup {
  client_id: number;
  name: string;
  request_count: number;
  quotations: QuotationListItem[];
}

export interface QuotationsPagination {
  count: number;
  per_page: number;
  total: number;
}

export interface QuotationsIndexResponse {
  quotations: QuotationClientGroup[];
  pagination: QuotationsPagination;
}

// ─── Full quotation resource (GET /quotations/{id}) ───────────────────────────

export interface QuotationResource {
  reference_number: string;
  client: string | null;
  account_specialist: string | null;
  status: string;
  shipment_status: "ACCEPTED";
  created_at: string;
  updated_at: string;
  company: {
    name: string;
    address: string;
    contact_person: string;
    contact_number: string;
    email: string;
  };
  service: {
    type: string;
    transport_mode: string;
    options: string[];
  };
  commodity: {
    commodity: string;
    cargo_type: string;
    container_size: string | null;
  };
  shipment: {
    origin: string;
    destination: string;
  };
  quotation_file:
    | { id: number; file_name: string; file_url: string }[]
    | "No file available.";
  documents:
    | { id: number; file_name: string; file_url: string }[]
    | "No documents available.";
  remarks: string | null;
  conversation_id: string;
}

// ─── Status filter ─────────────────────────────────────────────────────────────

export const QUOTATION_STATUS = {
  REQUESTED: "REQUESTED",
  RESPONDED: "RESPONDED",
  ACCEPTED: "ACCEPTED",
  DISCARDED: "DISCARDED",
} as const;

export type QuotationStatus =
  (typeof QUOTATION_STATUS)[keyof typeof QUOTATION_STATUS];
