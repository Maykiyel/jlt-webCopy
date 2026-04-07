import { useLocation, useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Stack, Group, Text } from "@mantine/core";
import {
  Article,
  Folder,
} from "@nine-thirty-five/material-symbols-react/outlined";
import { PageCard } from "@/components/PageCard";
import { fetchQuotation } from "@/features/quotations/api/quotations.api";
import { AppButton } from "@/components/ui/AppButton";
import { QuotationDetailsSections } from "@/features/quotations/components/QuotationDetailsSections";
import { useQuotationRouteParams } from "@/features/quotations/hooks/useQuotationRouteParams";
import { quotationQueryKeys } from "@/features/quotations/api/quotationQueryKeys";
import { quotationRoutes } from "@/features/quotations/utils/quotationRoutes";

export function QuotationDetailsPage() {
  const routeParams = useQuotationRouteParams(["tab", "quotationId"] as const);
  const params = useParams<{ clientId?: string }>();
  const location = useLocation();
  const clientId = params.clientId;
  const navigate = useNavigate();
  const quotationId = routeParams?.quotationId;
  const canMakeQuotation =
    routeParams?.tab === "requested" && Boolean(clientId);
  const canMakeJobOrder = routeParams?.tab === "accepted";
  const viewerContextState =
    (location.state as { issuedQuotationId?: string } | null) ?? null;

  const { data: quotation, isLoading } = useQuery({
    queryKey: quotationQueryKeys.quotationDetails(quotationId),
    queryFn: () => {
      if (!routeParams) {
        throw new Error("Missing required route parameters.");
      }

      return fetchQuotation(routeParams.quotationId);
    },
    enabled: Boolean(routeParams),
  });

  if (!routeParams) {
    return (
      <PageCard title="Client Details">
        <Text size="0.8rem" c="dimmed">
          Invalid route parameters.
        </Text>
      </PageCard>
    );
  }

  if (isLoading || !quotation) return null;

  return (
    <PageCard
      title="Client Details"
      action={
        <AppButton
          icon={Folder}
          onClick={() =>
            navigate(
              quotationRoutes.documents({
                tab: routeParams.tab,
                clientId,
                quotationId: routeParams.quotationId,
              }),
              {
                state: viewerContextState?.issuedQuotationId
                  ? { issuedQuotationId: viewerContextState.issuedQuotationId }
                  : undefined,
              },
            )
          }
        >
          Documents
        </AppButton>
      }
    >
      <Stack gap="lg">
        <QuotationDetailsSections quotation={quotation} />

        {canMakeQuotation ? (
          <Group justify="center" mt="0.5rem">
            <AppButton
              variant="primary"
              onClick={() =>
                navigate(
                  quotationRoutes.compose({
                    tab: routeParams.tab,
                    clientId: clientId!,
                    quotationId: routeParams.quotationId,
                  }),
                )
              }
            >
              Make Quotation
            </AppButton>
          </Group>
        ) : null}

        {canMakeJobOrder ? (
          <Group justify="center" mt="0.5rem">
            <AppButton
              variant="primary"
              icon={Article}
              onClick={() => {
                // TODO: connect accepted quotation -> make job order flow.
              }}
            >
              MAKE JOB ORDER
            </AppButton>
          </Group>
        ) : null}
      </Stack>
    </PageCard>
  );
}
