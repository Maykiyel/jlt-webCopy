import { useQuery } from "@tanstack/react-query";
import { SimpleGrid, Text } from "@mantine/core";
import { PageCard } from "@/components/PageCard";
import { DocumentCard } from "@/components/DocumentCard";
import { fetchQuotationFiles } from "../../services/quotations.service";
import { useRequestedRouteParams } from "./hooks/useRequestedRouteParams";
import { requestedQueryKeys } from "./utils/requestedQueryKeys";

export function QuotationDocuments() {
  const routeParams = useRequestedRouteParams(["quotationId"] as const);
  const hasValidRouteParams = Boolean(routeParams);
  const quotationId = routeParams?.quotationId;

  const { data: files = [], isLoading } = useQuery({
    queryKey: requestedQueryKeys.quotationFiles(quotationId),
    queryFn: () => {
      if (!routeParams) {
        throw new Error("Missing required route parameters.");
      }

      return fetchQuotationFiles(routeParams.quotationId);
    },
    enabled: hasValidRouteParams,
  });

  if (!hasValidRouteParams) {
    return (
      <PageCard title="Client Documents" fullHeight>
        <Text size="0.8rem" c="dimmed">
          Invalid route parameters.
        </Text>
      </PageCard>
    );
  }

  return (
    <PageCard title="Client Documents" fullHeight>
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
