import {
  PLACEHOLDER_GLOBAL_BILLING_SETTINGS,
  PLACEHOLDER_MESSAGE_TEMPLATES,
  PLACEHOLDER_QUOTATION_TEMPLATES,
  PLACEHOLDER_STANDARD_TEMPLATES,
} from "@/features/quotations/data/composePlaceholders";

export const composeReferenceQueryKeys = {
  root: () => ["compose-reference"] as const,
  quotationTemplates: () =>
    [...composeReferenceQueryKeys.root(), "quotation-templates"] as const,
  billingSettings: () =>
    [...composeReferenceQueryKeys.root(), "billing-settings"] as const,
  messageTemplates: () =>
    [...composeReferenceQueryKeys.root(), "message-templates"] as const,
  standardTemplates: () =>
    [...composeReferenceQueryKeys.root(), "standard-templates"] as const,
};

export async function fetchComposeQuotationTemplates() {
  // TODO: replace with GET /quotation-templates.
  return PLACEHOLDER_QUOTATION_TEMPLATES;
}

export async function fetchComposeBillingSettings() {
  // TODO: replace with GET /billing-settings.
  return PLACEHOLDER_GLOBAL_BILLING_SETTINGS;
}

export async function fetchComposeMessageTemplates() {
  // TODO: replace with GET /message-templates.
  return PLACEHOLDER_MESSAGE_TEMPLATES;
}

export async function fetchComposeStandardTemplates() {
  // TODO: replace with GET /standard-templates.
  return PLACEHOLDER_STANDARD_TEMPLATES;
}

export function getComposeReferenceData() {
  return {
    quotationTemplates: PLACEHOLDER_QUOTATION_TEMPLATES,
    billingSettings: PLACEHOLDER_GLOBAL_BILLING_SETTINGS,
    messageTemplates: PLACEHOLDER_MESSAGE_TEMPLATES,
    standardTemplates: PLACEHOLDER_STANDARD_TEMPLATES,
  };
}
