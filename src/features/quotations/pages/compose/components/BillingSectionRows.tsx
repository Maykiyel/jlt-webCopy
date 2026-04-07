import { ActionIcon, Grid, Text } from "@mantine/core";
import {
  AddTwo,
  Delete,
} from "@nine-thirty-five/material-symbols-react/outlined";
import {
  Controller,
  type Control,
  useFieldArray,
  useWatch,
} from "react-hook-form";
import * as z from "zod";
import { SelectField } from "@/components/form/selectFields";
import { NumberInputField } from "@/components/form/valueFields";
import { useComposeBillingSettings } from "@/features/quotations/pages/compose/hooks/useComposeReferenceData";
import { billingDetailsSchema } from "@/features/quotations/schemas/compose.schema";
import type { BillingSection } from "@/features/quotations/types/compose.types";
import { tableSelectStyles } from "./billingSelectStyles";
import { ReceiptChargeField } from "./ReceiptChargeField";
import classes from "../BillingDetailsForm.module.css";

type BillingDetailsFormInput = z.input<typeof billingDetailsSchema>;

function formatPhpAmount(value: number): string {
  return `PHP ${value.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;
}

interface BillingSectionRowsProps {
  control: Control<BillingDetailsFormInput>;
  section: BillingSection;
}

export function BillingSectionRows({
  control,
  section,
}: BillingSectionRowsProps) {
  const sectionName = `sections.${section.id}` as const;
  const fieldArray = useFieldArray({ control, name: sectionName });
  const hasRows = fieldArray.fields.length > 0;
  const rows = useWatch({ control, name: sectionName }) ?? [];
  const total = rows.reduce((sum, row) => sum + (row?.amount ?? 0), 0);
  const { data: billingSettings } = useComposeBillingSettings();

  const currencies = billingSettings?.currencies ?? [];
  const uoms = billingSettings?.uoms ?? [];

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
          <AddTwo width="1.125rem" height="1.125rem" />
        </ActionIcon>
      </div>

      {hasRows && (
        <div className={classes.rows}>
          {fieldArray.fields.map((field, index) => (
            <Grid
              key={field.id}
              gutter={0}
              columns={24}
              className={classes.row}
            >
              <Grid.Col span={{ base: 24, sm: 10 }} className={classes.cell}>
                <Controller
                  control={control}
                  name={`sections.${section.id}.${index}.description`}
                  render={({ field: formField, fieldState }) => {
                    return (
                      <ReceiptChargeField
                        value={formField.value ?? ""}
                        availableCharges={section.available_charges}
                        onChange={(nextValue) => formField.onChange(nextValue)}
                        onBlur={formField.onBlur}
                        error={fieldState.error?.message}
                      />
                    );
                  }}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 4 }} className={classes.cell}>
                <SelectField
                  control={control}
                  name={`sections.${section.id}.${index}.currency`}
                  label=""
                  placeholder="CURRENCY"
                  data={currencies}
                  comboboxProps={{
                    withinPortal: false,
                    offset: 0,
                    position: "bottom-start",
                  }}
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
                    ...tableSelectStyles,
                  }}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 4 }} className={classes.cell}>
                <SelectField
                  control={control}
                  name={`sections.${section.id}.${index}.uom`}
                  label=""
                  placeholder="UOM"
                  data={uoms}
                  comboboxProps={{
                    withinPortal: false,
                    offset: 0,
                    position: "bottom-start",
                  }}
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
                    ...tableSelectStyles,
                  }}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 20, sm: 5 }} className={classes.cell}>
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
                        textAlign: "center",
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
                span={{ base: 4, sm: 1 }}
                className={`${classes.cell} ${classes.deleteCell}`}
              >
                <ActionIcon
                  variant="subtle"
                  color="red"
                  className={classes.deleteButton}
                  onClick={() => fieldArray.remove(index)}
                  aria-label={`Remove ${section.title} row ${index + 1}`}
                >
                  <Delete width="1.5rem" height="1.5rem" />
                </ActionIcon>
              </Grid.Col>
            </Grid>
          ))}
        </div>
      )}

      {hasRows && (
        <div className={classes.totalRow}>
          <Text className={classes.totalLabel}>{`Total ${section.title}`}</Text>
          <Text className={classes.totalValue}>{formatPhpAmount(total)}</Text>
        </div>
      )}
    </div>
  );
}
