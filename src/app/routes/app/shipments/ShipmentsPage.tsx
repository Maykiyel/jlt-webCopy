import { Navigate, useParams } from "react-router";
import { OngoingShipments } from "@/features/shipments/components/Logistics/OngoingShipments";
import { DeliveredShipments } from "@/features/shipments/components/Logistics/DeliveredShipments";
import { ShipmentLogistics } from "@/features/shipments/components/Logistics/ShipmentLogistics";

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
  /*
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
  }*/

  return <Navigate to="/shipments/logistics" replace />;
}
