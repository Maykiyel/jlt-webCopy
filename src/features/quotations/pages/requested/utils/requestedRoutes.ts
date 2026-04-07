interface RequestedRouteParams {
  tab: string;
  clientId: string;
  quotationId: string;
}

export const requestedRoutes = {
  client: (clientId: number | string) =>
    `/quotations/requested/client/${clientId}`,
  details: ({ tab, clientId, quotationId }: RequestedRouteParams) =>
    `/quotations/${tab}/client/${clientId}/${quotationId}`,
  documents: ({ tab, clientId, quotationId }: RequestedRouteParams) =>
    `/quotations/${tab}/client/${clientId}/${quotationId}/documents`,
  compose: ({ tab, clientId, quotationId }: RequestedRouteParams) =>
    `/quotations/${tab}/client/${clientId}/${quotationId}/compose`,
};
