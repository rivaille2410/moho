import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import {
  publicQueryRetryDelay,
  shouldRetryPublicQuery,
} from "@/lib/query-client";

export type ProductSlug = {
  id: string;
  slug: string;
};

async function getProductSlugs(
  ids: string[],
  signal?: AbortSignal,
): Promise<ProductSlug[]> {
  if (ids.length === 0) return [];

  const params = new URLSearchParams({ ids: ids.join(",") });
  return apiClient.get<ProductSlug[]>(
    "/api/public/products/slugs?" + params.toString(),
    { signal },
  );
}

export function useProductSlugs(ids: string[]) {
  const uniqueIds = Array.from(new Set(ids)).sort();

  return useQuery({
    queryKey: ["product-slugs", uniqueIds],
    queryFn: ({ signal }) => getProductSlugs(uniqueIds, signal),
    enabled: uniqueIds.length > 0,
    staleTime: 5 * 60 * 1000,
    retry: shouldRetryPublicQuery,
    retryDelay: publicQueryRetryDelay,
    select: (data): Record<string, string> =>
      Object.fromEntries(data.map((p) => [p.id, p.slug])),
  });
}
