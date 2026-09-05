import { useQuery } from "@tanstack/react-query";

import { Voucher } from "@/types/voucher";

async function fetchVoucher(id: string): Promise<Voucher> {
  const res = await fetch(`/api/vouchers/${id}`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message ?? "Không thể tải thông tin voucher");
  }
  return data;
}

export function useVoucher(id: string | undefined) {
  return useQuery({
    queryKey: ["vouchers", id],
    queryFn: () => fetchVoucher(id as string),
    enabled: !!id,
  });
}
