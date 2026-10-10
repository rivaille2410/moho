import { useQuery } from "@tanstack/react-query";
import { shipmentsApi } from "../api/shipments-api";
import { queryKeys } from "@/lib/query-keys";
import { Shipment } from "@/types/shipment";

export function useShipment(id: string) {
  return useQuery<Shipment>({
    queryKey: queryKeys.shipments.detail(id),
    queryFn: () => shipmentsApi.get(id),
    enabled: !!id,
  });
}
