import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import {
  publicQueryRetryDelay,
  shouldRetryPublicQuery,
} from "@/lib/query-client";

import type { ProductListItem } from "@/types/product";

export const usePublicProduct = (
  slug: string | undefined,
  initialData?: ProductListItem | null,
) => {
  return useQuery({
    queryKey: ["public-products", slug],
    queryFn: ({ signal }) =>
      apiClient.get<ProductListItem>(
        `/api/public/products/${encodeURIComponent(slug as string)}`,
        { signal },
      ),
    enabled: !!slug,
    initialData: initialData ?? undefined,
    staleTime: 60_000,
    retry: shouldRetryPublicQuery,
    retryDelay: publicQueryRetryDelay,
  });
};
