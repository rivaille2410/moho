import { useQuery } from "@tanstack/react-query";

import { LowStockParams, LowStockVariant } from "@/types/dashboard";

function buildQueryString(params: LowStockParams) {
  const search = new URLSearchParams();
  if (params.threshold !== undefined)
    search.set("threshold", String(params.threshold));
  if (params.limit) search.set("limit", String(params.limit));

  const query = search.toString();
  return query ? `?${query}` : "";
}

async function getLowStock(params: LowStockParams): Promise<LowStockVariant[]> {
  const res = await fetch(
    `/api/dashboard/low-stock${buildQueryString(params)}`,
  );

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message ?? "Không thể tải danh sách tồn kho thấp");
  }
  return data;
}

export function useLowStock(params: LowStockParams = {}) {
  return useQuery({
    queryKey: ["dashboard-low-stock", params],
    queryFn: () => getLowStock(params),
  });
}
