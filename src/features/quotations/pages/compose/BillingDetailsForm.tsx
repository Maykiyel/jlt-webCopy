import { zodResolver } from "@hookform/resolvers/zod";
import { ActionIcon, Grid, Group, Stack, Text } from "@mantine/core";
import { Add, Delete } from "@nine-thirty-five/material-symbols-react/outlined";
import {
  type Control,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import * as z from "zod";
import { NativeSelectField, NumberInputField } from "@/components/form";
import { PLACEHOLDER_GLOBAL_BILLING_SETTINGS } from "@/features/quotations/data/composePlaceholders";
import {
  billingDetailsSchema,
  type BillingDetailsValues,
} from "@/features/quotations/schemas/compose.schema";
import type {
  BillingSection,
  QuotationTemplate,
} from "@/features/quotations/types/compose.types";
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

function BillingSectionRows({
  control,
  section,
}: {
  control: Control<BillingDetailsFormInput>;
  section: BillingSection;
}) {
  const sectionName = `sections.${section.id}` as const;
  const fieldArray = useFieldArray({ control, name: sectionName });
  const rows = useWatch({ control, name: sectionName }) ?? [];
  const total = rows.reduce((sum, row) => sum + (row?.amount ?? 0), 0);

  // TODO: replace with useQuery when GET /billing-settings is available
  const { currencies, uoms } = PLACEHOLDER_GLOBAL_BILLING_SETTINGS;

  return (
    <div className={classes.section}>
      <div className={classes.sectionHeader}>
        <Text className={classes.sectionTitle}>{section.title}</Text>
        <ActionIcon
          variant="subtle"
          color="jltBlue.8"
          className={classes.addButton}
          onClick={() =>
            fieldArray.append({
              description: "",
              currency: "",
              uom: "",
              amount: null,
            })
          }
          aria-label={`Add ${section.title} row`}
        >
          <Add width="1rem" height="1rem" />
        </ActionIcon>
      </div>

      <div className={classes.rows}>
        {fieldArray.fields.length === 0 && <div className={classes.emptyRow} />}
        {fieldArray.fields.map((field, index) => (
          <Grid key={field.id} gutter={0} className={classes.row}>
            <Grid.Col span={4} className={classes.cell}>
              <NativeSelectField
                control={control}
                name={`sections.${section.id}.${index}.description`}
                label=""
                data={[
                  { value: "", label: "SELECT RECEIPT CHARGES" },
                  ...section.available_charges,
                ]}
                styles={{
                  input: {
                    border: 0,
                    borderRadius: 0,
                    background: "transparent",
                    minHeight: "2.875rem",
                    height: "2.875rem",
                    color: "var(--mantine-color-jltBlue-8)",
                    fontWeight: 500,
                    fontSize: "0.8125rem",
                    textTransform: "uppercase",
                  },
                }}
              />
            </Grid.Col>

            <Grid.Col span={2} className={classes.cell}>
              <NativeSelectField
                control={control}
                name={`sections.${section.id}.${index}.currency`}
                label=""
                data={[{ value: "", label: "CURRENCY" }, ...currencies]}
                styles={{
                  input: {
                    border: 0,
                    borderRadius: 0,
                    background: "transparent",
                    minHeight: "2.875rem",
                    height: "2.875rem",
                    color: "var(--mantine-color-jltBlue-8)",
                    fontWeight: 500,
                    fontSize: "0.8125rem",
                    textTransform: "uppercase",
                  },
                }}
              />
            </Grid.Col>

            <Grid.Col span={2} className={classes.cell}>
              <NativeSelectField
                control={control}
                name={`sections.${section.id}.${index}.uom`}
                label=""
                data={[{ value: "", label: "UOM" }, ...uoms]}
                styles={{
                  input: {
                    border: 0,
                    borderRadius: 0,
                    background: "transparent",
                    minHeight: "2.875rem",
                    height: "2.875rem",
                    color: "var(--mantine-color-jltBlue-8)",
                    fontWeight: 500,
                    fontSize: "0.8125rem",
                    textTransform: "uppercase",
                  },
                }}
              />
            </Grid.Col>

            <Grid.Col span={3} className={classes.cell}>
              <div className={classes.amountCell}>
                <NumberInputField
                  control={control}
                  name={`sections.${section.id}.${index}.amount`}
                  label=""
                  hideControls
                  min={0}
                  thousandSeparator=","
                  styles={{
                    input: {
                      border: 0,
                      borderRadius: 0,
                      background: "transparent",
                      minHeight: "2.875rem",
                      height: "2.875rem",
                      color: "var(--mantine-color-jltBlue-8)",
                      fontWeight: 500,
                      fontSize: "0.8125rem",
                      textAlign: "right",
                    },
                  }}
                />
                {(rows[index]?.amount === null ||
                  rows[index]?.amount === undefined) && (
                  <Text className={classes.amountPlaceholder}>
                    ENTER AMOUNT
                  </Text>
                )}
              </div>
            </Grid.Col>

            <Grid.Col
              span={1}
              className={`${classes.cell} ${classes.deleteCell}`}
            >
              <ActionIcon
                variant="subtle"
                color="red"
                className={classes.deleteButton}
                onClick={() => fieldArray.remove(index)}
                aria-label={`Remove ${section.title} row ${index + 1}`}
              >
                <Delete width="1rem" height="1rem" />
              </ActionIcon>
            </Grid.Col>
          </Grid>
        ))}
      </div>

      <div className={classes.totalRow}>
        <Text className={classes.totalLabel}>{`Total ${section.title}`}</Text>
        <Text className={classes.totalValue}>{formatPhpAmount(total)}</Text>
      </div>
    </div>
  );
}

export function BillingDetailsForm({
  id,
  template,
  defaultValues,
  onSubmit,
}: BillingDetailsFormProps) {
  const { control, handleSubmit } = useForm<
    BillingDetailsFormInput,
    unknown,
    BillingDetailsValues
  >({
    resolver: zodResolver(billingDetailsSchema),
    defaultValues: defaultValues ?? { sections: {} },
  });

  const sections = (useWatch({ control, name: "sections" }) ??
    {}) as BillingDetailsValues["sections"];
  const grandTotal = Object.values(sections).reduce((sum, rows) => {
    const subtotal = (rows ?? []).reduce(
      (rowSum, row) => rowSum + (row.amount ?? 0),
      0,
    );
    return sum + subtotal;
  }, 0);

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
      </Stack>
    </form>
  );
}
