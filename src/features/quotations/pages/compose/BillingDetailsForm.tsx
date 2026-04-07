import { zodResolver } from "@hookform/resolvers/zod";
import { Group, Stack, Text } from "@mantine/core";
import { useForm, useWatch } from "react-hook-form";
import * as z from "zod";
import {
  billingDetailsSchema,
  type BillingDetailsValues,
} from "@/features/quotations/schemas/compose.schema";
import type { QuotationTemplate } from "@/features/quotations/types/compose.types";
import {
  getBillingGrandTotal,
  getBillingSectionsWithCharges,
} from "@/features/quotations/utils/billing";
import { BillingSectionRows } from "@/features/quotations/pages/compose/components/BillingSectionRows";
import classes from "./BillingDetailsForm.module.css";

interface BillingDetailsFormProps {
  id: string;
  template: QuotationTemplate;
  defaultValues?: Partial<BillingDetailsValues>;
  onSubmit: (values: BillingDetailsValues) => void;
}

type BillingDetailsFormInput = z.input<typeof billingDetailsSchema>;

function formatPhpAmount(value: number): string {
  return `PHP ${value.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;
}

export function BillingDetailsForm({
  id,
  template,
  defaultValues,
  onSubmit,
}: BillingDetailsFormProps) {
  const { control, handleSubmit, formState } = useForm<
    BillingDetailsFormInput,
    unknown,
    BillingDetailsValues
  >({
    resolver: zodResolver(billingDetailsSchema),
    defaultValues: defaultValues ?? { sections: {} },
  });
  const sectionError =
    typeof formState.errors.sections?.message === "string"
      ? formState.errors.sections.message
      : undefined;

  const sections = (useWatch({ control, name: "sections" }) ??
    {}) as BillingDetailsValues["sections"];
  const grandTotal = getBillingGrandTotal(
    getBillingSectionsWithCharges(template, { sections }),
  );

  return (
    <form id={id} onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack gap="md" mt="md" className={classes.root}>
        {template.billing_sections.map((section) => (
          <BillingSectionRows
            key={section.id}
            control={control}
            section={section}
          />
        ))}

        <Group className={classes.grandTotal}>
          <Text className={classes.grandTotalLabel}>
            Estimated Total Landed Cost
          </Text>
          <Text className={classes.grandTotalValue}>
            {formatPhpAmount(grandTotal)}
          </Text>
        </Group>

        {sectionError && (
          <Text c="red" size="xs" fw={500}>
            {sectionError}
          </Text>
        )}
      </Stack>
    </form>
  );
}
