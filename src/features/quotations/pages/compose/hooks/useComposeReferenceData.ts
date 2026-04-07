import { useQuery } from "@tanstack/react-query";
import {
  fetchComposeBillingSettings,
  fetchComposeMessageTemplates,
  fetchComposeQuotationTemplates,
  fetchComposeStandardTemplates,
  composeReferenceQueryKeys,
} from "@/features/quotations/pages/compose/utils/composeReferenceData";

export function useComposeQuotationTemplates() {
  return useQuery({
    queryKey: composeReferenceQueryKeys.quotationTemplates(),
    queryFn: fetchComposeQuotationTemplates,
  });
}

export function useComposeBillingSettings() {
  return useQuery({
    queryKey: composeReferenceQueryKeys.billingSettings(),
    queryFn: fetchComposeBillingSettings,
  });
}

export function useComposeMessageTemplates() {
  return useQuery({
    queryKey: composeReferenceQueryKeys.messageTemplates(),
    queryFn: fetchComposeMessageTemplates,
  });
}

export function useComposeStandardTemplates() {
  return useQuery({
    queryKey: composeReferenceQueryKeys.standardTemplates(),
    queryFn: fetchComposeStandardTemplates,
  });
}
