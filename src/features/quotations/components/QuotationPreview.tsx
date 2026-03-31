import {
  Box,
  Divider,
  Group,
  Image,
  SimpleGrid,
  Stack,
  Table,
  Text,
} from "@mantine/core";
import { useEffect, useMemo } from "react";
import jltLogo from "@/assets/logos/word-dark.png";
import type {
  BillingDetailsValues,
  QuotationDetailsValues,
  SignatoryValues,
  TermsValues,
} from "@/features/quotations/schemas/compose.schema";
import type { QuotationTemplate } from "@/features/quotations/types/compose.types";
import type { QuotationResource } from "@/features/quotations/types/quotations.types";
import classes from "./QuotationPreview.module.css";

interface QuotationPreviewProps {
  quotation: QuotationResource;
  template: QuotationTemplate;
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
  if (!amount) return "—";
  return amount.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function QuotationPreview({
  quotation,
  template,
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

  const grandTotal = template.billing_sections.reduce((sum, section) => {
    const rows = billingDetails.sections?.[section.id] ?? [];
    const sectionTotal = rows.reduce(
      (rowSum, row) => rowSum + (row.amount ?? 0),
      0,
    );
    return sum + sectionTotal;
  }, 0);

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

        {template.billing_sections.map((section) => {
          const rows = billingDetails.sections?.[section.id] ?? [];
          const sectionTotal = rows.reduce(
            (sum, row) => sum + (row.amount ?? 0),
            0,
          );

          return (
            <Box key={section.id} mb="lg">
              <Text size="xs" fw={700} tt="uppercase" mb="xs">
                {section.title}
              </Text>
              <Table
                withTableBorder
                withColumnBorders
                fz="xs"
                styles={{
                  thead: { backgroundColor: "#f0f0f0" },
                  table: { borderColor: "#b9b9b9" },
                  th: { borderColor: "#b9b9b9" },
                  td: { borderColor: "#b9b9b9" },
                }}
              >
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Description of Charges</Table.Th>
                    <Table.Th>Currency</Table.Th>
                    <Table.Th>UOM</Table.Th>
                    <Table.Th ta="right">Amount</Table.Th>
                    <Table.Th ta="right">Total Amount</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {rows.map((row, index) => (
                    <Table.Tr key={`${section.id}-${index}`}>
                      <Table.Td>{row.description}</Table.Td>
                      <Table.Td>{row.currency}</Table.Td>
                      <Table.Td>{row.uom}</Table.Td>
                      <Table.Td ta="right">{formatAmount(row.amount)}</Table.Td>
                      <Table.Td ta="right">{formatAmount(row.amount)}</Table.Td>
                    </Table.Tr>
                  ))}
                  <Table.Tr>
                    <Table.Td
                      colSpan={4}
                      fw={700}
                    >{`Total ${section.title}`}</Table.Td>
                    <Table.Td ta="right" fw={700}>
                      {formatAmount(sectionTotal)}
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>
            </Box>
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

        <Stack gap="md" mb="xl">
          {terms.policies && (
            <Box>
              <Text size="xs" fw={700} tt="uppercase" mb={4}>
                Policies
              </Text>
              <Text size="xs" style={{ whiteSpace: "pre-wrap" }}>
                {terms.policies}
              </Text>
            </Box>
          )}
          {terms.terms_and_condition && (
            <Box>
              <Text size="xs" fw={700} tt="uppercase" mb={4}>
                Terms and Conditions
              </Text>
              <Text size="xs" style={{ whiteSpace: "pre-wrap" }}>
                {terms.terms_and_condition}
              </Text>
            </Box>
          )}
          {terms.banking_details && (
            <Box>
              <Text size="xs" fw={700} tt="uppercase" mb={4}>
                Banking Details
              </Text>
              <Text size="xs" style={{ whiteSpace: "pre-wrap" }}>
                {terms.banking_details}
              </Text>
            </Box>
          )}
        </Stack>

        <SimpleGrid cols={2} mb="xl">
          <Stack gap="xs">
            <Text size="xs">{signatory.complementary_close}</Text>
            {signaturePreviewUrl && (
              <Image
                src={signaturePreviewUrl}
                w="8rem"
                h="3rem"
                fit="contain"
              />
            )}
            <Text size="xs" fw={700} tt="uppercase">
              {signatory.authorized_signatory_name}
            </Text>
            <Text size="xs">{signatory.position_title}</Text>
            <Text size="xs">Jill L. Tolentino Customs Brokerage</Text>
          </Stack>
          <Stack gap="xs">
            <Text size="xs">CONFORME:</Text>
            <Text size="xs" mt="xl" fw={700} tt="uppercase">
              {quotation.client?.full_name ?? ""}
            </Text>
            <Text size="xs">Client</Text>
          </Stack>
        </SimpleGrid>

        {terms.footer && (
          <Text size="xs" ta="center" c="dimmed" mt="xl">
            {terms.footer}
          </Text>
        )}
      </Box>
    </Box>
  );
}
