import { useQuery } from "@tanstack/react-query";

import { ReturnRequest } from "@/types/return-request";

async function fetchMyReturnRequest(id: string) {
  const res = await fetch(`/api/return-requests/${id}`);
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.message ?? "Không thể tải yêu cầu trả hàng");
  }
  return data as ReturnRequest;
}

export function useMyReturnRequestDetail(id: string | undefined) {
  return useQuery({
    queryKey: ["my-return-requests", id],
    queryFn: () => fetchMyReturnRequest(id as string),
    enabled: !!id,
  });
}
