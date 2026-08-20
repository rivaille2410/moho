"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import { ProductListItem } from "@/types/product";

export interface QueryBestSellerProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
}

interface BestSellerProductsResponse {
  data: ProductListItem[];
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

async function fetchBestSellerProducts(
  params: QueryBestSellerProductsParams,
): Promise<BestSellerProductsResponse> {
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(params.page ?? 1));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.search) searchParams.set("search", params.search);
  if (params.categoryId) searchParams.set("categoryId", params.categoryId);

  const res = await fetch(
    `/api/public/products/best-sellers?${searchParams.toString()}`,
    { method: "GET" },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch best-selling products");
  }

  return res.json();
}

export const usePublicBestSellerProductsInfinite = (
  params: Omit<QueryBestSellerProductsParams, "page"> = { limit: 12 },
) => {
  return useInfiniteQuery({
    queryKey: ["best-seller-products", params],
    queryFn: ({ pageParam }) =>
      fetchBestSellerProducts({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
  });
};
