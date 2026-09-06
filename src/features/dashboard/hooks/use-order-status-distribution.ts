import { useQuery } from "@tanstack/react-query";

import {
  DashboardRangeParams,
  OrderStatusDistribution,
} from "@/types/dashboard";

async function getOrderStatusDistribution(
  params: DashboardRangeParams,
): Promise<OrderStatusDistribution> {
  const searchParams = new URLSearchParams();
  if (params.range) searchParams.set("range", params.range);

  const res = await fetch(
    `/api/dashboard/order-status-distribution?${searchParams.toString()}`,
  );

  const data = await res.json();
  if (!res.ok) {
    throw new Error(
      data?.message ?? "Không thể tải phân bố trạng thái đơn hàng",
    );
  }
  return data;
}

export function useOrderStatusDistribution(params: DashboardRangeParams = {}) {
  return useQuery({
    queryKey: ["dashboard-order-status-distribution", params],
    queryFn: () => getOrderStatusDistribution(params),
  });
}
