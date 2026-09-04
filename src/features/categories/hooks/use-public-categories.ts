import { useQuery, keepPreviousData } from "@tanstack/react-query";

import { PublicCategory } from "@/types/product";

export type QueryPublicCategoriesParams = {
  search?: string;
  parentId?: string;
  rootOnly?: boolean;
};

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
