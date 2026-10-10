import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { apiClient } from "@/lib/api-client";
import { type ShippableOrder, type QueryShippableOrdersParams } from "@/types/shipment";

export function useShippableOrders(params: QueryShippableOrdersParams = {}) {
  return useQuery({
    queryKey: queryKeys.shipments.shippableOrders(),
    queryFn: () =>
      apiClient.get<ShippableOrder[]>("/api/shipments/shippable-orders", {
        params: {
          search: params.search,
          limit: params.limit,
        },
      }),
  });
}
