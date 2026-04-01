import {
  FileInput,
  NumberInput,
  type FileInputProps,
  type NumberInputProps,
} from "@mantine/core";
import { Controller, type FieldValues } from "react-hook-form";
import type { BaseFieldProps } from "./fieldTypes";

export type NumberInputFieldProps<T extends FieldValues> = BaseFieldProps<T> &
  Omit<NumberInputProps, "value" | "onChange" | "onBlur" | "error" | "name">;

export function NumberInputField<T extends FieldValues>({
  control,
  name,
  rules,
  ...rest
}: NumberInputFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => (
        <NumberInput
          {...rest}
          value={field.value ?? ""}
          onChange={(value) => field.onChange(value)}
          onBlur={field.onBlur}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}

export type FileInputFieldProps<T extends FieldValues> = BaseFieldProps<T> &
  Omit<FileInputProps, "value" | "onChange" | "onBlur" | "error" | "name">;

export function FileInputField<T extends FieldValues>({
  control,
  name,
  rules,
  ...rest
}: FileInputFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => (
        <FileInput
          {...rest}
          value={field.value ?? null}
          onChange={(file) => field.onChange(file)}
          onBlur={field.onBlur}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}
