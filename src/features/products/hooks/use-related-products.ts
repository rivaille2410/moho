import { useInfiniteQuery } from "@tanstack/react-query";

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
): Promise<RelatedProductsResponse> {
  const searchParams = new URLSearchParams();
  if (cursor) searchParams.set("cursor", cursor);
  if (limit) searchParams.set("limit", String(limit));

  const query = searchParams.toString();
  const res = await fetch(
    `/api/public/products/${slug}/related${query ? `?${query}` : ""}`,
    { method: "GET" },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch related products");
  }

  return res.json();
}

export const useRelatedProducts = (
  slug: string | undefined,
  options?: UseRelatedProductsOptions,
) => {
  return useInfiniteQuery({
    queryKey: ["related-products", slug, options?.limit],
    queryFn: ({ pageParam }) =>
      fetchRelatedProducts(slug as string, pageParam, options?.limit),
    getNextPageParam: (lastPage) => lastPage.meta.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
};
