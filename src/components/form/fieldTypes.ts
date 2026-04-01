import type {
  Control,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";

export interface BaseFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  rules?: RegisterOptions<T>;
}
