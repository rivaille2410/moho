import { useQuery } from "@tanstack/react-query";

import { DashboardRangeParams, DashboardStats } from "@/types/dashboard";

function buildQueryString(params: DashboardRangeParams) {
  const search = new URLSearchParams();
  if (params.range) search.set("range", params.range);

  const query = search.toString();
  return query ? `?${query}` : "";
}

async function getDashboardStats(
  params: DashboardRangeParams,
): Promise<DashboardStats> {
  const res = await fetch(`/api/dashboard/stats${buildQueryString(params)}`);

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message ?? "Không thể tải thống kê dashboard");
  }
  return data;
}

export function useDashboardStats(params: DashboardRangeParams = {}) {
  return useQuery({
    queryKey: ["dashboard-stats", params],
    queryFn: () => getDashboardStats(params),
  });
}
