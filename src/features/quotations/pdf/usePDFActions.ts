import { createElement } from "react";
import type { QuotationViewerState } from "@/features/quotations/types/compose.types";

export function usePDFActions(
  state: QuotationViewerState | null,
  logoSrc: string,
) {
  if (!state) {
    return {
      handleDownload: async () => undefined,
      handlePrint: async () => undefined,
    };
  }

  const viewerState = state;

  const props = {
    quotation: viewerState.quotation,
    template: viewerState.template,
    clientInformationFields: viewerState.clientInformationFields,
    quotationDetails: viewerState.quotationDetails,
    billingDetails: viewerState.billingDetails,
    terms: viewerState.terms,
    signatory: viewerState.signatory,
    logoSrc,
  };

  async function generateBlob(): Promise<Blob> {
    const [{ pdf }, { QuotationPDF }] = await Promise.all([
      import("@react-pdf/renderer"),
      import("@/features/quotations/pdf/QuotationPDF"),
    ]);

    const signatorySignatureSrc = viewerState.signatory.signature_file
      ? URL.createObjectURL(viewerState.signatory.signature_file)
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
    link.download = `${viewerState.quotation.reference_number ?? "quotation"}.pdf`;
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
