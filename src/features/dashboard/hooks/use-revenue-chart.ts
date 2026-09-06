import { useQuery } from "@tanstack/react-query";

import { DashboardRangeParams, RevenueChartPoint } from "@/types/dashboard";

function buildQueryString(params: DashboardRangeParams) {
  const search = new URLSearchParams();
  if (params.range) search.set("range", params.range);

  const query = search.toString();
  return query ? `?${query}` : "";
}

async function getRevenueChart(
  params: DashboardRangeParams,
): Promise<RevenueChartPoint[]> {
  const res = await fetch(
    `/api/dashboard/revenue-chart${buildQueryString(params)}`,
  );

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message ?? "Không thể tải biểu đồ doanh thu");
  }
  return data;
}

export function useRevenueChart(params: DashboardRangeParams = {}) {
  return useQuery({
    queryKey: ["dashboard-revenue-chart", params],
    queryFn: () => getRevenueChart(params),
  });
}
