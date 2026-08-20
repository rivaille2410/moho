import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { ProductsResponse, QueryProductsParams } from "@/types/product";

export type QueryPublicProductsParams = Omit<QueryProductsParams, "status">;

async function fetchPublicProducts(
  params: QueryPublicProductsParams,
): Promise<ProductsResponse> {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.search) searchParams.set("search", params.search);
  if (params.categoryId) searchParams.set("categoryId", params.categoryId);
  if (params.outOfStock !== undefined) {
    searchParams.set("outOfStock", String(params.outOfStock));
  }

  const query = searchParams.toString();
  const res = await fetch(`/api/public/products${query ? `?${query}` : ""}`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}

export const usePublicProducts = (params: QueryPublicProductsParams = {}) => {
  return useQuery({
    queryKey: ["public-products", params],
    queryFn: () => fetchPublicProducts(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const usePublicProductsInfinite = (
  params: Omit<QueryPublicProductsParams, "page"> = { limit: 12 },
) => {
  return useInfiniteQuery({
    queryKey: ["public-products-infinite", params],
    queryFn: ({ pageParam }) =>
      fetchPublicProducts({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
  });
};
