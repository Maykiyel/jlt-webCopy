import { useDisclosure } from "@mantine/hooks";
import { Flex, Stack, Card, Tabs, BackgroundImage } from "@mantine/core";
import { toUser } from "@/lib/mappers/user.mapper";
import { useAuthStore } from "@/stores/authStore";
import { ProfileHeader } from "./components/ProfileHeader";
import { ProfileForm } from "./components/ProfileForm";
import { ChangePasswordModal } from "./components/ChangePasswordModal";
import { UploadAvatarModal } from "./components/UploadAvatarModal";
import { NotificationSettings } from "./components/NotificationSettings";
import accountBg from "@/assets/abstract-bg.png";
import classes from "./AccountSettings.module.css";
import { useState } from "react";

export default function AccountSettings() {
  const [isEditing, setIsEditing] = useState(false);
  const rawUser = useAuthStore((s) => s.user);
  const user = rawUser ? toUser(rawUser) : null;

  const [passwordOpened, { open: openPassword, close: closePassword }] =
    useDisclosure(false);
  const [avatarOpened, { open: openAvatar, close: closeAvatar }] =
    useDisclosure(false);

  if (!user || !rawUser) return null;

  return (
    <Flex justify={"center"} align={"center"} mih={"100%"}>
      <Card withBorder radius="lg" className={classes.card} p={0}>
        {/* Faded background */}
        <BackgroundImage
          src={accountBg}
          radius="md"
          style={{ position: "absolute", inset: 0, opacity: 0.15, zIndex: 0 }}
        />

        {/* Content above background */}
        <div style={{ position: "relative", zIndex: 1, height: "100%" }}>
          <Tabs
            defaultValue="account"
            color="jltOrange.5"
            classNames={{ tab: classes.tab, list: classes.tabList }}
          >
            <Tabs.List
              grow
              style={{
                background: "linear-gradient(135deg, #0D2842, #4E6174)",
                height: 68,
                color: "white",
                fontWeight: 500,
              }}
            >
              <Tabs.Tab value="account">ACCOUNT SETTINGS</Tabs.Tab>
              <Tabs.Tab value="notifications">NOTIFICATION SETTINGS</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="account">
              <Stack>
                <ProfileHeader
                  user={user}
                  onChangeAvatar={openAvatar}
                  isEditing={isEditing}
                  onEdit={() => setIsEditing(true)}
                  onCancel={() => setIsEditing(false)}
                />
                <ProfileForm
                  user={user}
                  onChangePassword={openPassword}
                  isEditing={isEditing}
                  onSaveSuccess={() => setIsEditing(false)}
                />
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="notifications">
              <NotificationSettings />
            </Tabs.Panel>
          </Tabs>
        </div>
      </Card>

      <ChangePasswordModal
        opened={passwordOpened}
        onClose={closePassword}
        userId={rawUser.id}
      />

      <UploadAvatarModal
        opened={avatarOpened}
        onClose={closeAvatar}
        userId={rawUser.id}
      />
    </Flex>
  );
}
