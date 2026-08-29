import { useQuery } from "@tanstack/react-query";

import { OrdersListResponse, QueryOrdersParams } from "@/types/order";

function buildQueryString(params: QueryOrdersParams) {
  const search = new URLSearchParams();

  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));
  if (params.status) search.set("status", params.status);
  if (params.search) search.set("search", params.search);

  const query = search.toString();
  return query ? `?${query}` : "";
}

async function getMyOrders(
  params: QueryOrdersParams,
): Promise<OrdersListResponse> {
  const res = await fetch(`/api/orders/me/list${buildQueryString(params)}`);

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message ?? "Không thể tải danh sách đơn hàng");
  }
  return data;
}

export function useMyOrders(params: QueryOrdersParams = {}) {
  return useQuery({
    queryKey: ["my-orders", params],
    queryFn: () => getMyOrders(params),
  });
}
