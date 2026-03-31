// TODO: replace each export with a useQuery call when API endpoints are available

import type {
  GlobalBillingSettings,
  MessageTemplate,
  QuotationTemplate,
  StandardTemplate,
} from "../types/compose.types";

// TODO: replace with useQuery when GET /quotation-templates is available
export const PLACEHOLDER_QUOTATION_TEMPLATES: QuotationTemplate[] = [
  {
    id: "intl-freight-forwarding",
    name: "International Freight Forwarding, Customs Clearance & Delivery",
    custom_fields: [
      // { id: "service_level", label: "Service Level", type: "text" },
      // { id: "rate_validity", label: "Rate Validity", type: "text" },
      // { id: "payment_terms", label: "Payment Terms", type: "text" },
      // { id: "business_type", label: "Business Type", type: "text" },
      // {
      //   id: "service_type",
      //   label: "Service Type",
      //   type: "select",
      //   options: ["Import", "Export"],
      // },
      // {
      //   id: "transport_mode",
      //   label: "Transport Mode",
      //   type: "select",
      //   options: ["Sea", "Air"],
      // },
      // { id: "port_of_origin", label: "Port of Origin", type: "text" },
      // {
      //   id: "port_of_destination",
      //   label: "Port of Destination",
      //   type: "text",
      // },
    ],
    billing_sections: [
      {
        id: "third-party-charges",
        title: "Third-Party Receipt Charges",
        available_charges: [
          "Bureau of Customs Processing Fee",
          "Port Handling Fee",
          "Arrastre Charge",
          "Wharfage Fee",
        ],
      },
      {
        id: "jltcb-service-charges",
        title: "JLTCB Service Charges",
        available_charges: [
          "Customs Brokerage Fee",
          "Documentation Fee",
          "Trucking Fee",
        ],
      },
    ],
  },
];

// TODO: replace with useQuery when GET /billing-settings is available
export const PLACEHOLDER_GLOBAL_BILLING_SETTINGS: GlobalBillingSettings = {
  receipt_charges: [
    "Bureau of Customs Processing Fee",
    "Port Handling Fee",
    "Arrastre Charge",
    "Wharfage Fee",
    "Customs Brokerage Fee",
    "Documentation Fee",
    "Trucking Fee",
  ],
  currencies: ["PHP", "USD", "EUR"],
  uoms: ["Per Container", "Per BL", "Per Shipment"],
};

// TODO: replace with useQuery when GET /message-templates is available
export const PLACEHOLDER_MESSAGE_TEMPLATES: MessageTemplate[] = [
  {
    id: "msg-1",
    label: "MSG 1",
    content:
      "Dear Ma'am/Sir,\n\nThank you for your inquiry. We are pleased to assist you with your customs and freight requirements.",
  },
  {
    id: "msg-2",
    label: "MSG 2",
    content:
      "Good day!\n\nWe are pleased to offer our services for your shipment requirements.",
  },
];

// TODO: replace with useQuery when GET /standard-templates is available
export const PLACEHOLDER_STANDARD_TEMPLATES: StandardTemplate[] = [
  {
    id: "standard-freight-1",
    name: "Standard Freight Forwarding T&C",
    policies:
      "By signing this proposal, you confirm that you have read and understood the Terms and Conditions and agree to be bound by them.",
    terms_and_condition:
      "1. The service charge shall include all customs clearance processing.\n2. Payment shall be made within 30 days of invoice date.\n3. All charges are subject to change based on prevailing government rates.",
    banking_details:
      "Bank Name: Metropolitan Bank and Trust Company (Metrobank)\nAccount Name: Jill L. Tolentino Customs Brokerage\nAccount Number: 250 3 25008759 5\nType of Account: Savings\nBranch: Ongpin 7345201",
    footer: "CHILL, WE GOT YOU!",
  },
];
