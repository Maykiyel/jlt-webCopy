import type { ClientInformationField } from "@/features/quotations/types/compose.types";
import type { QuotationResource } from "@/features/quotations/types/quotations.types";

interface ClientInformationValueInput {
  label: string;
  value: string | number | boolean | null;
}

export interface ResolvedClientInformationField {
  id: string;
  label: string;
  value: string;
}

type UnknownRecord = Record<string, unknown>;

function toRecord(value: unknown): UnknownRecord | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as UnknownRecord;
}

function toDisplayValue(value: unknown): string | null {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return null;
}

function findValueByKey(
  source: unknown,
  key: string,
  depth = 0,
): string | null {
  if (depth > 4) {
    return null;
  }

  const record = toRecord(source);
  if (!record) {
    return null;
  }

  const directValue = toDisplayValue(record[key]);
  if (directValue) {
    return directValue;
  }

  for (const nested of Object.values(record)) {
    const nestedRecord = toRecord(nested);
    if (!nestedRecord) {
      continue;
    }

    const value = findValueByKey(nestedRecord, key, depth + 1);
    if (value) {
      return value;
    }
  }

  return null;
}

export function resolveClientInformationFields(
  quotation: QuotationResource,
  fields: ClientInformationField[] = [],
  providedValues?: ClientInformationValueInput[],
): ResolvedClientInformationField[] {
  if (providedValues && providedValues.length > 0) {
    return providedValues.map((field, index) => ({
      id: `client-input-${index + 1}`,
      label: field.label,
      value: toDisplayValue(field.value) ?? "—",
    }));
  }

  const quotationRecord = quotation as unknown as UnknownRecord;

  return fields.map((field) => {
    const value =
      toDisplayValue(field.value) ??
      findValueByKey(quotationRecord, field.id) ??
      "—";

    return {
      id: field.id,
      label: field.label,
      value,
    };
  });
}
