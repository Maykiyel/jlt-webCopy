import { useQuery } from "@tanstack/react-query";
import { SimpleGrid, Text } from "@mantine/core";
import { RequestQuote } from "@nine-thirty-five/material-symbols-react/outlined";
import { useLocation, useNavigate, useParams } from "react-router";
import { PageCard } from "@/components/PageCard";
import { DocumentCard } from "@/components/DocumentCard";
import { AppButton } from "@/components/ui/AppButton";
import { fetchQuotationFiles } from "@/features/quotations/api/quotations.api";
import { useQuotationRouteParams } from "@/features/quotations/hooks/useQuotationRouteParams";
import { quotationQueryKeys } from "@/features/quotations/api/quotationQueryKeys";
import { quotationRoutes } from "@/features/quotations/utils/quotationRoutes";

export function QuotationDocuments() {
  const routeParams = useQuotationRouteParams(["tab", "quotationId"] as const);
  const params = useParams<{ clientId?: string }>();
  const location = useLocation();
  const clientId = params.clientId;
  const navigate = useNavigate();
  const viewerContextState =
    (location.state as { issuedQuotationId?: string } | null) ?? null;
  const hasValidRouteParams = Boolean(routeParams);
  const quotationId = routeParams?.quotationId;
  const showQuotationButton =
    routeParams?.tab === "responded" || routeParams?.tab === "accepted";

  const { data: files = [], isLoading } = useQuery({
    queryKey: quotationQueryKeys.quotationFiles(quotationId, "REQUESTED"),
    queryFn: () => {
      if (!routeParams) {
        throw new Error("Missing required route parameters.");
      }

      return fetchQuotationFiles(routeParams.quotationId, "REQUESTED");
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
    <PageCard
      title="Client Documents"
      fullHeight
      action={
        showQuotationButton ? (
          <AppButton
            icon={RequestQuote}
            onClick={() =>
              navigate(
                quotationRoutes.viewer({
                  tab: routeParams.tab,
                  quotationId: routeParams.quotationId,
                  clientId,
                  issuedQuotationId:
                    viewerContextState?.issuedQuotationId ?? undefined,
                }),
              )
            }
          >
            QUOTATION
          </AppButton>
        ) : undefined
      }
    >
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
