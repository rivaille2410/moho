import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { PostsResponse, QueryPostsParams } from "@/types/post";

export type QueryPublicPostsParams = Omit<QueryPostsParams, "status">;

async function fetchPublicPosts(
  params: QueryPublicPostsParams,
): Promise<PostsResponse> {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.search) searchParams.set("search", params.search);

  const query = searchParams.toString();
  const res = await fetch(`/api/public/posts${query ? `?${query}` : ""}`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

  return res.json();
}

export const usePublicPosts = (params: QueryPublicPostsParams = {}) => {
  return useQuery({
    queryKey: ["public-posts", params],
    queryFn: () => fetchPublicPosts(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const usePublicPostsInfinite = (
  params: Omit<QueryPublicPostsParams, "page"> = { limit: 12 },
) => {
  return useInfiniteQuery({
    queryKey: ["public-posts-infinite", params],
    queryFn: ({ pageParam }) =>
      fetchPublicPosts({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
  });
};
