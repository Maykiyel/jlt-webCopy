import { pdf } from "@react-pdf/renderer";
import { createElement } from "react";
import { QuotationPDF } from "@/features/quotations/pdf/QuotationPDF";
import type { QuotationViewerState } from "@/features/quotations/types/compose.types";

export function usePDFActions(state: QuotationViewerState, logoSrc: string) {
  const props = {
    quotation: state.quotation,
    template: state.template,
    quotationDetails: state.quotationDetails,
    billingDetails: state.billingDetails,
    terms: state.terms,
    signatory: state.signatory,
    logoSrc,
  };

  async function generateBlob(): Promise<Blob> {
    const signatorySignatureSrc = state.signatory.signature_file
      ? URL.createObjectURL(state.signatory.signature_file)
      : null;

    try {
      const doc = createElement(QuotationPDF, {
        ...props,
        signatorySignatureSrc,
      });
      return await pdf(doc as never).toBlob();
    } finally {
      if (signatorySignatureSrc) {
        URL.revokeObjectURL(signatorySignatureSrc);
      }
    }
  }

  async function handleDownload() {
    const blob = await generateBlob();
    const pdfBlob =
      blob.type === "application/pdf"
        ? blob
        : new Blob([blob], { type: "application/pdf" });
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${state.quotation.reference_number ?? "quotation"}.pdf`;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      URL.revokeObjectURL(url);
      document.body.removeChild(link);
    }, 2000);
  }

  async function handlePrint() {
    window.print();
  }

  return { handleDownload, handlePrint };
}
