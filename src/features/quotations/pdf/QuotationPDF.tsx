import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type {
  BillingDetailsValues,
  QuotationDetailsValues,
  SignatoryValues,
  TermsValues,
} from "@/features/quotations/schemas/compose.schema";
import type { QuotationTemplate } from "@/features/quotations/types/compose.types";
import type { QuotationResource } from "@/features/quotations/types/quotations.types";

interface QuotationPDFProps {
  quotation: QuotationResource;
  template: QuotationTemplate;
  quotationDetails: QuotationDetailsValues;
  billingDetails: BillingDetailsValues;
  terms: TermsValues;
  signatory: SignatoryValues;
  logoSrc: string;
  signatorySignatureSrc?: string | null;
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 34,
    paddingBottom: 34,
    paddingHorizontal: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#111111",
    lineHeight: 1.45,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 18,
  },
  logo: { width: 86 },
  companyInfo: { textAlign: "right", fontSize: 9, width: "66%" },
  companyName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    textTransform: "uppercase",
  },
  divider: { borderBottom: "0.5pt solid #cccccc", marginVertical: 8 },
  label: { color: "#555555" },
  bold: { fontFamily: "Helvetica-Bold" },
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    textTransform: "uppercase",
    marginBottom: 4,
    marginTop: 10,
  },
  table: { border: "0.5pt solid #b9b9b9" },
  tableHeader: { flexDirection: "row", backgroundColor: "#f0f0f0" },
  tableRow: { flexDirection: "row", borderTop: "0.5pt solid #b9b9b9" },
  tableCellBase: {
    padding: "4pt 6pt",
    borderRight: "0.5pt solid #b9b9b9",
    fontSize: 9,
  },
  colDescription: { flex: 2.4 },
  colCurrency: { flex: 0.9 },
  colUom: { flex: 1 },
  colAmount: { flex: 1 },
  colTotal: { flex: 1.2 },
  tableCellLast: { padding: "4pt 6pt", fontSize: 9 },
  tableCellRight: { textAlign: "right" },
  totalRow: {
    flexDirection: "row",
    borderTop: "0.5pt solid #b9b9b9",
    backgroundColor: "#f0f0f0",
  },
  signatoryBlock: { flexDirection: "row", marginTop: 18 },
  signatoryCol: { flex: 1 },
  signature: { width: 80, height: 30, objectFit: "contain", marginVertical: 4 },
  footer: { textAlign: "center", color: "#888888", fontSize: 9, marginTop: 16 },
});

function formatAmount(amount?: number | null): string {
  return amount != null
    ? amount.toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : "—";
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function QuotationPDF({
  quotation,
  template,
  quotationDetails,
  billingDetails,
  terms,
  signatory,
  logoSrc,
  signatorySignatureSrc,
}: QuotationPDFProps) {
  const grand = template.billing_sections.reduce((sum, section) => {
    const rows = billingDetails.sections?.[section.id] ?? [];
    return sum + rows.reduce((rowSum, row) => rowSum + (row.amount ?? 0), 0);
  }, 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image src={logoSrc} style={styles.logo} />
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>
              Jill L. Tolentino Customs Brokerage
            </Text>
            <Text>Suite 508-A Pacific Centre 460 Quintin Paredes St.</Text>
            <Text>
              Brgy. 289 Binondo Manila 1006 Philippines (632) 8372 77557 |
              sales@jltcb.com
            </Text>
            <Text>TIN: 705-285-319-000</Text>
          </View>
        </View>

        <Text style={{ marginBottom: 10 }}>
          {formatDate(new Date().toISOString())}
        </Text>

        <View style={{ marginBottom: 8 }}>
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.label, { width: 40 }]}>To:</Text>
            <Text>{quotation.client?.full_name ?? "—"}</Text>
          </View>
          {quotation.client?.company_name ? (
            <Text style={{ marginLeft: 40 }}>
              {quotation.client.company_name}
            </Text>
          ) : null}
          {quotation.client?.contact_number ? (
            <Text style={{ marginLeft: 40 }}>
              {quotation.client.contact_number}
            </Text>
          ) : null}
          {quotation.client?.email ? (
            <Text style={{ marginLeft: 40 }}>{quotation.client.email}</Text>
          ) : null}
        </View>

        <View style={{ flexDirection: "row", marginBottom: 4 }}>
          <Text style={[styles.label, { width: 80 }]}>Reference No:</Text>
          <Text>{quotation.reference_number}</Text>
        </View>

        <View style={{ flexDirection: "row", marginBottom: 10 }}>
          <Text style={[styles.label, { width: 80 }]}>Subject:</Text>
          <Text>{quotationDetails.subject}</Text>
        </View>

        <View style={styles.divider} />

        <Text style={{ marginBottom: 14, marginTop: 6 }}>
          {quotationDetails.message}
        </Text>

        {template.custom_fields.length > 0 && (
          <View
            style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 12 }}
          >
            {template.custom_fields.map((field) => (
              <View
                key={field.id}
                style={{ width: "50%", flexDirection: "row", marginBottom: 4 }}
              >
                <Text style={[styles.label, { width: 100 }]}>
                  {field.label}:
                </Text>
                <Text style={styles.bold}>
                  {quotationDetails.custom_fields?.[field.id] ?? "—"}
                </Text>
              </View>
            ))}
          </View>
        )}

        {template.billing_sections.map((section) => {
          const rows = billingDetails.sections?.[section.id] ?? [];
          const total = rows.reduce((sum, row) => sum + (row.amount ?? 0), 0);

          return (
            <View key={section.id} style={{ marginBottom: 14 }}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <Text
                    style={[
                      styles.tableCellBase,
                      styles.colDescription,
                      styles.bold,
                    ]}
                  >
                    Description of Charges
                  </Text>
                  <Text
                    style={[
                      styles.tableCellBase,
                      styles.colCurrency,
                      styles.bold,
                    ]}
                  >
                    Currency
                  </Text>
                  <Text
                    style={[styles.tableCellBase, styles.colUom, styles.bold]}
                  >
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
                {rows.map((row, index) => (
                  <View key={`${section.id}-${index}`} style={styles.tableRow}>
                    <Text style={[styles.tableCellBase, styles.colDescription]}>
                      {row.description || "—"}
                    </Text>
                    <Text style={[styles.tableCellBase, styles.colCurrency]}>
                      {row.currency || "—"}
                    </Text>
                    <Text style={[styles.tableCellBase, styles.colUom]}>
                      {row.uom || "—"}
                    </Text>
                    <Text
                      style={[
                        styles.tableCellBase,
                        styles.colAmount,
                        styles.tableCellRight,
                      ]}
                    >
                      {formatAmount(row.amount)}
                    </Text>
                    <Text
                      style={[
                        styles.tableCellLast,
                        styles.colTotal,
                        styles.tableCellRight,
                      ]}
                    >
                      {formatAmount(row.amount)}
                    </Text>
                  </View>
                ))}
                <View style={styles.totalRow}>
                  <Text
                    style={[styles.tableCellBase, styles.bold, { flex: 5.3 }]}
                  >
                    {`Total ${section.title}`}
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
        })}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 18,
          }}
        >
          <Text style={styles.bold}>Estimated Total Landed Cost</Text>
          <Text style={styles.bold}>{formatAmount(grand)}</Text>
        </View>

        {terms.policies ? (
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.bold}>Policies</Text>
            <Text>{terms.policies}</Text>
          </View>
        ) : null}
        {terms.terms_and_condition ? (
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.bold}>Terms and Conditions</Text>
            <Text>{terms.terms_and_condition}</Text>
          </View>
        ) : null}
        {terms.banking_details ? (
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.bold}>Banking Details</Text>
            <Text>{terms.banking_details}</Text>
          </View>
        ) : null}

        <View style={styles.signatoryBlock} wrap={false}>
          <View style={styles.signatoryCol}>
            <Text>{signatory.complementary_close}</Text>
            {signatorySignatureSrc ? (
              <Image src={signatorySignatureSrc} style={styles.signature} />
            ) : null}
            <Text style={styles.bold}>
              {signatory.authorized_signatory_name?.toUpperCase()}
            </Text>
            <Text>{signatory.position_title}</Text>
            <Text>Jill L. Tolentino Customs Brokerage</Text>
          </View>
          <View style={styles.signatoryCol}>
            <Text>CONFORME:</Text>
            <Text style={[styles.bold, { marginTop: 24 }]}>
              {quotation.client?.full_name?.toUpperCase() ?? ""}
            </Text>
            <Text>Client</Text>
          </View>
        </View>

        {terms.footer ? (
          <Text style={styles.footer}>{terms.footer}</Text>
        ) : null}
      </Page>
    </Document>
  );
}
