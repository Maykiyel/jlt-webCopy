import { useState, useRef } from "react";
import { Modal, Button, Stack, Text, Image } from "@mantine/core";
import {
  Dropzone,
  IMAGE_MIME_TYPE,
  type FileWithPath,
} from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CloudUpload,
  Delete,
} from "@nine-thirty-five/material-symbols-react/rounded";
import { Cancel } from "@nine-thirty-five/material-symbols-react/rounded/filled";
import { accountSettingsService } from "../api/accountSettings.service";
import { userService } from "@/services/user.service";
import { useAuthStore } from "@/stores/authStore";
import { AppButton } from "@/components/ui/AppButton";

interface UploadAvatarModalProps {
  opened: boolean;
  onClose: () => void;
  userId: number;
}

export function UploadAvatarModal({
  opened,
  onClose,
  userId,
}: UploadAvatarModalProps) {
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const openRef = useRef<() => void>(null);
  const setUser = useAuthStore((s) => s.setUser);
  const rawUser = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: (file: File) =>
      accountSettingsService.uploadAvatar(userId, file),
    onSuccess: async () => {
      if (rawUser) {
        const res = await userService.getById(rawUser.id);
        setUser(res.data);
      }
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      notifications.show({
        title: "Avatar updated",
        message: "Your profile photo has been updated.",
        color: "green",
      });
      handleClose();
    },
    onError: () => {
      notifications.show({
        title: "Upload failed",
        message: "Something went wrong uploading your photo.",
        color: "red",
      });
    },
  });

  function handleClose() {
    setFiles([]);
    onClose();
  }

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Upload an Image"
      centered
      size="sm"
      styles={{
        title: { fontWeight: 600, textAlign: "center", width: "200%" },
      }}
    >
      <Stack gap="md">
        {files.length === 0 ? (
          <Dropzone
            openRef={openRef}
            onDrop={setFiles}
            accept={IMAGE_MIME_TYPE}
            maxSize={5 * 1024 ** 2}
            maxFiles={1}
            multiple={false}
            loading={uploadMutation.isPending}
            radius="md"
            onReject={() =>
              notifications.show({
                title: "Invalid file",
                message: "Please upload an image under 5MB.",
                color: "red",
              })
            }
          >
            <Stack
              align="center"
              gap="xs"
              py="md"
              style={{ pointerEvents: "none" }}
            >
              <Dropzone.Accept>
                <CloudUpload
                  width="4.875rem"
                  height="5.25rem"
                  color="var(--mantine-color-jltBlue-8)"
                />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <Cancel
                  width="3.25rem"
                  height="3.25rem"
                  color="var(--mantine-color-red-6)"
                />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <CloudUpload
                  width="3.25rem"
                  height="3.25rem"
                  color="var(--mantine-color-gray-5)"
                />
              </Dropzone.Idle>

              <Stack gap={4} align="center">
                <Text fw={600} size="sm">
                  Drag and drop image to upload
                </Text>
                <Text size="xs" c="dimmed" ta="center" maw="13.75rem">
                  Your image will be private until you publish your profile
                </Text>
              </Stack>

              <Button
                size="xs"
                radius="xl"
                color="jltAccent.7"
                mt="xs"
                style={{ pointerEvents: "all" }}
                onClick={() => openRef.current?.()}
              >
                Select files
              </Button>
            </Stack>
          </Dropzone>
        ) : (
          <Stack align="center" gap="xs">
            <Image
              src={URL.createObjectURL(files[0])}
              onLoad={(e) =>
                URL.revokeObjectURL((e.target as HTMLImageElement).src)
              }
              h="12.5rem"
              w="12.5rem"
              fit="cover"
              radius="xl"
              style={{ borderRadius: "50%" }}
            />
            <Text size="xs" c="dimmed" truncate maw="15.625rem">
              {files[0]?.name}
            </Text>
            <Button
              variant="subtle"
              color="red"
              size="xs"
              leftSection={<Delete width="0.875rem" height="0.875rem" />}
              onClick={() => setFiles([])}
            >
              Remove
            </Button>
          </Stack>
        )}

        <AppButton
          variant="secondary"
          h={"2.625rem"}
          style={{ alignSelf: "center" }}
          disabled={files.length === 0}
          loading={uploadMutation.isPending}
          onClick={() => files[0] && uploadMutation.mutate(files[0])}
        >
          UPLOAD
        </AppButton>
      </Stack>
    </Modal>
  );
}
