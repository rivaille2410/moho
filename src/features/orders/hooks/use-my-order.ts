import { useQuery } from "@tanstack/react-query";
import { ordersApi } from "../api/orders-api";
import { queryKeys } from "@/lib/query-keys";
import { OrderDetail } from "@/types/order";

export function useMyOrder(id: string | undefined) {
  return useQuery<OrderDetail>({
    queryKey: queryKeys.orders.myDetail(id ?? ""),
    queryFn: () => ordersApi.myOrder(id as string),
    enabled: !!id,
  });
}
