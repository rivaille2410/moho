"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export interface ProductOption {
  id: string;
  name: string;
}

interface ProductOptionsResponse {
  data: ProductOption[];
}

export function useProductOptions() {
  return useQuery({
    queryKey: ["products", "options"],
    queryFn: async () => {
      const res = await apiClient.get<ProductOptionsResponse>("/api/products", {
        params: { limit: 1000, fields: "id,name" },
      });
      return res.data ?? [];
    },
  });
}
