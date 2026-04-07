import { Document, Image, Page, Text, View } from "@react-pdf/renderer";
import { QuotationPDFBillingSection } from "@/features/quotations/pdf/components/QuotationPDFBillingSection";
import { quotationPdfStyles as styles } from "@/features/quotations/pdf/quotationPdf.styles";
import type {
  BillingDetailsValues,
  QuotationDetailsValues,
  SignatoryValues,
  TermsValues,
} from "@/features/quotations/schemas/compose.schema";
import type { QuotationTemplate } from "@/features/quotations/types/compose.types";
import type { QuotationResource } from "@/features/quotations/types/quotations.types";
import {
  getBillingGrandTotal,
  getBillingSectionsWithCharges,
  getRowsTotal,
} from "@/features/quotations/utils/billing";
import { formatQuotationAmount } from "@/features/quotations/utils/billingPresentation";
import { resolveClientInformationFields } from "@/features/quotations/utils/clientInformationFields";

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

function formatAmount(amount?: number | null): string {
  return formatQuotationAmount(amount);
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
  const billingSectionsToRender = getBillingSectionsWithCharges(
    template,
    billingDetails,
  );
  const grand = getBillingGrandTotal(billingSectionsToRender);
  const clientInformationFields = resolveClientInformationFields(
    quotation,
    template.client_information_fields,
  );

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

        {clientInformationFields.length > 0 && (
          <View
            style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 8 }}
          >
            {clientInformationFields.map((field) => (
              <View
                key={field.id}
                style={{ width: "50%", flexDirection: "row", marginBottom: 4 }}
              >
                <Text style={[styles.label, { width: 100 }]}>
                  {field.label}:
                </Text>
                <Text style={styles.bold}>{field.value}</Text>
              </View>
            ))}
          </View>
        )}

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

        {billingSectionsToRender.map(({ section, rows }) => {
          const total = getRowsTotal(rows);

          return (
            <QuotationPDFBillingSection
              key={section.id}
              sectionId={section.id}
              sectionTitle={section.title}
              rows={rows}
              total={total}
              styles={styles}
              formatAmount={formatAmount}
            />
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
