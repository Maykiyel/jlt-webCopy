import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Stack, Group } from "@mantine/core";
import {
  AssignmentInd,
  InboxTextPerson,
  Box,
  AccountBox,
  Folder,
} from "@nine-thirty-five/material-symbols-react/outlined";
import { PageCard } from "@/components/PageCard";
import { DetailCard } from "@/components/DetailCard";
import { DetailGrid } from "@/components/DetailGrid";
import { fetchQuotation } from "../../services/quotations.service";
import { AppButton } from "@/components/ui/AppButton";

export function QuotationDetailsPage() {
  const { tab, clientId, quotationId } = useParams<{
    tab: string;
    clientId: string;
    quotationId: string;
  }>();
  const navigate = useNavigate();

  const { data: quotation, isLoading } = useQuery({
    queryKey: ["quotation", quotationId],
    queryFn: () => fetchQuotation(quotationId!),
    enabled: !!quotationId,
  });

  if (isLoading || !quotation) return null;

  const volumeDimension = [
    quotation.commodity.cargo_type,
    quotation.commodity.container_size,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <PageCard
      title="Client Details"
      action={
        <AppButton
          icon={Folder}
          onClick={() =>
            navigate(
              `/quotations/${tab}/client/${clientId}/${quotationId}/documents`,
            )
          }
        >
          Documents
        </AppButton>
      }
    >
      <Stack gap="lg">
        {/* Client Details */}
        <DetailCard
          icon={<AssignmentInd width="1.563rem" height="1.563rem" />}
          title="Client Details"
        >
          <DetailGrid
            rows={[
              {
                label: "Client Name",
                value: quotation.client?.full_name ?? "—",
              },
              {
                label: "Company Name",
                value: quotation.client?.company_name ?? "—",
              },
              {
                label: "Contact Number",
                value: quotation.client?.contact_number ?? "—",
              },
              { label: "Email", value: quotation.client?.email ?? "—" },
            ]}
          />
        </DetailCard>

        {/* Consignee Details */}
        <DetailCard
          icon={<InboxTextPerson width="1.563rem" height="1.563rem" />}
          title="Consignee Details"
        >
          <DetailGrid
            rows={[
              { label: "Company Name", value: quotation.company.name },
              { label: "Company Address", value: quotation.company.address },
              {
                label: "Contact Person",
                value: quotation.company.contact_person,
              },
              {
                label: "Contact Number",
                value: quotation.company.contact_number,
              },
              { label: "Email Address", value: quotation.company.email },
            ]}
          />
        </DetailCard>

        {/* Shipment Details */}
        <DetailCard
          icon={<Box width="1.563rem" height="1.563rem" />}
          title="Shipment Details"
        >
          <DetailGrid
            rows={[
              { label: "Service Type", value: quotation.service.type },
              {
                label: "Freight Transport Mode",
                value: quotation.service.transport_mode,
              },
              { label: "Service", value: quotation.service.options.join(", ") },
              { label: "Commodity", value: quotation.commodity.commodity },
              { label: "Volume (Dimension)", value: volumeDimension || "—" },
              { label: "Origin", value: quotation.shipment.origin },
              { label: "Destination", value: quotation.shipment.destination },
              ...(quotation.remarks
                ? [{ label: "Details", value: quotation.remarks }]
                : []),
            ]}
          />
        </DetailCard>

        {/* Person In-Charge */}
        <DetailCard
          icon={<AccountBox width="1.563rem" height="1.563rem" />}
          title="Person In-Charge"
        >
          <DetailGrid
            rows={[
              {
                label: "Account Specialist",
                value: quotation.account_specialist ?? "—",
              },
            ]}
          />
        </DetailCard>

        {/* Make Quotation Button */}
        <Group justify="center" mt="0.5rem">
          <AppButton
            variant="primary"
            onClick={() =>
              navigate(
                `/quotations/${tab}/client/${clientId}/${quotationId}/compose`,
              )
            }
          >
            Make Quotation
          </AppButton>
        </Group>
      </Stack>
    </PageCard>
  );
}
