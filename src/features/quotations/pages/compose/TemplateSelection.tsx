import { useNavigate, useParams } from "react-router";
import { PageCard } from "@/components/PageCard";
import { TemplateSelector } from "@/features/quotations/components/TemplateSelector";
import type { QuotationTemplateId } from "@/features/quotations/components/TemplateSelector";

export function TemplateSelection() {
  const navigate = useNavigate();
  const { tab, clientId, quotationId } = useParams();

  function handleSelect(templateId: QuotationTemplateId) {
    navigate(
      `/quotations/${tab}/client/${clientId}/${quotationId}/compose/${templateId}`,
    );
  }

  return (
    <PageCard title="Select Template" fullHeight>
      <TemplateSelector onSelect={handleSelect} />
    </PageCard>
  );
}
