import { useQuery } from "@tanstack/react-query";

import { TopCustomer, TopCustomersParams } from "@/types/dashboard";

async function getTopCustomers(
  params: TopCustomersParams,
): Promise<TopCustomer[]> {
  const searchParams = new URLSearchParams();
  if (params.range) searchParams.set("range", params.range);
  if (params.limit) searchParams.set("limit", String(params.limit));

  const res = await fetch(
    `/api/dashboard/top-customers?${searchParams.toString()}`,
  );

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message ?? "Không thể tải top khách hàng");
  }
  return data;
}

export function useTopCustomers(params: TopCustomersParams = {}) {
  return useQuery({
    queryKey: ["dashboard-top-customers", params],
    queryFn: () => getTopCustomers(params),
  });
}
