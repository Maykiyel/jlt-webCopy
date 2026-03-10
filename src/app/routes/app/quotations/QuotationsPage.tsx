import { Navigate, useParams, useLocation } from "react-router";
import { QuotationsRequested } from "@/features/quotations/pages/requested/QuotationsRequested";
import { QuotationsClient } from "@/features/quotations/pages/requested/QuotationsClient";
import { MakeQuotation } from "@/features/quotations/pages/requested/MakeQuotation";
import { QuotationDocuments } from "@/features/quotations/pages/requested/QuotationDocuments";

export default function QuotationsPage() {
  const { pathname } = useLocation();
  const { tab, clientId, quotationId } = useParams();

  if (quotationId && pathname.endsWith("/documents"))
    return <QuotationDocuments />;
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
