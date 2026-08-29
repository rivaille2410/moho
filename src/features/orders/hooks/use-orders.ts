import { useQuery } from "@tanstack/react-query";

import { OrdersListResponse, QueryOrdersParams } from "@/types/order";

function buildQueryString(params: QueryOrdersParams) {
  const search = new URLSearchParams();

  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));
  if (params.status) search.set("status", params.status);
  if (params.userId) search.set("userId", params.userId);
  if (params.search) search.set("search", params.search);

  const query = search.toString();
  return query ? `?${query}` : "";
}

async function getOrders(
  params: QueryOrdersParams,
): Promise<OrdersListResponse> {
  const res = await fetch(`/api/orders${buildQueryString(params)}`);

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message ?? "Không thể tải danh sách đơn hàng");
  }
  return data;
}

export function useOrders(params: QueryOrdersParams = {}) {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => getOrders(params),
  });
}
