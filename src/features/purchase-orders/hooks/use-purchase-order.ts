import { useQuery } from "@tanstack/react-query";

import { PurchaseOrder } from "@/types/purchase-order";

async function fetchPurchaseOrder(id: string): Promise<PurchaseOrder> {
  const res = await fetch(`/api/purchase-orders/${id}`);

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message ?? "Không thể tải đơn nhập hàng");
  }

  return res.json();
}

export function usePurchaseOrder(id: string) {
  return useQuery({
    queryKey: ["purchase-orders", id],
    queryFn: () => fetchPurchaseOrder(id),
    enabled: !!id,
  });
}
