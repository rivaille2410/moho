import { useQuery, keepPreviousData } from "@tanstack/react-query";

import { QueryVouchersParams, PaginatedVouchers } from "@/types/voucher";

async function fetchVouchers(
  params: QueryVouchersParams,
): Promise<PaginatedVouchers> {
  const search = new URLSearchParams();
  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));
  if (params.search) search.set("search", params.search);
  if (params.status) search.set("status", params.status);
  if (params.scope) search.set("scope", params.scope);

  const res = await fetch(`/api/vouchers?${search.toString()}`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message ?? "Không thể tải danh sách voucher");
  }
  return data;
}

export function useVouchers(params: QueryVouchersParams = {}) {
  return useQuery({
    queryKey: ["vouchers", params],
    queryFn: () => fetchVouchers(params),
    placeholderData: keepPreviousData,
  });
}
