import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { SimpleGrid, Text } from "@mantine/core";
import { PageCard } from "@/components/PageCard";
import { DocumentCard } from "@/components/DocumentCard";
import { fetchQuotationFiles } from "../../services/quotations.service";

export function QuotationDocuments() {
  const { quotationId } = useParams<{ quotationId: string }>();

  const { data: files = [], isLoading } = useQuery({
    queryKey: ["quotation-files", quotationId],
    queryFn: () => fetchQuotationFiles(quotationId!),
    enabled: !!quotationId,
  });

  return (
    <PageCard title="Client Documents">
      {!isLoading && files.length === 0 ? (
        <Text size="0.8rem" c="dimmed">
          No documents available.
        </Text>
      ) : (
        <SimpleGrid cols={4} spacing="1rem">
          {files.map((file) => (
            <DocumentCard key={file.id} file={file} />
          ))}
        </SimpleGrid>
      )}
    </PageCard>
  );
}
