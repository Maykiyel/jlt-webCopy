import { Navigate, useParams, useLocation } from "react-router";
import { QuotationsRequested } from "@/features/quotations/pages/requested/QuotationsRequested";
import { QuotationsClient } from "@/features/quotations/pages/requested/QuotationsClient";
import { MakeQuotation } from "@/features/quotations/pages/requested/MakeQuotation";
import { QuotationDocuments } from "@/features/quotations/pages/requested/QuotationDocuments";
import { TemplateSelection } from "@/features/quotations/pages/compose/TemplateSelection";

export default function QuotationsPage() {
  const { pathname } = useLocation();
  const { tab, clientId, quotationId, template } = useParams();

  if (quotationId && pathname.endsWith("/documents"))
    return <QuotationDocuments />;
  if (quotationId && template) return <div>TODO: {template} form</div>; // next step
  if (quotationId && pathname.includes("/compose"))
    return <TemplateSelection />;
  if (quotationId) return <MakeQuotation />;
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
