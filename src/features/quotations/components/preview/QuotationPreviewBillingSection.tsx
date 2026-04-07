import { Box, Table, Text } from "@mantine/core";
import type { ChargeRow } from "@/features/quotations/schemas/compose.schema";

interface QuotationPreviewBillingSectionProps {
  sectionId: string;
  sectionTitle: string;
  rows: ChargeRow[];
  sectionTotal: number;
  formatAmount: (amount: number | null | undefined) => string;
}

export function QuotationPreviewBillingSection({
  sectionId,
  sectionTitle,
  rows,
  sectionTotal,
  formatAmount,
}: QuotationPreviewBillingSectionProps) {
  return (
    <Box mb="lg">
      <Text size="xs" fw={700} tt="uppercase" mb="xs">
        {sectionTitle}
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
            <Table.Tr key={`${sectionId}-${index}`}>
              <Table.Td>{row.description}</Table.Td>
              <Table.Td>{row.currency}</Table.Td>
              <Table.Td>{row.uom}</Table.Td>
              <Table.Td ta="right">{formatAmount(row.amount)}</Table.Td>
              <Table.Td ta="right">{formatAmount(row.amount)}</Table.Td>
            </Table.Tr>
          ))}
          <Table.Tr>
            <Table.Td colSpan={4} fw={700}>{`Total ${sectionTitle}`}</Table.Td>
            <Table.Td ta="right" fw={700}>
              {formatAmount(sectionTotal)}
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </Box>
  );
}
