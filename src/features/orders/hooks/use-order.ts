import { useQuery } from "@tanstack/react-query";
import { ordersApi } from "../api/orders-api";
import { queryKeys } from "@/lib/query-keys";
import { OrderDetail } from "@/types/order";

export function useOrder(id: string | undefined) {
  return useQuery<OrderDetail>({
    queryKey: queryKeys.orders.detail(id ?? ""),
    queryFn: () => ordersApi.get(id as string),
    enabled: !!id,
  });
}
