import { Navigate, useParams } from "react-router";
import { QuotationsRequested } from "@/features/quotations/pages/QuotationsRequested";
import { QuotationsClient } from "@/features/quotations/pages/QuotationsClient";

export default function QuotationsPage() {
  const { tab, clientId } = useParams();

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
