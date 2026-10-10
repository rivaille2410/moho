import { useInfiniteQuery } from "@tanstack/react-query";
import { postsApi } from "@/features/posts/api/posts-api";
import {
  publicQueryRetryDelay,
  shouldRetryPublicQuery,
} from "@/lib/query-client";

import { PostsResponse, QueryPostsParams } from "@/types/post";

export type QueryPublicPostsParams = Omit<QueryPostsParams, "status">;

export const usePublicPostsInfinite = (
  params: Omit<QueryPublicPostsParams, "page"> = { limit: 12 },
  initialPage?: PostsResponse,
) => {
  return useInfiniteQuery({
    queryKey: ["public-posts-infinite", params],
    queryFn: ({ pageParam, signal }) =>
      postsApi.publicList({ ...params, page: pageParam }, { signal }),
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
    initialPageParam: 1,
    initialData: initialPage
      ? { pages: [initialPage], pageParams: [1] }
      : undefined,
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
    retry: shouldRetryPublicQuery,
    retryDelay: publicQueryRetryDelay,
  });
};
