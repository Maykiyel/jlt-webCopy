export const toolsQueryKeys = {
  templates: ["templates"] as const,
  template: (templateId?: string) => ["template", templateId] as const,
  billingConfigs: ["billing-configs"] as const,
  detailsConfigs: ["details-configs"] as const,
  standardTemplates: ["standard-templates"] as const,
  standardTemplate: (templateId?: string) =>
    ["standard-template", templateId] as const,
  quotationFields: (serviceType: "LOGISTICS" | "REGULATORY") =>
    ["quotation-fields", serviceType] as const,
};
