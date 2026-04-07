import { Image, SimpleGrid, Stack, Text } from "@mantine/core";
import type { SignatoryValues } from "@/features/quotations/schemas/compose.schema";

interface QuotationPreviewSignatoryProps {
  signatory: SignatoryValues;
  clientName?: string;
  signaturePreviewUrl: string | null;
}

export function QuotationPreviewSignatory({
  signatory,
  clientName,
  signaturePreviewUrl,
}: QuotationPreviewSignatoryProps) {
  return (
    <SimpleGrid cols={2} mb="xl">
      <Stack gap="xs">
        <Text size="xs">{signatory.complementary_close}</Text>
        {signaturePreviewUrl && (
          <Image src={signaturePreviewUrl} w="8rem" h="3rem" fit="contain" />
        )}
        <Text size="xs" fw={700} tt="uppercase">
          {signatory.authorized_signatory_name}
        </Text>
        <Text size="xs">{signatory.position_title}</Text>
        <Text size="xs">Jill L. Tolentino Customs Brokerage</Text>
      </Stack>
      <Stack gap="xs">
        <Text size="xs">CONFORME:</Text>
        <Text size="xs" mt="xl" fw={700} tt="uppercase">
          {clientName ?? ""}
        </Text>
        <Text size="xs">Client</Text>
      </Stack>
    </SimpleGrid>
  );
}
