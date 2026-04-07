import { Text, View } from "@react-pdf/renderer";
import type { ChargeRow } from "@/features/quotations/schemas/compose.schema";
import type { quotationPdfStyles } from "@/features/quotations/pdf/quotationPdf.styles";
import { getBillingPresentationRows } from "@/features/quotations/utils/billingPresentation";

interface QuotationPDFBillingSectionProps {
  sectionId: string;
  sectionTitle: string;
  rows: ChargeRow[];
  total: number;
  styles: typeof quotationPdfStyles;
  formatAmount: (amount?: number | null) => string;
}

export function QuotationPDFBillingSection({
  sectionId,
  sectionTitle,
  rows,
  total,
  styles,
  formatAmount,
}: QuotationPDFBillingSectionProps) {
  const displayRows = getBillingPresentationRows(rows, formatAmount);

  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={styles.sectionTitle}>{sectionTitle}</Text>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text
            style={[styles.tableCellBase, styles.colDescription, styles.bold]}
          >
            Description of Charges
          </Text>
          <Text style={[styles.tableCellBase, styles.colCurrency, styles.bold]}>
            Currency
          </Text>
          <Text style={[styles.tableCellBase, styles.colUom, styles.bold]}>
            UOM
          </Text>
          <Text
            style={[
              styles.tableCellBase,
              styles.colAmount,
              styles.bold,
              styles.tableCellRight,
            ]}
          >
            Amount
          </Text>
          <Text
            style={[
              styles.tableCellLast,
              styles.colTotal,
              styles.bold,
              styles.tableCellRight,
            ]}
          >
            Total Amount
          </Text>
        </View>
        {displayRows.map((row, index) => (
          <View key={`${sectionId}-${index}`} style={styles.tableRow}>
            <Text style={[styles.tableCellBase, styles.colDescription]}>
              {row.description}
            </Text>
            <Text style={[styles.tableCellBase, styles.colCurrency]}>
              {row.currency}
            </Text>
            <Text style={[styles.tableCellBase, styles.colUom]}>{row.uom}</Text>
            <Text
              style={[
                styles.tableCellBase,
                styles.colAmount,
                styles.tableCellRight,
              ]}
            >
              {row.amountText}
            </Text>
            <Text
              style={[
                styles.tableCellLast,
                styles.colTotal,
                styles.tableCellRight,
              ]}
            >
              {row.totalText}
            </Text>
          </View>
        ))}
        <View style={styles.totalRow}>
          <Text style={[styles.tableCellBase, styles.bold, { flex: 5.3 }]}>
            {`Total ${sectionTitle}`}
          </Text>
          <Text
            style={[
              styles.tableCellLast,
              styles.colTotal,
              styles.bold,
              styles.tableCellRight,
            ]}
          >
            {formatAmount(total)}
          </Text>
        </View>
      </View>
    </View>
  );
}
