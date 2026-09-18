import { useQuery } from "@tanstack/react-query";

import {
  PaginatedReturnRequests,
  QueryReturnRequestsInput,
} from "@/types/return-request";

function buildQueryString(query: QueryReturnRequestsInput) {
  const params = new URLSearchParams();
  if (query.search) params.set("search", query.search);
  if (query.status) params.set("status", query.status);
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

async function fetchReturnRequests(query: QueryReturnRequestsInput) {
  const res = await fetch(
    `/api/admin/return-requests${buildQueryString(query)}`,
  );
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.message ?? "Không thể tải danh sách yêu cầu đổi trả");
  }
  return data as PaginatedReturnRequests;
}

export function useReturnRequests(query: QueryReturnRequestsInput = {}) {
  return useQuery({
    queryKey: ["return-requests", query],
    queryFn: () => fetchReturnRequests(query),
  });
}
