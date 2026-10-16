import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import {
  publicQueryRetryDelay,
  shouldRetryPublicQuery,
} from "@/lib/query-client";

import {
  CursorProductsResponse,
  PublicColorOption,
  QueryProductsParams,
} from "@/types/product";

export type QueryPublicProductsParams = Omit<QueryProductsParams, "status">;
type CursorPublicProductsParams = Omit<QueryPublicProductsParams, "page"> & {
  cursor?: string;
};

function buildProductsSearchParams(
  params: CursorPublicProductsParams,
): URLSearchParams {
  const searchParams = new URLSearchParams();

  if (params.cursor) searchParams.set("cursor", params.cursor);
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.search) searchParams.set("search", params.search);
  if (params.categoryId) searchParams.set("categoryId", params.categoryId);
  if (params.outOfStock !== undefined) {
    searchParams.set("outOfStock", String(params.outOfStock));
  }
  if (params.onSale !== undefined) {
    searchParams.set("onSale", String(params.onSale));
  }
  if (params.colors?.length) {
    searchParams.set("colors", params.colors.join(","));
  }
  if (params.minPrice !== undefined) {
    searchParams.set("minPrice", String(params.minPrice));
  }
  if (params.maxPrice !== undefined) {
    searchParams.set("maxPrice", String(params.maxPrice));
  }
  if (params.sortBy) searchParams.set("sortBy", params.sortBy);

  return searchParams;
}

async function fetchPublicProducts(
  params: CursorPublicProductsParams,
  signal?: AbortSignal,
): Promise<CursorProductsResponse> {
  const query = buildProductsSearchParams(params).toString();
  return apiClient.get<CursorProductsResponse>(
    `/api/public/products${query ? `?${query}` : ""}`,
    { signal },
  );
}

async function fetchPublicBestSellers(
  params: CursorPublicProductsParams,
  signal?: AbortSignal,
): Promise<CursorProductsResponse> {
  const query = buildProductsSearchParams(params).toString();
  return apiClient.get<CursorProductsResponse>(
    `/api/public/products/best-sellers${query ? `?${query}` : ""}`,
    { signal },
  );
}

async function fetchPublicColors(
  categoryId?: string,
  signal?: AbortSignal,
): Promise<PublicColorOption[]> {
  const searchParams = new URLSearchParams();
  if (categoryId) searchParams.set("categoryId", categoryId);

  const query = searchParams.toString();
  return apiClient.get<PublicColorOption[]>(
    `/api/public/products/colors${query ? `?${query}` : ""}`,
    { signal },
  );
}

export const usePublicProductsInfinite = (
  params: Omit<QueryPublicProductsParams, "page"> = { limit: 12 },
  initialPage?: CursorProductsResponse,
  options?: { enabled?: boolean },
) => {
  return useInfiniteQuery({
    queryKey: ["public-products-infinite", params],
    queryFn: ({ pageParam, signal }) =>
      fetchPublicProducts({ ...params, cursor: pageParam }, signal),
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.nextCursor ?? undefined : undefined,
    initialPageParam: undefined as string | undefined,
    initialData: initialPage
      ? { pages: [initialPage], pageParams: [undefined] }
      : undefined,
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData,
    enabled: options?.enabled,
    retry: shouldRetryPublicQuery,
    retryDelay: publicQueryRetryDelay,
  });
};

export const usePublicBestSellersInfinite = (
  params: Omit<QueryPublicProductsParams, "page"> = { limit: 12 },
  initialPage?: CursorProductsResponse,
) => {
  return useInfiniteQuery({
    queryKey: ["public-best-sellers-infinite", params],
    queryFn: ({ pageParam, signal }) =>
      fetchPublicBestSellers({ ...params, cursor: pageParam }, signal),
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.nextCursor ?? undefined : undefined,
    initialPageParam: undefined as string | undefined,
    initialData: initialPage
      ? { pages: [initialPage], pageParams: [undefined] }
      : undefined,
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData,
    retry: shouldRetryPublicQuery,
    retryDelay: publicQueryRetryDelay,
  });
};

export const usePublicColors = (categoryId?: string) => {
  return useQuery({
    queryKey: ["public-colors", categoryId],
    queryFn: ({ signal }) => fetchPublicColors(categoryId, signal),
    staleTime: 30 * 60 * 1000,
    placeholderData: keepPreviousData,
    retry: shouldRetryPublicQuery,
    retryDelay: publicQueryRetryDelay,
  });
};
