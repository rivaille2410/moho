import { useQuery } from "@tanstack/react-query";
import { ordersApi } from "../api/orders-api";
import { queryKeys } from "@/lib/query-keys";
import { OrdersListResponse, QueryOrdersParams } from "@/types/order";

export function useMyOrders(params: QueryOrdersParams = {}) {
  return useQuery<OrdersListResponse>({
    queryKey: queryKeys.orders.myOrders(params),
    queryFn: () => ordersApi.myOrders(params),
  });
}
