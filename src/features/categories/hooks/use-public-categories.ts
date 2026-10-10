import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import {
  publicQueryRetryDelay,
  shouldRetryPublicQuery,
} from "@/lib/query-client";

import { PublicCategory } from "@/types/product";

export type QueryPublicCategoriesParams = {
  search?: string;
  parentId?: string;
  rootOnly?: boolean;
};

async function fetchPublicCategories(
  params: QueryPublicCategoriesParams = {},
  signal?: AbortSignal,
): Promise<PublicCategory[]> {
  const searchParams = new URLSearchParams();

  if (params.search) searchParams.set("search", params.search);
  if (params.parentId) searchParams.set("parentId", params.parentId);
  if (params.rootOnly !== undefined) {
    searchParams.set("rootOnly", String(params.rootOnly));
  }

  const query = searchParams.toString();
  return apiClient.get<PublicCategory[]>(
    `/api/public/categories${query ? `?${query}` : ""}`,
    { signal },
  );
}

export const usePublicCategories = (
  params: QueryPublicCategoriesParams = {},
  options?: { enabled?: boolean },
  initialData?: PublicCategory[],
) => {
  return useQuery({
    queryKey: ["public-categories", params],
    queryFn: ({ signal }) => fetchPublicCategories(params, signal),
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData,
    enabled: options?.enabled,
    initialData,
    retry: shouldRetryPublicQuery,
    retryDelay: publicQueryRetryDelay,
  });
};
