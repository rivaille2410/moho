import { useQuery } from "@tanstack/react-query";

import { Warehouse } from "@/types/warehouse";

async function fetchWarehouses(): Promise<Warehouse[]> {
  const res = await fetch("/api/warehouses");

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message ?? "Không thể tải danh sách kho hàng");
  }

  return res.json();
}

export function useWarehouses() {
  return useQuery({
    queryKey: ["warehouses"],
    queryFn: fetchWarehouses,
  });
}
