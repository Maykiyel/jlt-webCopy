import {
  Box,
  Divider,
  Group,
  Image,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { useEffect, useMemo } from "react";
import jltLogo from "@/assets/logos/word-dark.png";
import { QuotationPreviewBillingSection } from "@/features/quotations/components/preview/QuotationPreviewBillingSection";
import { QuotationPreviewSignatory } from "@/features/quotations/components/preview/QuotationPreviewSignatory";
import { QuotationPreviewTermsBlocks } from "@/features/quotations/components/preview/QuotationPreviewTermsBlocks";
import type {
  BillingDetailsValues,
  QuotationDetailsValues,
  SignatoryValues,
  TermsValues,
} from "@/features/quotations/schemas/compose.schema";
import type {
  ClientInformationValue,
  QuotationTemplate,
} from "@/features/quotations/types/compose.types";
import type { QuotationResource } from "@/features/quotations/types/quotations.types";
import {
  getBillingGrandTotal,
  getBillingSectionsWithCharges,
  getRowsTotal,
} from "@/features/quotations/utils/billing";
import { formatQuotationAmount } from "@/features/quotations/utils/billingPresentation";
import { resolveClientInformationFields } from "@/features/quotations/utils/clientInformationFields";
import classes from "./QuotationPreview.module.css";

interface QuotationPreviewProps {
  quotation: QuotationResource;
  template: QuotationTemplate;
  clientInformationFields?: ClientInformationValue[];
  quotationDetails: QuotationDetailsValues;
  billingDetails: BillingDetailsValues;
  terms: TermsValues;
  signatory: SignatoryValues;
  dateGenerated?: string;
  mode?: "default" | "viewer";
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatAmount(amount: number | null | undefined): string {
  return formatQuotationAmount(amount);
}

export function QuotationPreview({
  quotation,
  template,
  clientInformationFields,
  quotationDetails,
  billingDetails,
  terms,
  signatory,
  dateGenerated,
  mode = "default",
}: QuotationPreviewProps) {
  const signaturePreviewUrl = useMemo(
    () =>
      signatory.signature_file
        ? URL.createObjectURL(signatory.signature_file)
        : null,
    [signatory.signature_file],
  );

  useEffect(() => {
    return () => {
      if (signaturePreviewUrl) {
        URL.revokeObjectURL(signaturePreviewUrl);
      }
    };
  }, [signaturePreviewUrl]);

  const billingSectionsToRender = getBillingSectionsWithCharges(
    template,
    billingDetails,
  );
  const grandTotal = getBillingGrandTotal(billingSectionsToRender);
  const resolvedClientInformationFields = resolveClientInformationFields(
    quotation,
    template.client_information_fields,
    clientInformationFields,
  );

  return (
    <Box
      className={mode === "viewer" ? classes.wrapperViewer : classes.wrapper}
    >
      <Box
        className={
          mode === "viewer" ? classes.documentViewer : classes.document
        }
      >
        <Group justify="space-between" align="flex-start" mb="xl">
          <Image src={jltLogo} w="8rem" />
          <Stack gap={2} align="flex-end">
            <Text fw={700} tt="uppercase" size="xs">
              Jill L. Tolentino Customs Brokerage
            </Text>
            <Text size="xs">
              Suite 508-A Pacific Centre 460 Quintin Paredes St.
            </Text>
            <Text size="xs">
              Brgy. 289 Binondo Manila 1006 Philippines (632) 8372 77557 |
              sales@jltcb.com
            </Text>
            <Text size="xs">TIN: 705-285-319-000</Text>
          </Stack>
        </Group>

        <Text size="xs" mb="md">
          {formatDate(dateGenerated ?? new Date().toISOString())}
        </Text>

        <Stack gap={0} mb="md">
          <Group gap="xs">
            <Text size="xs" w="3rem">
              To:
            </Text>
            <Text size="xs">{quotation.client?.full_name ?? "—"}</Text>
          </Group>
          {quotation.client?.company_name && (
            <Text size="xs" ml="3rem">
              {quotation.client.company_name}
            </Text>
          )}
          {quotation.client?.contact_number && (
            <Text size="xs" ml="3rem">
              {quotation.client.contact_number}
            </Text>
          )}
          {quotation.client?.email && (
            <Text size="xs" ml="3rem">
              {quotation.client.email}
            </Text>
          )}
        </Stack>

        <Group gap="xs" mb="xs">
          <Text size="xs" fw={500} w="6rem" style={{ flexShrink: 0 }}>
            Reference No:
          </Text>
          <Text size="xs">{quotation.reference_number}</Text>
        </Group>

        <Group gap="xs" mb="md">
          <Text size="xs" fw={500} w="6rem" style={{ flexShrink: 0 }}>
            Subject:
          </Text>
          <Text size="xs">{quotationDetails.subject}</Text>
        </Group>

        <Divider mb="md" />

        <Text size="xs" mb="lg" style={{ whiteSpace: "pre-wrap" }}>
          {quotationDetails.message}
        </Text>

        {resolvedClientInformationFields.length > 0 && (
          <SimpleGrid
            cols={2}
            mb={template.custom_fields.length > 0 ? "xs" : "lg"}
            spacing="xs"
          >
            {resolvedClientInformationFields.map((field) => (
              <Group key={field.id} gap="xs" align="flex-start">
                <Text size="xs" c="dimmed" w="9rem" style={{ flexShrink: 0 }}>
                  {field.label}:
                </Text>
                <Text size="xs" fw={500}>
                  {field.value}
                </Text>
              </Group>
            ))}
          </SimpleGrid>
        )}

        {template.custom_fields.length > 0 && (
          <SimpleGrid cols={2} mb="lg" spacing="xs">
            {template.custom_fields.map((field) => (
              <Group key={field.id} gap="xs" align="flex-start">
                <Text size="xs" c="dimmed" w="9rem" style={{ flexShrink: 0 }}>
                  {field.label}:
                </Text>
                <Text size="xs" fw={500}>
                  {quotationDetails.custom_fields?.[field.id] ?? "—"}
                </Text>
              </Group>
            ))}
          </SimpleGrid>
        )}

        {billingSectionsToRender.map(({ section, rows }) => {
          const sectionTotal = getRowsTotal(rows);

          return (
            <QuotationPreviewBillingSection
              key={section.id}
              sectionId={section.id}
              sectionTitle={section.title}
              rows={rows}
              sectionTotal={sectionTotal}
              formatAmount={formatAmount}
            />
          );
        })}

        <Group justify="space-between" mb="xl" px="xs">
          <Text size="xs" fw={700} tt="uppercase">
            Estimated Total Landed Cost
          </Text>
          <Text size="xs" fw={700}>
            {formatAmount(grandTotal)}
          </Text>
        </Group>

        <QuotationPreviewTermsBlocks terms={terms} />

        <QuotationPreviewSignatory
          signatory={signatory}
          clientName={quotation.client?.full_name}
          signaturePreviewUrl={signaturePreviewUrl}
        />

        {terms.footer && (
          <Text size="xs" ta="center" c="dimmed" mt="xl">
            {terms.footer}
          </Text>
        )}
      </Box>
    </Box>
  );
}
