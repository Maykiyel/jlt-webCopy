import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Group, SimpleGrid, Stack, Text, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TextInputField, NativeSelectField } from "@/components/form";
import {
  profileSchema,
  type ProfileFormValues,
} from "../schemas/accountSettings.schema";
import { accountSettingsService } from "../services/accountSettings.service";
import { useAuthStore } from "@/stores/authStore";
import { ROLES } from "@/types/roles";
import type { User } from "@/types/api";

const ROLE_OPTIONS = Object.values(ROLES).map((r) => ({ value: r, label: r }));

interface ProfileFormProps {
  user: User;
  onChangePassword: () => void;
  isEditing: boolean;
  onSaveSuccess: () => void;
}

export function ProfileForm({
  user,
  onChangePassword,
  isEditing,
  onSaveSuccess,
}: ProfileFormProps) {
  const setUser = useAuthStore((s) => s.setUser);
  const queryClient = useQueryClient();

  const { control, handleSubmit } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: user.firstName ?? "",
      last_name: user.lastName ?? "",
      position: user.role ?? "",
      contact_number: user.contactNumber ?? "",
      email: user.email ?? "",
    },
  });

  const updateMutation = useMutation({
    mutationFn: (values: ProfileFormValues) =>
      accountSettingsService.updateProfile(user.id, values),
    onSuccess: (res) => {
      setUser(res.data);
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      notifications.show({
        title: "Profile updated",
        message: "Your profile has been saved successfully.",
        color: "green",
      });
      onSaveSuccess();
    },
    onError: () => {
      notifications.show({
        title: "Update failed",
        message: "Something went wrong. Please try again.",
        color: "red",
      });
    },
  });

  const readOnly = !isEditing;

  return (
    <form
      id="profile-form"
      onSubmit={handleSubmit((v) => updateMutation.mutate(v))}
    >
      <Stack gap="md" px={"3.125rem"}>
        {/* Row 1 */}
        <SimpleGrid cols={2}>
          <TextInputField
            control={control}
            name="first_name"
            label="FIRST NAME"
            readOnly={readOnly}
            variant={readOnly ? "filled" : "default"}
          />
          <TextInputField
            control={control}
            name="last_name"
            label="LAST NAME"
            readOnly={readOnly}
            variant={readOnly ? "filled" : "default"}
          />
        </SimpleGrid>

        {/* Row 2 */}
        <SimpleGrid cols={2}>
          {readOnly ? (
            <TextInput
              label="POSITION"
              value={user.role ?? ""}
              readOnly
              variant="filled"
            />
          ) : (
            <NativeSelectField
              control={control}
              name="position"
              label="POSITION"
              data={ROLE_OPTIONS}
            />
          )}
          <TextInputField
            control={control}
            name="contact_number"
            label="CONTACT NUMBER"
            readOnly={readOnly}
            variant={readOnly ? "filled" : "default"}
          />
        </SimpleGrid>

        {/* Row 3 */}
        <SimpleGrid cols={readOnly ? 2 : 2}>
          <TextInputField
            control={control}
            name="email"
            label="EMAIL ADDRESS"
            readOnly={readOnly}
            variant={readOnly ? "filled" : "default"}
          />

          {readOnly && (
            <Stack gap={4}>
              <Group justify="space-between">
                <Text size="sm" fw={500}>
                  PASSWORD
                </Text>
                <Text
                  size="sm"
                  c="jltOrange.5"
                  fs="italic"
                  style={{ cursor: "pointer" }}
                  onClick={onChangePassword}
                >
                  Change password
                </Text>
              </Group>
              <TextInput
                label=""
                type="password"
                value="••••••••••••"
                readOnly
                variant="filled"
              />
            </Stack>
          )}
        </SimpleGrid>
      </Stack>
    </form>
  );
}
