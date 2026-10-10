import { useQuery } from "@tanstack/react-query";
import { returnRequestsApi } from "../api/return-requests-api";
import { queryKeys } from "@/lib/query-keys";
import { PaginatedReturnRequests, QueryReturnRequestsInput } from "@/types/return-request";

export function useReturnRequests(query: QueryReturnRequestsInput = {}) {
  return useQuery<PaginatedReturnRequests>({
    queryKey: queryKeys.returnRequests.list(query),
    queryFn: () => returnRequestsApi.list(query),
  });
}
