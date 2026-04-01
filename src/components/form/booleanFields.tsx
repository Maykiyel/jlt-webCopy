import {
  Checkbox,
  Radio,
  Switch,
  type CheckboxProps,
  type SwitchProps,
} from "@mantine/core";
import { Controller, type FieldValues } from "react-hook-form";
import type { BaseFieldProps } from "./fieldTypes";

export type CheckboxFieldProps<T extends FieldValues> = BaseFieldProps<T> &
  Omit<CheckboxProps, "checked" | "onChange" | "onBlur" | "error" | "name">;

export function CheckboxField<T extends FieldValues>({
  control,
  name,
  rules,
  ...rest
}: CheckboxFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => (
        <Checkbox
          {...rest}
          checked={field.value ?? false}
          onChange={(event) => field.onChange(event.currentTarget.checked)}
          onBlur={field.onBlur}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}

export type SwitchFieldProps<T extends FieldValues> = BaseFieldProps<T> &
  Omit<SwitchProps, "checked" | "onChange" | "onBlur" | "error" | "name">;

export function SwitchField<T extends FieldValues>({
  control,
  name,
  rules,
  ...rest
}: SwitchFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => (
        <Switch
          {...rest}
          checked={field.value ?? false}
          onChange={(event) => field.onChange(event.currentTarget.checked)}
          onBlur={field.onBlur}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}

interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface RadioGroupFieldProps<
  T extends FieldValues,
> extends BaseFieldProps<T> {
  label?: string;
  description?: string;
  options: RadioOption[];
  direction?: "row" | "column";
}

export function RadioGroupField<T extends FieldValues>({
  control,
  name,
  rules,
  label,
  description,
  options,
  direction = "column",
}: RadioGroupFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => (
        <Radio.Group
          value={field.value ?? ""}
          onChange={field.onChange}
          onBlur={field.onBlur}
          label={label}
          description={description}
          error={fieldState.error?.message}
        >
          <div
            style={{
              display: "flex",
              flexDirection: direction,
              gap: "var(--mantine-spacing-xs)",
              marginTop: "var(--mantine-spacing-xs)",
            }}
          >
            {options.map((option) => (
              <Radio
                key={option.value}
                value={option.value}
                label={option.label}
                disabled={option.disabled}
              />
            ))}
          </div>
        </Radio.Group>
      )}
    />
  );
}
