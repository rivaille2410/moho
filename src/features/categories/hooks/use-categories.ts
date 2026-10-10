import { useQuery } from "@tanstack/react-query";
import { categoriesApi } from "../api/categories-api";
import { queryKeys } from "@/lib/query-keys";
import { CategoryListItem, QueryCategoriesParams } from "@/types/category";

export const useCategories = (params: QueryCategoriesParams = {}) => {
  return useQuery<CategoryListItem[]>({
    queryKey: queryKeys.categories.list(params),
    queryFn: () => categoriesApi.list(params),
    staleTime: 5 * 60 * 1000,
  });
};
