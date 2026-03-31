import * as z from "zod";

export const quotationDetailsFixedSchema = z.object({
  subject: z.string().optional(),
  message: z.string().optional(),
});

export const customFieldsSchema = z.record(z.string(), z.string().optional());

export const quotationDetailsSchema = quotationDetailsFixedSchema.merge(
  z.object({ custom_fields: customFieldsSchema.optional() }),
);

export type QuotationDetailsValues = z.infer<typeof quotationDetailsSchema>;

export const chargeRowSchema = z.object({
  description: z.string().optional(),
  currency: z.string().optional(),
  uom: z.string().optional(),
  amount: z.number().nullable().optional(),
});

export type ChargeRow = z.infer<typeof chargeRowSchema>;

export const billingDetailsSchema = z.object({
  sections: z.record(z.string(), z.array(chargeRowSchema)).default({}),
});

export type BillingDetailsValues = z.infer<typeof billingDetailsSchema>;

export const termsSchema = z.object({
  template_id: z.string(),
  policies: z.string().optional(),
  terms_and_condition: z.string().optional(),
  banking_details: z.string().optional(),
  footer: z.string().optional(),
});

export type TermsValues = z.infer<typeof termsSchema>;

export const signatorySchema = z.object({
  complementary_close: z.string().min(1, "Complementary close is required"),
  is_authorized_signatory: z.boolean().default(false),
  authorized_signatory_name: z.string().min(1, "Name is required"),
  position_title: z.string().min(1, "Position/Title is required"),
  signature_file: z.instanceof(File).nullable().optional(),
});

export type SignatoryValues = z.infer<typeof signatorySchema>;
