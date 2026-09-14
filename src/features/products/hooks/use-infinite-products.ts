import { useInfiniteQuery } from "@tanstack/react-query";

import { ProductsResponse, QueryProductsParams } from "@/types/product";

type UseInfiniteProductsParams = Omit<QueryProductsParams, "page">;

async function fetchProducts(
  params: QueryProductsParams,
): Promise<ProductsResponse> {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.search) searchParams.set("search", params.search);
  if (params.status) searchParams.set("status", params.status);
  if (params.categoryId) searchParams.set("categoryId", params.categoryId);
  if (params.outOfStock !== undefined) {
    searchParams.set("outOfStock", String(params.outOfStock));
  }

  const query = searchParams.toString();
  const res = await fetch(`/api/products${query ? `?${query}` : ""}`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}

export function useInfiniteProducts(params: UseInfiniteProductsParams = {}) {
  return useInfiniteQuery({
    queryKey: ["products", "infinite", params],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      fetchProducts({ ...params, page: pageParam, limit: params.limit ?? 20 }),
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
    staleTime: 5 * 60 * 1000,
  });
}
