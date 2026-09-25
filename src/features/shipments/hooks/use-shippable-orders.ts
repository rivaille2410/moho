import { useQuery } from "@tanstack/react-query";

import {
  type ShippableOrder,
  type QueryShippableOrdersParams,
} from "@/types/shipment";

async function getShippableOrders(
  params: QueryShippableOrdersParams,
): Promise<ShippableOrder[]> {
  const searchParams = new URLSearchParams();
  if (params.search) searchParams.set("search", params.search);
  if (params.limit) searchParams.set("limit", String(params.limit));

  const query = searchParams.toString();
  const res = await fetch(
    `/api/shipments/shippable-orders${query ? `?${query}` : ""}`,
  );

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.message ?? "Không thể tải danh sách đơn hàng");
  }
  return data;
}

export function useShippableOrders(params: QueryShippableOrdersParams = {}) {
  return useQuery({
    queryKey: ["shipments", "shippable-orders", params],
    queryFn: () => getShippableOrders(params),
  });
}
