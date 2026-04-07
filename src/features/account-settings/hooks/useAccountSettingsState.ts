import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { toUser } from "@/lib/mappers/user.mapper";
import { useAuthStore } from "@/stores/authStore";

export function useAccountSettingsState() {
  const [isEditing, setIsEditing] = useState(false);
  const rawUser = useAuthStore((state) => state.user);
  const user = rawUser ? toUser(rawUser) : null;

  const [passwordOpened, { open: openPassword, close: closePassword }] =
    useDisclosure(false);
  const [avatarOpened, { open: openAvatar, close: closeAvatar }] =
    useDisclosure(false);

  return {
    isEditing,
    setIsEditing,
    rawUser,
    user,
    passwordOpened,
    openPassword,
    closePassword,
    avatarOpened,
    openAvatar,
    closeAvatar,
  };
}
