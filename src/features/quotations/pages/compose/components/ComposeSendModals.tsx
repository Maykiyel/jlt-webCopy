import {
  Box,
  Divider,
  Group,
  Modal,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import {
  AssignmentTurnedIn,
  Warning,
} from "@nine-thirty-five/material-symbols-react/outlined";

interface ComposeSendModalsProps {
  sendConfirmOpened: boolean;
  sendSuccessOpened: boolean;
  isSending: boolean;
  onCloseSendConfirm: () => void;
  onSend: () => void | Promise<void>;
  onCloseSendSuccess: () => void;
}

export function ComposeSendModals({
  sendConfirmOpened,
  sendSuccessOpened,
  isSending,
  onCloseSendConfirm,
  onSend,
  onCloseSendSuccess,
}: ComposeSendModalsProps) {
  return (
    <>
      <Modal
        opened={sendConfirmOpened}
        onClose={onCloseSendConfirm}
        centered
        withCloseButton={false}
        size="sm"
        padding={0}
      >
        <Stack align="center" gap="md" p="xl">
          <Warning width={160} height={160} color="red" />
          <Box>
            <Text fw={500} ta="center">
              Send Quotation?
            </Text>
            <Text size="xs" c="dimmed" ta="center">
              You're about to send this quotation to the client. Please review
              all details carefully. Changes after sending will require a
              revised quotation.
            </Text>
          </Box>
        </Stack>
        <Group w="100%" gap={0}>
          <Divider w="100%" />
          <UnstyledButton
            onClick={onSend}
            disabled={isSending}
            style={{
              flex: 1,
              textAlign: "center",
              padding: "0.75rem",
              borderRight: "0.5px solid var(--mantine-color-gray-3)",
              opacity: isSending ? 0.5 : 1,
            }}
          >
            <Text size="sm" fw={500} c="red">
              {isSending ? "SENDING..." : "YES"}
            </Text>
          </UnstyledButton>
          <UnstyledButton
            onClick={onCloseSendConfirm}
            disabled={isSending}
            style={{ flex: 1, textAlign: "center", padding: "0.75rem" }}
          >
            <Text size="sm" fw={500} c="dimmed">
              CANCEL
            </Text>
          </UnstyledButton>
        </Group>
      </Modal>

      <Modal
        opened={sendSuccessOpened}
        onClose={onCloseSendSuccess}
        centered
        withCloseButton={false}
        size="sm"
        padding={0}
      >
        <Stack align="center" gap="md" p="xl">
          <AssignmentTurnedIn width={160} height={160} color="green" />

          <Box>
            <Text fw={600} tt="uppercase" ta="center">
              Successfully Submitted!
            </Text>
            <Text size="sm" c="dimmed" ta="center">
              We'll notify you as soon as the client accepted the quotation!
            </Text>
          </Box>
        </Stack>
        <Divider w="100%" />

        <UnstyledButton
          onClick={onCloseSendSuccess}
          style={{
            width: "100%",
            textAlign: "center",
            padding: "1rem 2rem",
          }}
        >
          <Text size="sm" c="dimmed">
            OK
          </Text>
        </UnstyledButton>
      </Modal>
    </>
  );
}
