import { useInfiniteQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import {
  publicQueryRetryDelay,
  shouldRetryPublicQuery,
} from "@/lib/query-client";

import { ProductListItem } from "@/types/product";

interface UseRelatedProductsOptions {
  limit?: number;
}

interface RelatedProductsResponse {
  data: ProductListItem[];
  meta: {
    nextCursor: string | null;
    hasNextPage: boolean;
  };
}

async function fetchRelatedProducts(
  slug: string,
  cursor: string | undefined,
  limit?: number,
  signal?: AbortSignal,
): Promise<RelatedProductsResponse> {
  const searchParams = new URLSearchParams();
  if (cursor) searchParams.set("cursor", cursor);
  if (limit) searchParams.set("limit", String(limit));

  const query = searchParams.toString();
  return apiClient.get<RelatedProductsResponse>(
    `/api/public/products/${encodeURIComponent(slug)}/related${query ? `?${query}` : ""}`,
    { signal },
  );
}

export const useRelatedProducts = (
  slug: string | undefined,
  options?: UseRelatedProductsOptions,
) => {
  return useInfiniteQuery({
    queryKey: ["related-products", slug, options?.limit],
    queryFn: ({ pageParam, signal }) =>
      fetchRelatedProducts(slug as string, pageParam, options?.limit, signal),
    getNextPageParam: (lastPage) => lastPage.meta.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    retry: shouldRetryPublicQuery,
    retryDelay: publicQueryRetryDelay,
  });
};
