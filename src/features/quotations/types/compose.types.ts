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
  type: "text" | "select";
  options?: string[];
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
export interface StandardTemplate {
  id: string;
  name: string;
  policies: string;
  terms_and_condition: string;
  banking_details: string;
  footer: string;
}

export interface QuotationViewerState {
  quotation: QuotationResource;
  template: QuotationTemplate;
  quotationDetails: QuotationDetailsValues;
  billingDetails: BillingDetailsValues;
  terms: TermsValues;
  signatory: SignatoryValues;
}
