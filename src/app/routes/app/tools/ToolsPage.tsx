import { useMatch } from "react-router";
import { ToolsDashboard } from "@/features/tools/pages/ToolsDashboard";
import { TemplatesPage } from "@/features/tools/pages/TemplatesPage";
import ServicesPage from "@/features/tools/pages/ServicesPage";
import MessagesPage from "@/features/tools/pages/MessageTemplatePage";

export default function ToolsPage() {
  // Match sub-routes
  const servicesMatch = useMatch("/tools/services");
  const messagesMatch = useMatch("/tools/messages");
  const templatesMatch = useMatch("/tools/templates");

  if (servicesMatch) return <ServicesPage />;
  if (messagesMatch) return <MessagesPage />;
  if (templatesMatch) return <TemplatesPage />;

  // Default dashboard
  return <ToolsDashboard />;
}
