import { useQuery } from "@tanstack/react-query";
import { vouchersApi } from "../api/vouchers-api";
import { queryKeys } from "@/lib/query-keys";
import { Voucher } from "@/types/voucher";

export function useVoucher(id: string | undefined) {
  return useQuery<Voucher>({
    queryKey: queryKeys.vouchers.detail(id ?? ""),
    queryFn: () => vouchersApi.get(id as string),
    enabled: !!id,
  });
}
