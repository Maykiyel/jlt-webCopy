// ─── Index response shape (web platform) ──────────────────────────────────────

export interface ShipmentListItem {
  reference: string;
  client_name: string;
  client_id?: number;
  destination: string;
  eta: string;
  etd: string;
  status: string;
}

export interface ShipmentClientGroup {
  client_id: number;
  name: string;
  shipment_count: number;
  shipments: ShipmentListItem[];
}

export interface ShipmentsPagination {
  count: number;
  per_page: number;
  total: number;
}

export interface ShipmentsIndexResponse {
  shipments: ShipmentClientGroup[];
  pagination: ShipmentsPagination;
}

// ─── Full shipment resource (GET /shipments/{id}) ───────────────────────────

export interface ShipmentResource {
  reference: string;
  client: {
    full_name: string;
    company_name: string;
    contact_number: string;
    email: string;
    imageUrl?: string;
  } | null;
  status: string;
  created_at: string;
  updated_at: string;

  shipment_details: {
    service_type: string;
    freight_transport_mode: string;
    service: string;
    commodity: string;
    volume_dimension: string;
    origin: string;
    destination: string;
    details_remarks: string | null;
  };

  consignee_details: {
    company_name: string;
    company_address: string;
    contact_person: string;
    contact_number: string;
    email: string;
  };

  person_in_charge: {
    name: string;
    remarks: string | null;
  } | null;

  billing_summary: {
    terms_of_payment: string;

    description_of_charges: {
      value: string; // overall value
      fields: {
        bureau_of_customs_accreditation_fee: string;
        certificate_of_accreditation: string;
      };
    };

    jltcb_service_charges: {
      value: string; // overall value
      fields: {
        certificate_of_accreditation: string;
        royal_fee: string;
      };
    };

    estimated_total_landed_cost: string;
  } | null;

  origin: string;
  destination: string;
  eta: string;
  etd: string;
  commodity: string;
  container_size: string | null;
  remarks: string | null;
}

// ─── Status filter ─────────────────────────────────────────────────────────────

export const SHIPMENT_STATUS = {
  ONGOING: "ONGOING",
  DELIVERED: "DELIVERED",
} as const;

export type ShipmentStatus =
  (typeof SHIPMENT_STATUS)[keyof typeof SHIPMENT_STATUS];

//Confirmation for details regarding Permits and Licenses is still pending, so these are just placeholders for now. 
// ─── Permits ──────────────────────────────────────────────────────────────────

export interface PermitListItem {
  id: string;
  permit_number: string;
  client_name: string;
  permit_type: string;
  issued_date: string;
  expiry_date: string;
  status: string;
}

export interface PermitClientGroup {
  client_id: number;
  name: string;
  permit_count: number;
  permits: PermitListItem[];
}

export interface PermitsIndexResponse {
  permits: PermitClientGroup[];
  pagination: ShipmentsPagination;
}

export interface PermitResource {
  id: string;
  permit_number: string;
  client: {
    full_name: string;
    company_name: string;
    contact_number: string;
    email: string;
  } | null;
  permit_type: string;
  issued_date: string;
  expiry_date: string;
  status: string;
  created_at: string;
  updated_at: string;
  remarks: string | null;
}

// ─── Licenses ─────────────────────────────────────────────────────────────────

export interface LicenseListItem {
  id: string;
  license_number: string;
  client_name: string;
  license_type: string;
  issued_date: string;
  expiry_date: string;
  status: string;
}

export interface LicenseClientGroup {
  client_id: number;
  name: string;
  license_count: number;
  licenses: LicenseListItem[];
}

export interface LicensesIndexResponse {
  licenses: LicenseClientGroup[];
  pagination: ShipmentsPagination;
}

export interface LicenseResource {
  id: string;
  license_number: string;
  client: {
    full_name: string;
    company_name: string;
    contact_number: string;
    email: string;
  } | null;
  license_type: string;
  issued_date: string;
  expiry_date: string;
  status: string;
  created_at: string;
  updated_at: string;
  remarks: string | null;
}
