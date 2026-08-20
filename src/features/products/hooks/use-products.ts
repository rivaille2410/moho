import { useQuery } from "@tanstack/react-query";

import { ProductsResponse, QueryProductsParams } from "@/types/product";

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

export const useProducts = (params: QueryProductsParams = {}) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => fetchProducts(params),
    staleTime: 5 * 60 * 1000,
  });
};
