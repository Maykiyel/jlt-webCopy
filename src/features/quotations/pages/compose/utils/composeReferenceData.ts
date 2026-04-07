import {
  PLACEHOLDER_GLOBAL_BILLING_SETTINGS,
  PLACEHOLDER_MESSAGE_TEMPLATES,
  PLACEHOLDER_QUOTATION_TEMPLATES,
  PLACEHOLDER_STANDARD_TEMPLATES,
} from "@/features/quotations/data/composePlaceholders";

export function getComposeReferenceData() {
  return {
    quotationTemplates: PLACEHOLDER_QUOTATION_TEMPLATES,
    billingSettings: PLACEHOLDER_GLOBAL_BILLING_SETTINGS,
    messageTemplates: PLACEHOLDER_MESSAGE_TEMPLATES,
    standardTemplates: PLACEHOLDER_STANDARD_TEMPLATES,
  };
}
