import { useQuery } from "@tanstack/react-query";

import { TopProduct, TopProductsParams } from "@/types/dashboard";

function buildQueryString(params: TopProductsParams) {
  const search = new URLSearchParams();
  if (params.limit) search.set("limit", String(params.limit));

  const query = search.toString();
  return query ? `?${query}` : "";
}

async function getTopProducts(
  params: TopProductsParams,
): Promise<TopProduct[]> {
  const res = await fetch(
    `/api/dashboard/top-products${buildQueryString(params)}`,
  );

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message ?? "Không thể tải sản phẩm bán chạy");
  }
  return data;
}

export function useTopProducts(params: TopProductsParams = {}) {
  return useQuery({
    queryKey: ["dashboard-top-products", params],
    queryFn: () => getTopProducts(params),
  });
}
