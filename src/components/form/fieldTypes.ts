import type {
  Control,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";

export interface BaseFieldProps<
  TValues extends FieldValues,
  TContext = unknown,
  TTransformedValues extends FieldValues = TValues,
> {
  control: Control<TValues, TContext, TTransformedValues>;
  name: Path<TValues>;
  rules?: RegisterOptions<TValues>;
}
