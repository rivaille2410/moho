import { useQuery } from "@tanstack/react-query";

import { PaginatedResponse } from "@/types/shared";
import {
  PurchaseOrder,
  QueryPurchaseOrdersParams,
} from "@/types/purchase-order";

async function fetchPurchaseOrders(
  params: QueryPurchaseOrdersParams,
): Promise<PaginatedResponse<PurchaseOrder>> {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    searchParams.set(key, String(value));
  });

  const qs = searchParams.toString();
  const res = await fetch(`/api/purchase-orders${qs ? `?${qs}` : ""}`);

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message ?? "Không thể tải danh sách đơn nhập hàng");
  }

  return res.json();
}

export function usePurchaseOrders(params: QueryPurchaseOrdersParams = {}) {
  return useQuery({
    queryKey: ["purchase-orders", params],
    queryFn: () => fetchPurchaseOrders(params),
  });
}
