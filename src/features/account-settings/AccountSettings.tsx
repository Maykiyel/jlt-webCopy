import { Stack, Card, Tabs } from "@mantine/core";
import { ProfileHeader } from "./components/ProfileHeader";
import { ProfileForm } from "./components/ProfileForm";
import { ChangePasswordModal } from "./components/ChangePasswordModal";
import { UploadAvatarModal } from "./components/UploadAvatarModal";
import { NotificationSettings } from "./components/NotificationSettings";
import { useAccountSettingsState } from "./hooks/useAccountSettingsState";
import classes from "./AccountSettings.module.css";

export default function AccountSettings() {
  const {
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
  } = useAccountSettingsState();

  if (!user || !rawUser) return null;

  return (
    <Card withBorder radius="lg" className={classes.card} p={0}>
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
              height: "4.25rem",
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
    </Card>
  );
}
