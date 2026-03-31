import { useNavigate, useParams } from "react-router";
import { PageCard } from "@/components/PageCard";
import { TemplateSelector } from "@/features/quotations/components/TemplateSelector";
import { PLACEHOLDER_QUOTATION_TEMPLATES } from "@/features/quotations/data/composePlaceholders";

export function TemplateSelection() {
  const navigate = useNavigate();
  const { tab, clientId, quotationId } = useParams();

  // TODO: replace with useQuery when GET /quotation-templates is available
  const templates = PLACEHOLDER_QUOTATION_TEMPLATES.map((template) => ({
    id: template.id,
    name: template.name,
    enabled: true,
  }));

  function handleSelect(templateId: string) {
    navigate(
      `/quotations/${tab}/client/${clientId}/${quotationId}/compose/${templateId}`,
    );
  }

  return (
    <PageCard title="Select Template" fullHeight>
      <TemplateSelector templates={templates} onSelect={handleSelect} />
    </PageCard>
  );
}
