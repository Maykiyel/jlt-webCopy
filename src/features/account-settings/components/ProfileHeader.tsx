import {
  Avatar,
  Group,
  Stack,
  Button,
  Text,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import type { User } from "@/types/api";
import { AddTwo } from "@nine-thirty-five/material-symbols-react/rounded";

interface ProfileHeaderProps {
  user: User;
  onChangeAvatar: () => void;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
}

export function ProfileHeader({
  user,
  onChangeAvatar,
  isEditing,
  onEdit,
  onCancel,
}: ProfileHeaderProps) {
  const initials = [user.firstName?.[0], user.lastName?.[0]]
    .filter(Boolean)
    .join("")
    .toUpperCase();

  return (
    <Group justify="space-between" px={50} py="xl">
      {/* Left — avatar + name */}
      <Group gap="lg">
        <div style={{ position: "relative" }}>
          <Avatar
            src={user.imageUrl ?? undefined}
            alt={user.fullName ?? ""}
            size={86}
            color="jltOrange"
          >
            {initials}
          </Avatar>

          <Tooltip label="Change profile photo" withArrow>
            <ActionIcon
              size={28}
              radius="xl"
              color="jltAccent.1"
              variant="filled"
              style={{
                position: "absolute",
                bottom: 2,
                right: 0,
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.25)",
              }}
              onClick={onChangeAvatar}
              aria-label="Change profile photo"
            >
              <AddTwo width={14} height={14} color="black" />
            </ActionIcon>
          </Tooltip>
        </div>

        <Stack gap={2}>
          <Text fw={700} size="xl" tt="uppercase">
            {user.fullName}
          </Text>
          <Text size="sm" c="dimmed" fw={600} tt="uppercase">
            {user.companyName}
          </Text>
        </Stack>
      </Group>

      {/* Right — edit / cancel buttons */}
      <Group gap={"sm"}>
        {isEditing ? (
          <>
            <Button variant="default" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" form="profile-form" color="jltAccent.7">
              SAVE
            </Button>
          </>
        ) : (
          <Button color="jltAccent.7" onClick={onEdit}>
            EDIT
          </Button>
        )}
      </Group>
    </Group>
  );
}
