import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { vouchersApi } from "../api/vouchers-api";
import { queryKeys } from "@/lib/query-keys";
import { QueryVouchersParams, PaginatedVouchers } from "@/types/voucher";

export function useVouchers(params: QueryVouchersParams = {}) {
  return useQuery<PaginatedVouchers>({
    queryKey: queryKeys.vouchers.list(params),
    queryFn: () => vouchersApi.list(params),
    placeholderData: keepPreviousData,
  });
}
