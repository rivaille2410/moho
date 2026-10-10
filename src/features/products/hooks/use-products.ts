import { useQuery } from "@tanstack/react-query";
import { productsApi } from "../api/products-api";
import { queryKeys } from "@/lib/query-keys";
import { ProductsResponse, QueryProductsParams } from "@/types/product";

export const useProducts = (params: QueryProductsParams = {}) => {
  return useQuery<ProductsResponse>({
    queryKey: queryKeys.products.list(params),
    queryFn: () => productsApi.list(params),
    staleTime: 5 * 60 * 1000,
  });
};
