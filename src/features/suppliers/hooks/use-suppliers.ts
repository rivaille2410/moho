import { useQuery } from "@tanstack/react-query";

import { PaginatedResponse } from "@/types/shared";
import { QuerySuppliersParams, Supplier } from "@/types/supplier";

async function fetchSuppliers(
  params: QuerySuppliersParams,
): Promise<PaginatedResponse<Supplier>> {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    searchParams.set(key, String(value));
  });

  const qs = searchParams.toString();
  const res = await fetch(`/api/suppliers${qs ? `?${qs}` : ""}`);

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message ?? "Không thể tải danh sách nhà cung cấp");
  }

  return res.json();
}

export function useSuppliers(params: QuerySuppliersParams = {}) {
  return useQuery({
    queryKey: ["suppliers", params],
    queryFn: () => fetchSuppliers(params),
  });
}
