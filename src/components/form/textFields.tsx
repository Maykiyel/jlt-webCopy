import {
  PasswordInput,
  TextInput,
  Textarea,
  type PasswordInputProps,
  type TextInputProps,
  type TextareaProps,
} from "@mantine/core";
import { Controller, type FieldValues } from "react-hook-form";
import type { BaseFieldProps } from "./fieldTypes";

export type TextInputFieldProps<T extends FieldValues> = BaseFieldProps<T> &
  Omit<TextInputProps, "value" | "onChange" | "onBlur" | "error" | "name">;

export function TextInputField<T extends FieldValues>({
  control,
  name,
  rules,
  ...rest
}: TextInputFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => (
        <TextInput
          {...rest}
          {...field}
          value={field.value ?? ""}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}

export type PasswordInputFieldProps<T extends FieldValues> = BaseFieldProps<T> &
  Omit<PasswordInputProps, "value" | "onChange" | "onBlur" | "error" | "name">;

export function PasswordInputField<T extends FieldValues>({
  control,
  name,
  rules,
  ...rest
}: PasswordInputFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => (
        <PasswordInput
          {...rest}
          {...field}
          value={field.value ?? ""}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}

export type TextareaFieldProps<T extends FieldValues> = BaseFieldProps<T> &
  Omit<TextareaProps, "value" | "onChange" | "onBlur" | "error" | "name">;

export function TextareaField<T extends FieldValues>({
  control,
  name,
  rules,
  ...rest
}: TextareaFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => (
        <Textarea
          {...rest}
          {...field}
          value={field.value ?? ""}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}
