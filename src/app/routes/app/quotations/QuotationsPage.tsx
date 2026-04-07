import { Navigate, useMatch, useParams } from "react-router";
import { QuotationsRequested } from "@/features/quotations/pages/requested/QuotationsRequested";
import { QuotationsClient } from "@/features/quotations/pages/requested/QuotationsClient";
import { QuotationDetailsPage } from "@/features/quotations/pages/requested/QuotationDetailsPage";
import { QuotationDocuments } from "@/features/quotations/pages/requested/QuotationDocuments";
import { TemplateSelection } from "@/features/quotations/pages/compose/TemplateSelection";
import { ComposeQuotationPage } from "@/features/quotations/pages/compose/ComposeQuotationPage";

export default function QuotationsPage() {
  const { tab, clientId, quotationId, template } = useParams();
  const documentsMatch = useMatch(
    "/quotations/:tab/client/:clientId/:quotationId/documents",
  );
  const composeRootMatch = useMatch(
    "/quotations/:tab/client/:clientId/:quotationId/compose",
  );

  if (quotationId && documentsMatch) return <QuotationDocuments />;
  if (quotationId && template) return <ComposeQuotationPage />;
  if (quotationId && composeRootMatch) return <TemplateSelection />;
  if (quotationId) return <QuotationDetailsPage />;
  if (clientId) return <QuotationsClient />;

  switch (tab) {
    case "requested":
      return <QuotationsRequested />;
    case "responded":
      return <h1>Responded</h1>;
    case "accepted":
      return <h1>Accepted</h1>;
    case "discarded":
      return <h1>Discarded</h1>;
    default:
      return <Navigate to="requested" replace />;
  }
}
