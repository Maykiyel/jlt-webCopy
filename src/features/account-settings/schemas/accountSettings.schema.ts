import * as z from "zod";

const contactNumberSchema = z.preprocess(
  (value) => {
    if (value === null || value === undefined) return undefined;
    if (typeof value === "string" && value.trim() === "") return undefined;
    return value;
  },
  z
    .string()
    .regex(/^09\d{9}$/, "Must be a valid PH number (09XXXXXXXXX)")
    .optional(),
);

export const profileSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  position: z.string().nullable().optional(),
  contact_number: contactNumberSchema,
  email: z.email("Invalid email address"),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export const changePasswordSchema = z
  .object({
    current_password: z.string().optional(),
    new_password: z.string().min(8, "Password must be at least 8 characters"),
    new_password_confirmation: z
      .string()
      .min(1, "Please confirm your password"),
  })
  .refine((data) => data.new_password === data.new_password_confirmation, {
    message: "Passwords do not match",
    path: ["new_password_confirmation"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
