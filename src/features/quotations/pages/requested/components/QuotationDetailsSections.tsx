import { DetailCard } from "@/components/DetailCard";
import { DetailGrid } from "@/components/DetailGrid";
import {
  AssignmentInd,
  InboxTextPerson,
  Box,
  AccountBox,
} from "@nine-thirty-five/material-symbols-react/outlined";
import type { QuotationResource } from "@/features/quotations/types/quotations.types";
import { buildQuotationDetailsRows } from "../utils/quotationDetailsRows";

interface QuotationDetailsSectionsProps {
  quotation: QuotationResource;
}

export function QuotationDetailsSections({
  quotation,
}: QuotationDetailsSectionsProps) {
  const rows = buildQuotationDetailsRows(quotation);

  return (
    <>
      <DetailCard
        icon={<AssignmentInd width="1.563rem" height="1.563rem" />}
        title="Client Details"
      >
        <DetailGrid rows={rows.client} />
      </DetailCard>

      <DetailCard
        icon={<InboxTextPerson width="1.563rem" height="1.563rem" />}
        title="Consignee Details"
      >
        <DetailGrid rows={rows.consignee} />
      </DetailCard>

      <DetailCard
        icon={<Box width="1.563rem" height="1.563rem" />}
        title="Shipment Details"
      >
        <DetailGrid rows={rows.shipment} />
      </DetailCard>

      <DetailCard
        icon={<AccountBox width="1.563rem" height="1.563rem" />}
        title="Person In-Charge"
      >
        <DetailGrid rows={rows.inCharge} />
      </DetailCard>
    </>
  );
}
