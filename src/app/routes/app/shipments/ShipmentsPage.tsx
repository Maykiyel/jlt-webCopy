import { Navigate, useParams } from "react-router";
import { OngoingShipments } from "@/features/shipments/components/logistics/OngoingShipments";
import { DeliveredShipments } from "@/features/shipments/components/logistics/DeliveredShipments";
import { ShipmentLogistics } from "@/features/shipments/components/logistics/ShipmentLogistics";
import { PermitsShipments } from "@/features/shipments/components/regulatory/PermitsShipments";
import { LicensesShipments } from "@/features/shipments/components/regulatory/LicensesShipments";
import { ShipmentRegulatory } from "@/features/shipments/components/regulatory/ShipmentRegulatory";

export default function ShipmentsPage() {
  const { category, subCategory } = useParams();

  // Default route: /shipments -> redirect to /shipments/logistics
  if (!category) {
    return <Navigate to="/shipments/logistics" replace />;
  }

  // Logistics routes
  if (category === "logistics") {
    switch (subCategory) {
      case "ongoing":
        return <OngoingShipments />;
      case "delivered":
        return <DeliveredShipments />;
      default:
        return <ShipmentLogistics />;
    }
  }

  // Regulatory routes
  if (category === "regulatory") {
    switch (subCategory) {
      case "permits":
        return <PermitsShipments />;
      case "licenses":
        return <LicensesShipments />;
      default:
        return <ShipmentRegulatory />;
    }
  }

  return <Navigate to="/shipments/logistics" replace />;
}
