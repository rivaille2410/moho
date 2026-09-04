import {
  useQuery,
  keepPreviousData,
  useInfiniteQuery,
} from "@tanstack/react-query";

import {
  PublicCategory,
  ProductsResponse,
  PublicColorOption,
  QueryProductsParams,
} from "@/types/product";

export type QueryPublicProductsParams = Omit<QueryProductsParams, "status">;

export type QueryPublicCategoriesParams = {
  search?: string;
  parentId?: string;
  rootOnly?: boolean;
};

function buildProductsSearchParams(
  params: QueryPublicProductsParams,
): URLSearchParams {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set("page", String(params.page));
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
  params: QueryPublicProductsParams,
): Promise<ProductsResponse> {
  const query = buildProductsSearchParams(params).toString();
  const res = await fetch(`/api/public/products${query ? `?${query}` : ""}`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}

// Best sellers ignore `sortBy` server-side (always sorted by soldCount desc),
// but all other filters (category, price, colors, onSale, outOfStock) apply.
async function fetchPublicBestSellers(
  params: QueryPublicProductsParams,
): Promise<ProductsResponse> {
  const query = buildProductsSearchParams(params).toString();
  const res = await fetch(
    `/api/public/products/best-sellers${query ? `?${query}` : ""}`,
    { method: "GET" },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch best sellers");
  }

  return res.json();
}

async function fetchPublicCategories(
  params: QueryPublicCategoriesParams = {},
): Promise<PublicCategory[]> {
  const searchParams = new URLSearchParams();

  if (params.search) searchParams.set("search", params.search);
  if (params.parentId) searchParams.set("parentId", params.parentId);
  if (params.rootOnly !== undefined) {
    searchParams.set("rootOnly", String(params.rootOnly));
  }

  const query = searchParams.toString();
  const res = await fetch(`/api/public/categories${query ? `?${query}` : ""}`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  return res.json();
}

// NOTE: assumed route — adjust to match the actual controller path if different.
async function fetchPublicColors(
  categoryId?: string,
): Promise<PublicColorOption[]> {
  const searchParams = new URLSearchParams();
  if (categoryId) searchParams.set("categoryId", categoryId);

  const query = searchParams.toString();
  const res = await fetch(
    `/api/public/products/colors${query ? `?${query}` : ""}`,
    { method: "GET" },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch colors");
  }

  return res.json();
}

export const usePublicProducts = (params: QueryPublicProductsParams = {}) => {
  return useQuery({
    queryKey: ["public-products", params],
    queryFn: () => fetchPublicProducts(params),
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
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
    placeholderData: keepPreviousData,
  });
};

export const usePublicBestSellersInfinite = (
  params: Omit<QueryPublicProductsParams, "page"> = { limit: 12 },
) => {
  return useInfiniteQuery({
    queryKey: ["public-best-sellers-infinite", params],
    queryFn: ({ pageParam }) =>
      fetchPublicBestSellers({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
};

export const usePublicCategories = (
  params: QueryPublicCategoriesParams = {},
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: ["public-categories", params],
    queryFn: () => fetchPublicCategories(params),
    staleTime: 30 * 60 * 1000,
    placeholderData: keepPreviousData,
    enabled: options?.enabled,
  });
};

export const usePublicColors = (categoryId?: string) => {
  return useQuery({
    queryKey: ["public-colors", categoryId],
    queryFn: () => fetchPublicColors(categoryId),
    staleTime: 30 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
};
