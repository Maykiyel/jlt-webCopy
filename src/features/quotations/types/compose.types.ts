import type {
  BillingDetailsValues,
  QuotationDetailsValues,
  SignatoryValues,
  TermsValues,
} from "@/features/quotations/schemas/compose.schema";
import type { QuotationResource } from "@/features/quotations/types/quotations.types";

// Custom field in Quotation Details
export interface CustomField {
  id: string;
  label: string;
  type: "text" | "select" | "date";
  options?: string[];
}

export interface ClientInformationField {
  id: string;
  label: string;
  value?: string | number | boolean | null;
}

export interface ClientInformationValue {
  label: string;
  value: string | number | boolean | null;
}

// Billing
export interface BillingSection {
  id: string;
  title: string;
  available_charges: string[];
}

// From Tools -> Quotation Templates
export interface QuotationTemplate {
  id: string;
  name: string;
  client_information_fields?: ClientInformationField[];
  custom_fields: CustomField[];
  billing_sections: BillingSection[];
}

// From global settings (gear icon) - currency and UOM are fixed for now
export interface GlobalBillingSettings {
  receipt_charges: string[];
  currencies: string[];
  uoms: string[];
}

// Message templates
export interface MessageTemplate {
  id: string;
  label: string;
  content: string;
}

// Standard Quotation Template (T&C)
export interface StandardTemplateSummary {
  id: string;
  name: string;
}

export interface StandardTemplate extends StandardTemplateSummary {
  policies: string;
  terms_and_condition: string;
  banking_details: string;
  footer: string;
}

export interface QuotationViewerState {
  quotation: QuotationResource;
  template: QuotationTemplate;
  clientInformationFields?: ClientInformationValue[];
  quotationDetails: QuotationDetailsValues;
  billingDetails: BillingDetailsValues;
  terms: TermsValues;
  signatory: SignatoryValues;
}
