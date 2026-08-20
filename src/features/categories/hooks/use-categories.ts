import { useQuery } from "@tanstack/react-query";

import { CategoryListItem, QueryCategoriesParams } from "@/types/category";

async function fetchCategories(
  params: QueryCategoriesParams,
): Promise<CategoryListItem[]> {
  const searchParams = new URLSearchParams();

  if (params.search) searchParams.set("search", params.search);
  if (params.parentId) searchParams.set("parentId", params.parentId);
  if (params.rootOnly !== undefined) {
    searchParams.set("rootOnly", String(params.rootOnly));
  }

  const query = searchParams.toString();
  const res = await fetch(`/api/categories${query ? `?${query}` : ""}`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  return res.json();
}

export const useCategories = (params: QueryCategoriesParams = {}) => {
  return useQuery({
    queryKey: ["categories", params],
    queryFn: () => fetchCategories(params),
    staleTime: 5 * 60 * 1000,
  });
};
