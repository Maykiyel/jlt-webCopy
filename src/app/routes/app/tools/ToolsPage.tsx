import { useLocation, useMatch } from "react-router";
import { ToolsDashboard } from "@/features/tools/pages/ToolsDashboard";
import { TemplatesPage } from "@/features/tools/pages/TemplatesPage";
import ServicesPage from "@/features/tools/pages/ServicesPage";
import MessagesPage from "@/features/tools/pages/MessageTemplatePage";
import { DetailsConfigurationPage } from "@/features/tools/pages/DetailsConfigurationPage";
import { BillingConfigurationPage } from "@/features/tools/pages/BillingConfigurationPage";
import { StandardQuotationTemplatePage } from "@/features/tools/pages/StandardQuotationTemplatePage";
import { StandardQuotationTemplateFormPage } from "@/features/tools/pages/StandardQuotationTemplateFormPage";
import { TemplateFormPage } from "@/features/tools/pages/TemplateFormPage";

export default function ToolsPage() {
  const location = useLocation();
  const detailsConfigMatch = useMatch("/tools/templates/config/details");
  const billingConfigMatch = useMatch("/tools/templates/config/billing");
  const standardQuotationTemplateMatch = useMatch(
    "/tools/templates/config/standard-quotation-template",
  );
  const createStandardQuotationTemplateMatch = useMatch(
    "/tools/templates/config/standard-quotation-template/new",
  );
  const editStandardQuotationTemplateMatch = useMatch(
    "/tools/templates/config/standard-quotation-template/:templateId/edit",
  );
  const createTemplateMatch = useMatch("/tools/templates/new");
  const servicesMatch = useMatch("/tools/services");
  const messagesMatch = useMatch("/tools/messages");
  const templatesMatch = useMatch("/tools/templates");

  if (detailsConfigMatch) return <DetailsConfigurationPage />;
  if (billingConfigMatch) return <BillingConfigurationPage />;
  if (createStandardQuotationTemplateMatch) {
    return <StandardQuotationTemplateFormPage mode="create" />;
  }
  if (editStandardQuotationTemplateMatch) {
    return <StandardQuotationTemplateFormPage mode="edit" />;
  }
  if (standardQuotationTemplateMatch) return <StandardQuotationTemplatePage />;
  if (createTemplateMatch) {
    const params = new URLSearchParams(location.search);
    const serviceType = params.get("serviceType");

    return (
      <TemplateFormPage
        serviceType={serviceType === "logistics" ? "LOGISTICS" : "REGULATORY"}
      />
    );
  }
  if (servicesMatch) return <ServicesPage />;
  if (messagesMatch) return <MessagesPage />;
  if (templatesMatch) return <TemplatesPage />;

  return <ToolsDashboard />;
}
