/**
 * TEMPORARY MOCK DATA FOR DEVELOPMENT
 * 
 * ⚠️ WARNING: This file contains hardcoded mock data and should be REMOVED before deploying to production/live server.
 * Replace this with actual API calls once the backend is ready to serve real shipment data.
 * 
 * @deprecated Remove this file when backend API is ready
 */

import type { ShipmentResource } from "../types/shipments.types";

export const mockShipments: Record<string, ShipmentResource> = {
  "IM-09-2025-001": {
    reference: "IM-09-2025-001",
    client: {
      full_name: "JENNY CARLA DELA CRUZ",
      company_name: "JDC Imports Inc.",
      contact_number: "+63-2-8123-4567",
      email: "jenny@jdcimports.com",
    },
    status: "DELIVERED",
    created_at: "2025-08-15T10:30:00Z",
    updated_at: "2025-09-01T14:45:00Z",
    shipment_details: {
      service_type: "Import",
      freight_transport_mode: "Air Freight",
      service: "Door-to-Door",
      commodity: "Electronics",
      volume_dimension: "2.5m³ (50kg)",
      origin: "SHANGHAI, CHINA",
      destination: "CLARK, PAMPANGA",
      details_remarks: "Fragile items - handle with care. Contains 100 units of circuit boards.",
    },
    consignee_details: {
      company_name: "JDC Imports Inc.",
      company_address: "123 Industrial Park, Clark, Pampanga 2009",
      contact_person: "MARIA SANTOS",
      contact_number: "+63-917-123-4567",
      email: "maria@jdcimports.com",
    },
    person_in_charge: {
      name: "ROBERT DELA CRUZ",
      remarks: "Shipment arrived at Clark on Sept 1. All items inspected and verified. Received by: Maria Santos",
    },
    billing_summary: {
      terms_of_payment: "Net 30 days",
      description_of_charges: {
        value: "₱15,000.00",
        fields: {
          bureau_of_customs_accreditation_fee: "₱5,000.00",
          certificate_of_accreditation: "₱10,000.00",
        },
      },
      jltcb_service_charges: {
        value: "₱8,000.00",
        fields: {
          certificate_of_accreditation: "₱3,000.00",
          royal_fee: "₱5,000.00",
        },
      },
      estimated_total_landed_cost: "₱23,000.00",
    },
    origin: "SHANGHAI",
    destination: "CLARK",
    eta: "2025-09-10",
    etd: "2025-09-01",
    commodity: "Electronics",
    container_size: "40ft",
    remarks: "Delivered on schedule. Received by: Maria Santos",
  },

  "EX-09-2025-002": {
    reference: "EX-09-2025-002",
    client: {
      full_name: "JUAN DELA CRUZ",
      company_name: "JDC Exports Corp.",
      contact_number: "+63-2-8234-5678",
      email: "juan@jdcexports.com",
    },
    status: "ONGOING",
    created_at: "2025-09-05T08:00:00Z",
    updated_at: "2025-09-15T11:20:00Z",
    shipment_details: {
      service_type: "Export",
      freight_transport_mode: "Sea Freight",
      service: "CIF",
      commodity: "Agricultural Products",
      volume_dimension: "15m³ (2,500kg)",
      origin: "MANILA PORT",
      destination: "SINGAPORE PORT",
      details_remarks: "Fresh produce shipment. Temperature controlled. Expected arrival: Sept 20.",
    },
    consignee_details: {
      company_name: "Singapore Trade Partners Ltd.",
      company_address: "456 Marina Bay, Singapore 018960",
      contact_person: "DAVID LIM",
      contact_number: "+65-6123-4567",
      email: "david@sgtradepart.com",
    },
    person_in_charge: {
      name: "PATRICIA REYES",
      remarks: "Shipment departed Manila Port on Sept 5. Currently in transit. Last scanned at South China Sea on Sept 12.",
    },
    billing_summary: {
      terms_of_payment: "Advance Payment",
      description_of_charges: {
        value: "₱20,000.00",
        fields: {
          bureau_of_customs_accreditation_fee: "₱7,000.00",
          certificate_of_accreditation: "₱13,000.00",
        },
      },
      jltcb_service_charges: {
        value: "₱12,000.00",
        fields: {
          certificate_of_accreditation: "₱4,000.00",
          royal_fee: "₱8,000.00",
        },
      },
      estimated_total_landed_cost: "₱32,000.00",
    },
    origin: "MANILA",
    destination: "SINGAPORE",
    eta: "2025-09-20",
    etd: "2025-09-05",
    commodity: "Agricultural Products",
    container_size: "20ft",
    remarks: "In transit. Last scanned at Port of Manila on Sept 15.",
  },

  "IM-09-2025-003": {
    reference: "IM-09-2025-003",
    client: {
      full_name: "TRISHA NUESTRO",
      company_name: "Nuestro Trading International",
      contact_number: "+63-2-8345-6789",
      email: "trisha@nuestrointernational.com",
    },
    status: "DELIVERED",
    created_at: "2025-08-20T09:15:00Z",
    updated_at: "2025-08-28T16:30:00Z",
    shipment_details: {
      service_type: "Import",
      freight_transport_mode: "Sea Freight",
      service: "FOB",
      commodity: "Textiles & Garments",
      volume_dimension: "20m³ (3,000kg)",
      origin: "HONG KONG PORT",
      destination: "MANILA PORT",
      details_remarks: "Clothing items - 500 pieces total. All items labeled and documented.",
    },
    consignee_details: {
      company_name: "Nuestro Trading International",
      company_address: "789 Trade Center, Makati City 1200",
      contact_person: "CARLOS NUESTRO",
      contact_number: "+63-917-234-5678",
      email: "carlos@nuestrointernational.com",
    },
    person_in_charge: {
      name: "FRANCISCO SANTOS",
      remarks: "Shipment arrived at Manila Port on Aug 28. All items inspected and cleared by customs.",
    },
    billing_summary: {
      terms_of_payment: "Net 15 days",
      description_of_charges: {
        value: "₱18,000.00",
        fields: {
          bureau_of_customs_accreditation_fee: "₱6,000.00",
          certificate_of_accreditation: "₱12,000.00",
        },
      },
      jltcb_service_charges: {
        value: "₱9,000.00",
        fields: {
          certificate_of_accreditation: "₱4,000.00",
          royal_fee: "₱5,000.00",
        },
      },
      estimated_total_landed_cost: "₱27,000.00",
    },
    origin: "HONG KONG",
    destination: "MANILA",
    eta: "2025-08-28",
    etd: "2025-08-20",
    commodity: "Textiles",
    container_size: "40ft",
    remarks: "Successfully delivered. All items inspected and verified.",
  },
};


/**
 * Get mock shipment data by reference ID
 * @deprecated Remove when backend API is ready
 */
export function getMockShipment(reference: string): ShipmentResource | undefined {
  return mockShipments[reference];
}
