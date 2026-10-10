import { useQuery } from "@tanstack/react-query";
import { purchaseOrdersApi } from "../api/purchase-orders-api";
import { queryKeys } from "@/lib/query-keys";
import { PurchaseOrder } from "@/types/purchase-order";

export function usePurchaseOrder(id: string) {
  return useQuery<PurchaseOrder>({
    queryKey: queryKeys.purchaseOrders.detail(id),
    queryFn: () => purchaseOrdersApi.get(id),
    enabled: !!id,
  });
}
