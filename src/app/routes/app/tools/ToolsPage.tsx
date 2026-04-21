import { useMatch } from "react-router";
import { ToolsDashboard } from "@/features/tools/pages/ToolsDashboard";
import { TemplatesPage } from "@/features/tools/pages/TemplatesPage";
import ServicesPage from "@/features/tools/pages/ServicesPage";
import MessagesPage from "@/features/tools/pages/MessageTemplatePage";
import { DetailsConfigurationPage } from "@/features/tools/pages/DetailsConfigurationPage";

export default function ToolsPage() {
  const detailsConfigMatch = useMatch("/tools/templates/config/details");
  const servicesMatch = useMatch("/tools/services");
  const messagesMatch = useMatch("/tools/messages");
  const templatesMatch = useMatch("/tools/templates");

  if (detailsConfigMatch) return <DetailsConfigurationPage />;
  if (servicesMatch) return <ServicesPage />;
  if (messagesMatch) return <MessagesPage />;
  if (templatesMatch) return <TemplatesPage />;

  return <ToolsDashboard />;
}
