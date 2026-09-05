"use client";

import { useQuery } from "@tanstack/react-query";

export interface ProductOption {
  id: string;
  name: string;
}

async function fetchProductOptions(): Promise<ProductOption[]> {
  const res = await fetch("/api/products?limit=1000&fields=id,name");
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message ?? "Không thể tải danh sách sản phẩm");
  }
  return data.data ?? data;
}

export function useProductOptions() {
  return useQuery({
    queryKey: ["products", "options"],
    queryFn: fetchProductOptions,
  });
}
