import { useQuery } from "@tanstack/react-query";
import { purchaseOrdersApi } from "../api/purchase-orders-api";
import { queryKeys } from "@/lib/query-keys";
import { PaginatedResponse } from "@/types/shared";
import { PurchaseOrder, QueryPurchaseOrdersParams } from "@/types/purchase-order";

export function usePurchaseOrders(params: QueryPurchaseOrdersParams = {}) {
  return useQuery<PaginatedResponse<PurchaseOrder>>({
    queryKey: queryKeys.purchaseOrders.list(params),
    queryFn: () => purchaseOrdersApi.list(params),
  });
}
