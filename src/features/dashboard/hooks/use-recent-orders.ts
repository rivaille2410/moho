import { useQuery } from "@tanstack/react-query";

import { RecentOrder, RecentOrdersParams } from "@/types/dashboard";

async function getRecentOrders(
  params: RecentOrdersParams,
): Promise<RecentOrder[]> {
  const searchParams = new URLSearchParams();
  if (params.limit) searchParams.set("limit", String(params.limit));

  const res = await fetch(
    `/api/dashboard/recent-orders?${searchParams.toString()}`,
  );

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message ?? "Không thể tải đơn hàng gần đây");
  }
  return data;
}

export function useRecentOrders(params: RecentOrdersParams = {}) {
  return useQuery({
    queryKey: ["dashboard-recent-orders", params],
    queryFn: () => getRecentOrders(params),
  });
}
