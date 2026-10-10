import { useQuery } from "@tanstack/react-query";
import { shipmentsApi, ShipmentListResponse } from "../api/shipments-api";
import { queryKeys } from "@/lib/query-keys";
import { QueryShipmentsParams } from "@/types/shipment";

export function useShipments(params: QueryShipmentsParams = {}) {
  return useQuery<ShipmentListResponse>({
    queryKey: queryKeys.shipments.list(params),
    queryFn: () => shipmentsApi.list(params),
  });
}
