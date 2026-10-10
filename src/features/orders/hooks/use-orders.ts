import { useQuery } from "@tanstack/react-query";
import { ordersApi } from "../api/orders-api";
import { queryKeys } from "@/lib/query-keys";
import { OrdersListResponse, QueryOrdersParams } from "@/types/order";

export function useOrders(params: QueryOrdersParams = {}) {
  return useQuery<OrdersListResponse>({
    queryKey: queryKeys.orders.list(params),
    queryFn: () => ordersApi.list(params),
  });
}
