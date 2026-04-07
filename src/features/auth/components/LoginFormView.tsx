import * as z from "zod";
import { Button, Box, Stack, Title, Text } from "@mantine/core";
import {
  TextInputField,
  PasswordInputField,
} from "@/components/form/textFields";
import { loginSchema } from "@/features/auth/schemas/loginSchema";
import type { FormEventHandler } from "react";
import type { Control } from "react-hook-form";

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormViewProps {
  control: Control<LoginFormValues>;
  isLoading: boolean;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

export function LoginFormView({
  control,
  isLoading,
  onSubmit,
}: LoginFormViewProps) {
  return (
    <Stack gap="lg" w={450}>
      <Title ta="center" c="jltOrange.5">
        LOGIN
      </Title>
      <Box
        py={12}
        pl={12}
        style={(theme) => ({
          boxShadow: `inset 5px 0 0 ${theme.colors.jltOrange[5]}`,
        })}
      >
        <Text
          size="1.6875rem"
          c="jltBlue"
          ta="right"
          style={{
            whiteSpace: "nowrap",
          }}
        >
          Welcome back, you've been missed!
        </Text>
      </Box>

      <form onSubmit={onSubmit} noValidate>
        <Stack gap="md" align="stretch">
          <TextInputField
            control={control}
            name="email"
            placeholder="USERNAME OR EMAIL"
            type="text"
            required
            size="lg"
          />

          <PasswordInputField
            control={control}
            name="password"
            placeholder="PASSWORD"
            required
            size="lg"
          />

          <Button
            type="submit"
            fullWidth
            loading={isLoading}
            mt="sm"
            radius="sm"
            size="lg"
            style={{
              boxShadow: "0 4px 4px #BEBEBE",
            }}
          >
            Sign in
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
