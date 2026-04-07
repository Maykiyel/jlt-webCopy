import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Stack, Group, Text } from "@mantine/core";
import { Folder } from "@nine-thirty-five/material-symbols-react/outlined";
import { PageCard } from "@/components/PageCard";
import { fetchQuotation } from "../../services/quotations.service";
import { AppButton } from "@/components/ui/AppButton";
import { QuotationDetailsSections } from "./components/QuotationDetailsSections";
import { useRequestedRouteParams } from "./hooks/useRequestedRouteParams";
import { requestedQueryKeys } from "./utils/requestedQueryKeys";
import { requestedRoutes } from "./utils/requestedRoutes";

export function QuotationDetailsPage() {
  const routeParams = useRequestedRouteParams([
    "tab",
    "clientId",
    "quotationId",
  ] as const);
  const navigate = useNavigate();
  const quotationId = routeParams?.quotationId;

  const { data: quotation, isLoading } = useQuery({
    queryKey: requestedQueryKeys.quotationDetails(quotationId),
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
              requestedRoutes.documents({
                tab: routeParams.tab,
                clientId: routeParams.clientId,
                quotationId: routeParams.quotationId,
              }),
            )
          }
        >
          Documents
        </AppButton>
      }
    >
      <Stack gap="lg">
        <QuotationDetailsSections quotation={quotation} />

        <Group justify="center" mt="0.5rem">
          <AppButton
            variant="primary"
            onClick={() =>
              navigate(
                requestedRoutes.compose({
                  tab: routeParams.tab,
                  clientId: routeParams.clientId,
                  quotationId: routeParams.quotationId,
                }),
              )
            }
          >
            Make Quotation
          </AppButton>
        </Group>
      </Stack>
    </PageCard>
  );
}
