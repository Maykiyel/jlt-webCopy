import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  profileSchema,
  type ProfileFormValues,
} from "@/features/account-settings/schemas/accountSettings.schema";
import { accountSettingsService } from "@/features/account-settings/services/accountSettings.service";
import { useAuthStore } from "@/stores/authStore";
import { ROLES } from "@/types/roles";
import type { User } from "@/types/api";

interface UseProfileFormParams {
  user: User;
  onSaveSuccess: () => void;
}

export function useProfileForm({ user, onSaveSuccess }: UseProfileFormParams) {
  const setUser = useAuthStore((state) => state.setUser);
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
    mutationFn: (values: ProfileFormValues) => {
      const payload = { ...values };
      if (user.role !== ROLES.IT) {
        delete payload.position;
      }
      return accountSettingsService.updateProfile(user.id, payload);
    },
    onSuccess: (response) => {
      setUser(response.data);
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

  return {
    control,
    submitProfileForm: handleSubmit((values) => updateMutation.mutate(values)),
  };
}
