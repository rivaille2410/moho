import { useQuery } from "@tanstack/react-query";

import { Warehouse } from "@/types/warehouse";

async function fetchWarehouse(id: string): Promise<Warehouse> {
  const res = await fetch(`/api/warehouses/${id}`);

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message ?? "Không thể tải kho hàng");
  }

  return res.json();
}

export function useWarehouse(id: string) {
  return useQuery({
    queryKey: ["warehouses", id],
    queryFn: () => fetchWarehouse(id),
    enabled: !!id,
  });
}
