import { useQuery } from "@tanstack/react-query";

import { Supplier } from "@/types/supplier";

async function fetchSupplier(id: string): Promise<Supplier> {
  const res = await fetch(`/api/suppliers/${id}`);

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message ?? "Không thể tải nhà cung cấp");
  }

  return res.json();
}

export function useSupplier(id: string) {
  return useQuery({
    queryKey: ["suppliers", id],
    queryFn: () => fetchSupplier(id),
    enabled: !!id,
  });
}
