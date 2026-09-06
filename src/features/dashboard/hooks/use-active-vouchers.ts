import { useQuery } from "@tanstack/react-query";

import { ActiveVoucher } from "@/types/dashboard";

async function getActiveVouchers(): Promise<ActiveVoucher[]> {
  const res = await fetch("/api/dashboard/active-vouchers");

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message ?? "Không thể tải danh sách voucher");
  }
  return data;
}

export function useActiveVouchers() {
  return useQuery({
    queryKey: ["dashboard-active-vouchers"],
    queryFn: getActiveVouchers,
  });
}
