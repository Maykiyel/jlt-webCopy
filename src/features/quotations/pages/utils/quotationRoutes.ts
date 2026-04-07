interface QuotationRouteParams {
  tab: string;
  quotationId: string;
  clientId?: string;
}

interface QuotationComposeRouteParams {
  tab: string;
  clientId?: string;
  quotationId: string;
  templateId: string;
}

function quotationPath({ tab, clientId, quotationId }: QuotationRouteParams) {
  if (clientId) {
    return `/quotations/${tab}/client/${clientId}/${quotationId}`;
  }

  return `/quotations/${tab}/${quotationId}`;
}

export const quotationRoutes = {
  tab: (tab: string) => `/quotations/${tab}`,
  client: (tab: string, clientId: number | string) =>
    `/quotations/${tab}/client/${clientId}`,
  details: ({ tab, clientId, quotationId }: QuotationRouteParams) =>
    quotationPath({ tab, clientId, quotationId }),
  documents: ({ tab, clientId, quotationId }: QuotationRouteParams) =>
    `${quotationPath({ tab, clientId, quotationId })}/documents`,
  compose: ({
    tab,
    clientId,
    quotationId,
  }: {
    tab: string;
    clientId?: string;
    quotationId: string;
  }) =>
    clientId
      ? `/quotations/${tab}/client/${clientId}/${quotationId}/compose`
      : `/quotations/${tab}/${quotationId}/compose`,
  composeTemplate: ({
    tab,
    clientId,
    quotationId,
    templateId,
  }: QuotationComposeRouteParams) =>
    clientId
      ? `/quotations/${tab}/client/${clientId}/${quotationId}/compose/${templateId}`
      : `/quotations/${tab}/${quotationId}/compose/${templateId}`,
  viewer: ({ tab, clientId, quotationId }: QuotationRouteParams) =>
    `${quotationPath({ tab, clientId, quotationId })}/view`,
};
