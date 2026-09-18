import { useQuery } from "@tanstack/react-query";

import { ReturnRequest } from "@/types/return-request";

async function fetchReturnRequest(id: string) {
  const res = await fetch(`/api/admin/return-requests/${id}`);
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.message ?? "Không thể tải yêu cầu đổi trả");
  }
  return data as ReturnRequest;
}

export function useReturnRequest(id: string | undefined) {
  return useQuery({
    queryKey: ["return-requests", id],
    queryFn: () => fetchReturnRequest(id as string),
    enabled: !!id,
  });
}
