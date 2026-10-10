import type {
  ProductsResponse,
  PublicCategory,
  QueryProductsParams,
} from "@/types/product";
import { fetchPublicApi } from "@/lib/public-api";

function queryString(
  params: Record<string, string | number | boolean | undefined>,
) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) query.set(key, String(value));
  }
  return query.toString();
}

export function getPublicProductsPage(
  params: QueryProductsParams,
): Promise<ProductsResponse> {
  const query = queryString({
    page: params.page ?? 1,
    limit: params.limit ?? 16,
    search: params.search,
    categoryId: params.categoryId,
    outOfStock: params.outOfStock,
    onSale: params.onSale,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
    sortBy: params.sortBy,
    colors: params.colors?.join(","),
  });
  return fetchPublicApi(`/public/products?${query}`, {
    ...(params.search ? {} : { revalidate: 60 }),
    tags: ["public-products"],
  });
}

export function getPublicBestSellersPage(params: {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
}): Promise<ProductsResponse> {
  const query = queryString({
    ...params,
    page: params.page ?? 1,
    limit: params.limit ?? 16,
  });
  return fetchPublicApi(`/public/products/best-sellers?${query}`, {
    ...(params.search ? {} : { revalidate: 60 }),
    tags: ["public-products"],
  });
}

export function getPublicRootCategories(): Promise<PublicCategory[]> {
  return fetchPublicApi("/public/categories?rootOnly=true", {
    revalidate: 60,
    tags: ["public-categories"],
  });
}
