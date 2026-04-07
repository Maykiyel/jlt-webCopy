import { useMemo } from "react";
import { useParams } from "react-router";

type RequestedRouteParamKey = "tab" | "clientId" | "quotationId";

type RequestedRouteParams = {
  tab?: string;
  clientId?: string;
  quotationId?: string;
};

type RequiredRequestedRouteParams<K extends RequestedRouteParamKey> = {
  [P in K]: string;
};

export function useRequestedRouteParams<K extends RequestedRouteParamKey>(
  requiredKeys: readonly K[],
): RequiredRequestedRouteParams<K> | null {
  const params = useParams<RequestedRouteParams>();

  return useMemo(() => {
    const output = {} as RequiredRequestedRouteParams<K>;

    for (const key of requiredKeys) {
      const value = params[key];
      if (!value) return null;
      output[key] = value;
    }

    return output;
  }, [params, requiredKeys]);
}
