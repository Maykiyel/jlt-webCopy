import { useMemo } from "react";
import { useParams } from "react-router";

type QuotationRouteParamKey = "tab" | "clientId" | "quotationId" | "template";

type QuotationRouteParams = {
  tab?: string;
  clientId?: string;
  quotationId?: string;
  template?: string;
};

type RequiredQuotationRouteParams<K extends QuotationRouteParamKey> = {
  [P in K]: string;
};

export function useQuotationRouteParams<K extends QuotationRouteParamKey>(
  requiredKeys: readonly K[],
): RequiredQuotationRouteParams<K> | null {
  const params = useParams<QuotationRouteParams>();

  return useMemo(() => {
    const output = {} as RequiredQuotationRouteParams<K>;

    for (const key of requiredKeys) {
      const value = params[key];
      if (!value) return null;
      output[key] = value;
    }

    return output;
  }, [params, requiredKeys]);
}
