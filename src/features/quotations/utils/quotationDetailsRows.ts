import type { DetailRow } from "@/components/DetailGrid";
import type { QuotationResource } from "@/features/quotations/types/quotations.types";

interface QuotationDetailsRows {
  client: DetailRow[];
  consignee: DetailRow[];
  shipment: DetailRow[];
  inCharge: DetailRow[];
}

function withFallback(value: string | null | undefined) {
  return value && value.trim() ? value : "-";
}

function getVolumeDimension(quotation: QuotationResource) {
  return [quotation.commodity?.cargo_type, quotation.commodity?.container_size]
    .filter(Boolean)
    .join(" ");
}

export function buildQuotationDetailsRows(
  quotation: QuotationResource,
): QuotationDetailsRows {
  const volumeDimension = getVolumeDimension(quotation);

  return {
    client: [
      {
        label: "Client Name",
        value: withFallback(quotation.client?.full_name),
      },
      {
        label: "Company Name",
        value: withFallback(quotation.client?.company_name),
      },
      {
        label: "Contact Number",
        value: withFallback(quotation.client?.contact_number),
      },
      {
        label: "Email",
        value: withFallback(quotation.client?.email),
      },
    ],
    consignee: [
      { label: "Company Name", value: withFallback(quotation.company.name) },
      {
        label: "Company Address",
        value: withFallback(quotation.company.address),
      },
      {
        label: "Contact Person",
        value: withFallback(quotation.company.contact_person),
      },
      {
        label: "Contact Number",
        value: withFallback(quotation.company.contact_number),
      },
      {
        label: "Email Address",
        value: withFallback(quotation.company.email),
      },
    ],
    shipment: [
      { label: "Service Type", value: withFallback(quotation.service?.type) },
      {
        label: "Freight Transport Mode",
        value: withFallback(quotation.service?.transport_mode),
      },
      {
        label: "Service",
        value: withFallback(quotation.service?.options?.join(", ")),
      },
      {
        label: "Commodity",
        value: withFallback(quotation.commodity?.commodity),
      },
      { label: "Volume (Dimension)", value: withFallback(volumeDimension) },
      { label: "Origin", value: withFallback(quotation.shipment?.origin) },
      {
        label: "Destination",
        value: withFallback(quotation.shipment?.destination),
      },
      ...(quotation.remarks
        ? [{ label: "Details", value: withFallback(quotation.remarks) }]
        : []),
    ],
    inCharge: [
      {
        label: "Account Specialist",
        value: withFallback(quotation.account_specialist),
      },
    ],
  };
}
